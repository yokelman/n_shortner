// importing express
import express from 'express';

// importing controllers
import { assignCode, deleteCode, getCodes, getCodesOwner } from '../controllers/code.controller.js';

// initialize "router"
const router = express.Router();

// routes
router.post('/assign',assignCode);
router.post('/delete',deleteCode);
router.post('/',getCodes);
router.post('/owner',getCodesOwner);
// router.post('/update',updateCode);

// export router
export default router;