import express from 'express';
import {
  getConsent,
  updateConsent,
  exportAllData,
  deleteAllData
} from '../controllers/privacyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/consent', getConsent);
router.put('/consent', updateConsent);
router.post('/export-all', exportAllData);
router.delete('/delete-all', deleteAllData);

export default router;
