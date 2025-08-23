// importing mongoose MODEL
import Code from '../models/code.model.js';

// importing UTILITY
import { bcrypt_auth, find_docs, authenticate, validate } from './utils.js';

// controller for '/' (get codes for given owner)
// (owner of the codes needed) => (all codes of "owner" in json format)
export const getCodes = async(req,res)=>{
    
    // setting the filter to find codes
    let filter = {visibility:"public"};
    
    try {
        
        let codes = await find_docs(filter,Code);
        // check for internal server error
        if(codes === null){
            return res.status(500).json({success:false,message:"internal server error"});
        }
        // check if no codes found
        if(codes.length === 0){
            return res.status(404).json({success:false,message:"no codes found",code:404});
        }
        
        // return the codes found
        return res.status(200).json({success: true,codes:codes});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message:"something went wrong"});
    }
}

export const getCodesOwner = async(req,res)=>{
    let cookies = req.cookies;
    let filter = {};

    let auth = await authenticate(cookies.token);
    if(auth.success){
        filter = {owner:auth.owner};
    }else{
        return res.status(401).json({success:false,message:"bad token"});
    }

    try {
        
        let codes = await find_docs(filter,Code);
        // check for internal server error
        if(codes === null){
            return res.status(500).json({success:false,message:"internal server error"});
        }
        // check if no codes found
        if(codes.length === 0){
            return res.status(404).json({success:false,message:"no codes found",code:404});
        }
        
        // return the codes found
        return res.status(200).json({success: true,codes:codes});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message:"something went wrong"});
    }
}

// controller for '/assign' (assign a code to a user)
// (value of the code, owner, password, where to redirect) => (authenticate and validate if yes then assign the code for given owner)
export const assignCode = async(req,res)=>{

    // get value, owner, password, redirect from user input
    let input = req.body;
    
    // validate the input
    let validation = await validate(input,["value","owner","redirect","password","visibility","note"]);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    
    try {
        // checking for dupes
        const code_exists = await find_docs({_id:input.value},Code);
        if(code_exists[0]){
            return res.status(409).json({success:false,message:"value is already taken"});
        }

        // authenticating user for assigning code
        const authenticated = await bcrypt_auth(input.owner,input.password);
        if(authenticated === null){
            return res.status(500).json({success:false,message:"internal server error"});
        }
        if(!authenticated){
            return res.status(401).json({success:false,message:"wrong username/password"});
        }
    
        // assign the code to the given owner
        const saved_code = await Code.create({owner:input.owner,_id:input.value,redirect:input.redirect,visibility:input.visibility,note:input.note});
        return res.status(201).json({success:true,code:saved_code});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message:"something went wrong"});
    }
}

// controller for '/delete' (delete a code)
// (value,owner,password)=>(deletes the code if authenticated else gives suitable error)
export const deleteCode = async(req,res)=>{

    // get value, owner, password from user input
    let input = req.body;
    
    // validate the input
    let validation = await validate(input,["value"]);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    try {
        // CHECK IF VALUE EXISTS OR NOT IF IT DOESNT EXIST THEN DONT DELETE
        const exists = await find_docs({_id:input.value},Code);
        if(!exists[0]){
            return res.status(404).json({success:false,message:"code doesnt exist with that value"});
        }
    
        // authenticating user for assigning code
        const authenticated = await authenticate(req.cookies.token);
        if(!authenticated){
            return res.status(401).json({success:false,message:"bad token"});
        }    
    
    
        // delete the code
        const deleted_code = await Code.deleteOne({_id:input.value});
        return res.status(200).json({success:true,code:deleted_code});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,messasge:"something went wrong"});
    }
}