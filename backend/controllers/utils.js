// importing libraries
import bcrypt from 'bcrypt';

// importing mongoose models
import User from '../models/user.model.js';

// (filter,model) => (returns array of documents found)
export const find_docs = async (filter,Model)=> {
    try {
        let docs_found = await Model.find(filter);
        return docs_found;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// (username,password) => (if password is correct return the user, else return false)
export const authenticate = async(username,password)=>{
    try {
        const match_user = await find_docs({username: username},User);
        if (match_user[0] && await bcrypt.compare(password, match_user[0].password)) {
            return match_user[0];
        }
        else {
            return false;
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// (value,owner,password,redirect) => (if fields are valid returns {error:false}, else return {error:true,message})
export const validateCode = async(input,required_fields)=>{
    // checking if all fields are inputted
    // console.log(required_fields)
    for (let field of required_fields){
        if(!(input[field] != null && input[field] != undefined)){
            return {error:true,message:`enter ${field} fields`};
        }
    }
    // checking if value is 6 digit
    if(input.value>999999 || input.value<0){
        return {error:true,message:"enter value b/w 0 and 999999"};
    }
    return {error:false}
}

// (username,password, new_pass) => (check if given fields are valid then return {error:false}, if not return {error:true,message})
export const validateUser = async(input,required_fields)=>{
    
    // checking if all fields are inputted
    for (let field of required_fields){
        if(!(input[field] != null && input[field] != undefined)){
            return {error:true,message:`enter ${field} field`};
        }
    }
    // check if old and new pass are same
    if(required_fields.includes("new_pass" && input.password == input.new_pass)){
        return {error:true,message:"new and old pass cant be same"}
    }
    return {error:false}
}