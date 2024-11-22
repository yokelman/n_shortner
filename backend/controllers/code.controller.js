// importing mongoose MODEL
import Code from '../models/code.model.js';

// importing UTILITY
import { authenticate, find_docs, validateCode } from './utils.js';

// controller for '/' (get codes for given owner)
// (owner of the codes needed) => (all codes of "owner" in json format)
export const getCodes = async(req,res)=>{
    
    // get the "owner" from input data
    let {owner} = req.body;
    
    // find the codes of the specific owner
    let codes = await find_docs({owner:owner},Code);
    
    // return the codes found
    res.status(200).json({success: true,codes:codes});
}

// controller for '/assign' (assign a code to a user)
// (value of the code, owner, password, where to redirect) => (authenticate and validate if yes then assign the code for given owner)
export const assignCode = async(req,res)=>{

    // get value, owner, password, redirect from user input
    let input = req.body;
    
    // validate the input
    let validation = await validateCode(input,["value","owner","redirect","password"]);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    // checking for dupes
    const code_exists = await find_docs({value:input.value},Code);
    if(code_exists[0]){
        return res.status(409).json({success:false,message:"value is already taken"});
    }
    
    // authenticating user for assigning code
    const authenticated = await authenticate(input.owner,input.password);
    if(!authenticated){
        return res.status(401).json({success:false,message:"wrong username/password"});
    }

    // assign the code to the given owner
    try {
        const saved_code = await Code.create({owner:input.owner,value:input.value,redirect:input.redirect});
        res.status(201).json({success:true,code:saved_code});
    } catch (error) {
        console.error(error.message);
    }
}

// controller for '/delete' (delete a code)
// (value,owner,password)=>(deletes the code if authenticated else gives suitable error)
export const deleteCode = async(req,res)=>{
    // get value, owner, password from user input
    let input = req.body;
    
    // validate the input
    let validation = await validateCode(input,["value","owner","password"]);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    // CHECK IF VALUE EXISTS OR NOT IF IT DOESNT EXIST THEN DONT DELETE
    const exists = await find_docs({value:input.value},Code);
    if(!exists[0]){
        return res.status(404).json({success:false,message:"code doesnt exist with that value"});
    }

    // authenticating user for assigning code
    const authenticated = await authenticate(input.owner,input.password);
    if(!authenticated){
        return res.status(401).json({success:false,message:"wrong username/password"});
    }    


    // delete the code
    try {
        const deleted_code = await Code.deleteOne({value:input.value});
        res.status(204).json({success:true,code:deleted_code});
    } catch (error) {
        console.error(error.message);
    }
}