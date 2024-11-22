// importing express
import express from 'express';

// importing controllers
import { assignCode, getCodes } from '../controllers/code.controller.js';

// initialize "router"
const router = express.Router();

// routes
router.get('/',getCodes);
router.post('/assign',assignCode);

// export
export default router;