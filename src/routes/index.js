import express from 'express';
import validate from '../middleware/validate.mw.js';
import { msgParam } from '../schemas/index.js';
import { asyncAnswer } from '../controllers/msg.ctl.js'

const router = express.Router();

// 处理消息，并给出答复
router.post('', validate(msgParam), asyncAnswer);

export default router;

