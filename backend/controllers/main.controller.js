// importing models
import Code from '../models/code.model.js'

// importing UTILITY
import { find_docs } from './utils.js';

export const redirectCode = async (req,res)=>{
    let {code} = req.params;
    
    if(!/^\d{6}$/.test(code)){
        return res.status(400).json({success:false,message:"enter a valid 6 digit code"});
    }

    try {
        const found_code = await find_docs({value:code},Code);
        if(found_code == null){
            return res.status(500).json({success:false,message:"internal server error occurred"});
        }
        if(found_code.length == 0){
            return res.status(404).json({success:false,message:"code not found"});
        }
        return res.redirect("https://" + found_code[0].redirect);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message:"internal server error occurred"});
    }
}