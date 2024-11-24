// importing express
import express from 'express';

// importing controllers
import { assignCode, deleteCode, getCodes } from '../controllers/code.controller.js';

// initialize "router"
const router = express.Router();

// routes
router.get('/:owner?',getCodes);
router.post('/assign',assignCode);
router.delete('/delete',deleteCode);

// export router
export default router;