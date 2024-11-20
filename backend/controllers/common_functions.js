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