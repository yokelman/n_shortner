// importing express
import express from 'express';

// importing controller functions
import { redirectCode } from '../controllers/main.controller.js';

// initialize "router"
const router = express.Router();

// routes
router.get('/:code',redirectCode);


// export router
export default router;