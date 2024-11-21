import Code from '../models/code.model.js';

import { authenticate, find_docs, validateCode } from './utils.js';

// 
export const getCodes = async(req,res)=>{
    let input = req.body;
    let codes = await find_docs({owner:input.owner},Code);
    res.status(200).json({success: true,codes:codes});
}

export const assignCode = async(req,res)=>{
    let {value,owner,password,redirect} = req.body;
    
    let validation = await validateCode(value,owner,password,redirect);

    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }
    
    const code_exists = await find_docs({value:value},Code);
    if(code_exists[0]){
        return res.status(409).json({success:false,message:"value is already taken"});
    }
    
    
    const authenticated = await authenticate(owner,password);
    if(!authenticated){
        return res.status(401).json({success:false,message:"wrong username/password"});
    }


    try {
        const saved_code = await Code.create({owner:owner,value:value,redirect:redirect});
        res.status(201).json({success:true,code:saved_code});
    } catch (error) {
        console.error(error.message);
    }
}