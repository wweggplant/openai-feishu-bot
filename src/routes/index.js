import express from 'express';
import validate from '../middleware/validate.mw.js';
import { msgParam } from '../schemas/index.js';
import { asyncAnswer, answer, genBranchName } from '../controllers/msg.ctl.js'
import Joi from 'joi';
const router = express.Router();

// 处理消息，并给出答复
router.post('', validate(msgParam), asyncAnswer);
router.post('/answer', validate({
  body: Joi.object({
      question: Joi.string().required()
  })
}), answer);

router.post('/genBranchName', validate({
  body: Joi.object({
      desc: Joi.string().required()
  })
}), genBranchName);
export default router;

