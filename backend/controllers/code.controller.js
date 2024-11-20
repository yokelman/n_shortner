import Code from '../models/code.model.js';

import { authenticate, find_docs } from './common_functions.js';

export const getCodes = async(req,res)=>{
    let input = req.body;
    let codes = await find_docs({owner:input.owner},Code);
    res.status(200).json({success: true,codes:codes});
}

export const assignCode = async(req,res)=>{
    let input = req.body;
    
    if(!input.value || !input.owner || !input.password || !input.redirect){
        return res.status(400).json({success:false,message:"please enter all fields"});
    }

    if(input.value>999999 || input.value<0){
        return res.status(400).json({success:false,message:"value should be b/w 0 and 999999"});
    }
    
    
    const code_exists = await find_docs({value:input.value},Code);
    if(code_exists[0]){
        return res.status(409).json({success:false,message:"value is already taken"});
    }
    
    
    const authenticated = await authenticate(input.owner,input.password);
    if(!authenticated){
        return res.status(401).json({success:false,message:"wrong username/password"});
    }


    try {
        const saved_code = await Code.create({owner:input.owner,value:input.value,redirect:input.redirect});
        res.status(201).json({success:true,code:saved_code});
    } catch (error) {
        console.error(error.message);
    }
}