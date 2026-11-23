import express from 'express';
import {
  getOverview,
  getCorrelations,
  getTrends,
  getAnomalies,
  getInsights
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/correlations', getCorrelations);
router.get('/trends', getTrends);
router.get('/anomalies', getAnomalies);
router.get('/insights', getInsights);

export default router;
