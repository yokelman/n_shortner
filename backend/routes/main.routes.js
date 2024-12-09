// importing libraries
import express from 'express';

// importing controller functions
import { redirectCode, serverFile, profile } from '../controllers/main.controller.js';

// initialize "router"
const router = express.Router();

// routes
router.get('/',serverFile('index.html'));
router.get('/login',serverFile('login.html'));
router.get('/register',serverFile('register.html'));
router.get('/profile',profile);

// check this after those routes as express checks sequentially and it wont confuse if its a code or a page
router.get('/:code',redirectCode);

// export router
export default router;