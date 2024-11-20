import express from 'express';

import { getCodes } from '../controllers/code.controller.js';

const router = express.Router();

router.get('/',getCodes);

export default router;