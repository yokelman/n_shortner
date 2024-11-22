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
    }
};

// (value,owner,password,redirect) => (if fields are valid returns {error:false}, else return {error:true,message})
export const validateCode = async(value,owner,password,redirect = 1)=>{
    // checking if all fields are inputted
    if(!value || !owner || !password || !redirect){
        return {error:true,message:"please enter all required fields"}
    }
    // checking if value is 6 digit
    else if(value>999999 || value<0){
        return {error:true,message:"enter value b/w 0 and 999999"}
    }
    return {error:false}
}

// (username,password, new_pass) => (check if given fields are valid then return {error:false}, if not return {error:true,message})
export const validateUser = async(username,password,new_pass = 1)=>{
    // new_pass = 0 so that when its not required it will just skip both the existance and repeatation check
    
    // checking if username,password,new_pass are inputted
    if(!username || !password ||!new_pass){
        return {error:true,message:"please enter all required fields"}
    }
    // check if old and new pass are same
    else if(password === new_pass){
        return {error:true,message:"new and old pass cant be same"}
    }
    return {error:false}
}