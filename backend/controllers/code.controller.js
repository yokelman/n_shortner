import Code from '../models/code.model.js';

async function find_codes(filter){
    try {
        let code_found = await Code.find(filter);
        return code_found;
    } catch (error) {
        console.error(error.message);
    }
}

export const getCodes = async(req,res)=>{
    let codes = await find_codes({});
    res.status(200).json({success: true,codes:codes});
}