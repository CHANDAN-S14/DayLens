import express from 'express';
import { body } from 'express-validator';
import {
  chatWithAssistant,
  getChatHistory,
  clearChatHistory
} from '../controllers/assistantController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.post(
  '/chat',
  [
    body('message').trim().notEmpty().withMessage('Message text is required')
  ],
  validateRequest,
  chatWithAssistant
);

router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

export default router;
