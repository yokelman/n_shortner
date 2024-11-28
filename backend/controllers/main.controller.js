// importing models
import Code from '../models/code.model.js'

// to server static file we need __dirname thats not in es module so we have to manually define it
import path from 'path'
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// importing UTILITY
import { find_docs } from './utils.js';

// redirect to the url set by owner
// (code) => (code validation, if valid and exists redirect)
export const redirectCode = async (req,res)=>{
    // get the code from url
    let {code} = req.params;
    
    // check if its a valid 6 digit code
    if(!/^\d{6}$/.test(code)){
        return res.status(400).json({success:false,message:"enter a valid 6 digit code"});
    }

    try {
        // find the code from database
        const found_code = await find_docs({value:code},Code);
        // if internal server error
        if(found_code == null){
            return res.status(500).json({success:false,message:"internal server error occurred"});
        }
        // if not found
        if(found_code.length == 0){
            return res.status(404).json({success:false,message:"code not found"});
        }
        // redirect if everything else is checked
        return res.redirect(found_code[0].redirect);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message:"something went wrong"});
    }
}

export const serverFile = (file_address) => async(req,res)=>{
    return res.sendFile(path.join(__dirname,'../../static',file_address));
}