import bcrypt from 'bcrypt';

import User from '../models/user.model.js';

// function to FIND users, if user exists return the array of users if not return false
export const find_docs = async (filter,Model)=> {
    try {
        let docs_found = await Model.find(filter);
        return docs_found;
    } catch (error) {
        console.error(error.message);
    }
};

// authenticate user, if authenticated return the user document if not return false
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

export const validateCode = async(value,owner,password,redirect)=>{
    if(!value || !owner || !password || !redirect){
        return {error:true,message:"please enter all credentials"}
    }
    else if(value>999999 || value<0){
        return {error:true,message:"enter value b/w 0 and 999999"}
    }
    return {error:false}
}

export const validateUser = async(username,password)=>{
    if(!username || !password){
        return {error:true,message:"please enter all required fields"}
    }
    return {error:false}

}

export const validateChgPass = async(username,password,new_pass)=>{
    if(!username || !password ||!new_pass){
        return {error:true,message:"please enter all required fields"}
    }
    else if(password == new_pass){
        return {error:true,message:"new and old pass cant be same"}
    }
    return {error:false}
}