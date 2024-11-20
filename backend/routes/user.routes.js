import express from 'express'

import {registerUser,loginUser, changePass, deleteUser, getUsers} from '../controllers/user.controller.js';

const router = express.Router();

// listen to get requests
router.get("/", getUsers);

// REGISTER USER
router.post("/register", registerUser);

// LOGIN USER
router.post("/login",loginUser);

// CHANGE PASSWORD
router.put("/changepass",changePass);

// DELETE USER
router.delete("/delete",deleteUser);

export default router;
