// importing express
import express from 'express';

// importing controllers
import { assignCode, deleteCode, getCodes, getCodesOwner } from '../controllers/code.controller.js';

// importing auth middleware
import { auth } from '../middleware/auth.js';

// initialize "router"
const router = express.Router();

// routes
router.post('/assign', auth, assignCode);
router.post('/delete', auth, deleteCode);
router.post('/', getCodes);
router.post('/owner', auth, getCodesOwner);
// router.post('/update', updateCode);

// export router
export default router;