// importing express
import express from 'express';

// importing controllers
import { assignCode, deleteCode, getCodes } from '../controllers/code.controller.js';

// initialize "router"
const router = express.Router();

// routes
router.post('/assign',assignCode);
router.post('/delete',deleteCode);
router.post('/:owner?',getCodes);
// router.post('/update',updateCode);

// export router
export default router;