import express from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import {
  getRecords,
  getRecordById,
  createOrUpdateRecord,
  updateRecord,
  deleteRecord,
  importCsv,
  exportRecords
} from '../controllers/recordController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const router = express.Router();

router.use(protect); // All record operations require authentication

router.get('/', getRecords);
router.post(
  '/',
  [
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Valid date YYYY-MM-DD required'),
    body('sleepHours').optional().isFloat({ min: 0, max: 24 }),
    body('screenTimeHours').optional().isFloat({ min: 0, max: 24 }),
    body('steps').optional().isInt({ min: 0 }),
    body('exerciseDuration').optional().isInt({ min: 0 }),
    body('mood').optional().isFloat({ min: 1, max: 10 }),
    body('focus').optional().isFloat({ min: 1, max: 10 })
  ],
  validateRequest,
  createOrUpdateRecord
);

router.get('/export', exportRecords);
router.post('/import-csv', upload.single('file'), importCsv);

router.get('/:id', getRecordById);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;
