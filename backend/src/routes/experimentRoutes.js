import express from 'express';
import { body } from 'express-validator';
import {
  getExperiments,
  getExperimentById,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  toggleDay,
  updateStatus,
  getComparison
} from '../controllers/experimentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);

router.get('/', getExperiments);
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Experiment title is required'),
    body('objective').trim().notEmpty().withMessage('Objective is required'),
    body('durationDays').optional().isInt({ min: 1, max: 90 })
  ],
  validateRequest,
  createExperiment
);

router.get('/:id', getExperimentById);
router.put('/:id', updateExperiment);
router.delete('/:id', deleteExperiment);

router.patch('/:id/toggle-day', toggleDay);
router.patch('/:id/status', updateStatus);
router.get('/:id/comparison', getComparison);

export default router;
