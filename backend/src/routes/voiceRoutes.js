import express from 'express';
import { body } from 'express-validator';
import { speak, getStatus } from '../controllers/voiceController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/status', optionalAuth, getStatus);

router.post(
  '/speak',
  optionalAuth,
  [
    body('text').trim().notEmpty().withMessage('Text is required')
  ],
  validateRequest,
  speak
);

export default router;
