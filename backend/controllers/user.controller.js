// LIBRARIES
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// common functions
import { find_docs, authenticate } from './common_functions.js';

// read ENVIRONMENT variables
dotenv.config();

// SALT FOR HASHING
const salt = Number(process.env.salt);
// console.log(salt)

// IMPORT MODEL (REQUIRED FOR FUNCTIONS)
import User from "../models/user.model.js";


export const getUsers = async(req,res)=>{
    let users = await find_docs({},User);
    res.status(200).json({success:true,users:users});
};

export const registerUser = async (req,res)=>{
    let user = req.body; // set "user" = input given

    // check if user has entered all REQUIRED fields
    if (!user.username || !user.password) {
        return res.status(400).json({ success: false, message: "please enter all credentials => username,password" });
    }

    // checking if user already EXISTS
    const exists = await find_docs({username: user.username},User);

    // if user already exists, send error for "conflitct"
    if (exists[0]) {
        res.status(409).json({ success: false, message: "user already exists" });
    }
    // if user doesnt already exists save the user in the database
    else {
        try {
            // success, save user
            user.password = await bcrypt.hash(user.password, salt); //HASHING PASSWORD
            const saved_user = await User.create(user);

            res.status(201).json({ success: true, data: saved_user });
        } catch (error) {
            // error in saving document
            res.status(500).json({ success: false, message: "server error" });
            console.error(error.message);
        }
    }
};

export const loginUser = async (req, res) => {
    let user = req.body; // set "user" = input given

    // check if user has entered all REQUIRED fields
    if (!user.username || !user.password) {
        // return an error response for bad request
        return res.status(400).json({ success: false, message: "please enter all credentials => username,password" });
    }

    let authenticated_user = await authenticate(user.username,user.password);
    
    if (authenticated_user) {
        res.status(200).json({ success: true, message: "you are logged in" }); // if password is correct log in
    }
    else {
        res.status(401).json({ success: false, message: "wrong username or password" }); // otherwise show wrong username/pass
    }
};

export const changePass = async (req, res) => {
    let user = req.body;

    // check if user has entered all REQUIRED fields
    if (!user.username || !user.password || !user.new_pass) {
        // return an error response for bad request
        return res.status(400).json({ success: false, message: "please enter all credentials => username,password and new_pass" });
    }

    if (user.password == user.new_pass) {
        return res.status(400).json({ success: false, message: "new and old password are same" })
    }

    let authenticated_user = await authenticate(user.username,user.password);
    
    if (authenticated_user) {
        authenticated_user.password = await bcrypt.hash(user.new_pass, salt);
        await authenticated_user.save();
        res.status(200).json({ success: true, message: "your password has been succesfully changed" });
    }
    else {
        res.status(401).json({ success: false, message: "wrong username or password" });
    }
};

export const deleteUser = async (req, res) => {
    let user = req.body;

    // check if user has entered all REQUIRED fields
    if (!user.username || !user.password) {
        // return an error response for bad request
        return res.status(400).json({ success: false, message: "please enter all credentials => username,password" });
    }

    const authenticated_user = await authenticate(user.username,user.password);

    if (authenticated_user) {
        await authenticated_user.deleteOne();
        res.status(204).json({ success: true, message: "user successfully deleted" });
    }
    else { // password doesnt match or user doesnt exists then send this
        res.status(401).json({ success: false, message: "wrong username or password" });
    }

    // DELETE CODES OF THE USER WHEN USER IS DELETED
    try {
        await Code.deleteMany({owner:authenticated_user.username});
    } catch (error) {
        console.error(error.message);
    }

};