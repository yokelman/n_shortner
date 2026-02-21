import Code from '../models/code.model.js';

// importing UTILITY
import { find_docs, validate } from './utils.js';

// controller for '/' (get codes for given owner)
// (owner of the codes needed) => (all codes of "owner" in json format)
export const getCodes = async (req, res, next) => {

    // setting the filter to find all codes
    let filter = {};

    try {

        let codes = await find_docs(filter, Code);
        // check for internal server error
        if (codes === null) {
            return res.status(500).json({ success: false, message: "internal server error" });
        }
        // check if no codes found
        if (codes.length === 0) {
            return res.status(404).json({ success: false, message: "no codes found", code: 404 });
        }

        // return the codes found
        return res.status(200).json({ success: true, codes: codes });
    } catch (error) {
        next(error);
    }
}

export const getCodesOwner = async (req, res, next) => {
    let filter = { owner: req.user };

    try {

        let codes = await find_docs(filter, Code);
        // check for internal server error
        if (codes === null) {
            return res.status(500).json({ success: false, message: "internal server error" });
        }
        // check if no codes found
        if (codes.length === 0) {
            return res.status(404).json({ success: false, message: "no codes found", code: 404 });
        }

        // return the codes found
        return res.status(200).json({ success: true, codes: codes });
    } catch (error) {
        next(error);
    }
}

// controller for '/assign' (assign a code to a user)
// (value of the code, where to redirect, note)
export const assignCode = async (req, res, next) => {

    // get value, redirect, note from user input
    let input = req.body;
    let owner = req.user;

    // validate the input
    let validation = await validate(input, ["value", "redirect", "note"]);
    if (validation.error) {
        return res.status(400).json({ success: false, message: validation.message });
    }

    try {
        // limit codes to 20 per user
        const userCodes = await find_docs({ owner: owner }, Code);
        if (userCodes !== null && userCodes.length >= 20) {
            return res.status(403).json({ success: false, message: "code limit reached (max 20)" });
        }

        // URL formatting
        let finalRedirect = input.redirect.trim();
        if (!finalRedirect.startsWith('http://') && !finalRedirect.startsWith('https://')) {
            finalRedirect = 'http://' + finalRedirect;
        }

        // capture screenshot using Microlink API
        let previewBase64 = null;
        try {
            const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(finalRedirect)}&screenshot=true&meta=false&embed=screenshot.url`;
            console.log(`[Microlink] Fetching snapshot for: ${finalRedirect}`);
            const response = await fetch(microlinkUrl, {
                headers: {
                    'User-Agent': 'n_shortener/1.0',
                    'Accept': 'image/jpeg, image/png, image/webp, */*'
                }
            });

            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                previewBase64 = Buffer.from(arrayBuffer).toString('base64');
                console.log(`[Microlink] Successfully fetched and converted snapshot.`);
            } else {
                console.error(`[Microlink] Screenshot failed with status: ${response.status} ${response.statusText}`);
                try {
                    const errorText = await response.text();
                    console.error(`[Microlink] Error details:`, errorText);
                } catch (e) { }
            }
        } catch (mlError) {
            console.error("[Microlink] Screenshot fetch entirely failed:");
            console.error(mlError);
            if (mlError.cause) {
                console.error("[Microlink] Cause:", mlError.cause);
            }
            // fallback gracefully without preview
        }

        // assign the code to the given owner
        const saved_code = await Code.create({ owner: owner, _id: input.value, redirect: finalRedirect, note: input.note, preview: previewBase64 });
        return res.status(201).json({ success: true, code: saved_code });
    } catch (error) {
        next(error);
    }
}

// controller for '/delete' (delete a code)
// (value,owner,password)=>(deletes the code if authenticated else gives suitable error)
export const deleteCode = async (req, res, next) => {

    // get value, owner, password from user input
    let input = req.body;

    // validate the input
    let validation = await validate(input, ["value"]);
    if (validation.error) {
        return res.status(400).json({ success: false, message: validation.message });
    }

    try {
        // CHECK IF VALUE EXISTS OR NOT IF IT DOESNT EXIST THEN DONT DELETE
        const exists = await find_docs({ _id: input.value }, Code);
        if (!exists || !exists[0]) {
            return res.status(404).json({ success: false, message: "code doesnt exist with that value" });
        }

        // verify owner matches the authenticated user
        if (exists[0].owner !== req.user) {
            return res.status(403).json({ success: false, message: "you do not own this code" });
        }


        // delete the code
        const deleted_code = await Code.deleteOne({ _id: input.value });
        return res.status(200).json({ success: true, code: deleted_code });
    } catch (error) {
        next(error);
    }
}