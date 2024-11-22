// importing LIBRARIES
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// importing UTILITIES
import { find_docs, authenticate, validateUser } from './utils.js';

// read ENVIRONMENT variables
dotenv.config();

// SALT FOR HASHING
const salt = Number(process.env.salt);
// console.log(salt)

// importing mongoose MODELS
import User from "../models/user.model.js";
import Code from "../models/code.model.js";


// controller for '/' (to get all users)
// () => (all saved users)
export const getUsers = async(req,res)=>{
    // get all users saved
    let users = await find_docs({},User);
    // return saved "users"
    res.status(200).json({success:true,users:users});
};

// controller for '/register'
// (username, password) => (if username is not taken then register user and return saved user, else return the error)
export const registerUser = async (req,res)=>{
    // get username and password from input
    let {username,password} = req.body;

    // validate input
    let validation = await validateUser(username,password);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    // checking if user already EXISTS
    const exists = await find_docs({username: username},User);
    // if user already exists, send error for "conflitct"
    if (exists[0]) {
        res.status(409).json({ success: false, message: "user already exists" });
    }
    // if user doesnt already exists save the user in the database
    else {
        try {
            // success, save user
            password = await bcrypt.hash(password, salt); //HASHING PASSWORD
            const saved_user = await User.create({username:username,password:password});

            res.status(201).json({ success: true, data: saved_user });
        } catch (error) {
            // error in saving document
            res.status(500).json({ success: false, message: "server error" });
            console.error(error.message);
        }
    }
};

// controller for '/login'
// (username, password) => (if authenticated return "true", else "false")
export const loginUser = async (req, res) => {
    // get the username and password from input
    let {password,username} = req.body;

    // validate input
    let validation = await validateUser(username,password);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    // authenticate user
    let authenticated_user = await authenticate(username,password);
    if (authenticated_user) {
        res.status(200).json({ success: true, message: "you are logged in" }); // if password is correct log in
    }
    else {
        res.status(401).json({ success: false, message: "wrong username or password" }); // otherwise show wrong username/pass
    }
};

// controller for '/changepass'
// (username, password, new_pass) => (if authenticated update password and return "true", else return "false")
export const changePass = async (req, res) => {
    // get username, password and new_pass from input
    let {username, password, new_pass} = req.body;

    // validate input
    let validation = await validateUser(username,password,new_pass);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    // authenticate user
    let authenticated_user = await authenticate(username,password);

    if (authenticated_user) { // if authenticated change the password in the database
        authenticated_user.password = await bcrypt.hash(new_pass, salt);
        await authenticated_user.save();
        res.status(200).json({ success: true, message: "your password has been succesfully changed" });
    }
    else {
        res.status(401).json({ success: false, message: "wrong username or password" });
    }
};

// controller for '/delete'
// (username, password) => (if authenticated delete user and its codes and return "true", else return "false")
export const deleteUser = async (req, res) => {
    // get username and password from input
    let {username, password} = req.body;

    // validate input
    let validation = await validateUser(username,password);
    if(validation.error){
        return res.status(400).json({success:false,message:validation.message});
    }

    // authenticate user
    const authenticated_user = await authenticate(username,password);
    if (!authenticated_user) {
        return res.status(401).json({ success: false, message: "wrong username or password" });
    }
    
    // DELETE the user and its owned codes
    try {
        await authenticated_user.deleteOne();
        await Code.deleteMany({owner:authenticated_user.username});

        return res.status(204).json({ success: true, message: "user successfully deleted" });

    } catch (error) {
        console.error(error.message);
    }

};