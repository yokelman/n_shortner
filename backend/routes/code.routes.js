import express from 'express';

import { assignCode, getCodes } from '../controllers/code.controller.js';

const router = express.Router();

router.get('/',getCodes);
router.post('/assign',assignCode);

export default router;