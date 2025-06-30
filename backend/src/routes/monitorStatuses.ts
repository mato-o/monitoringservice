import express from 'express';
import * as monitorStatusController from '../controllers/monitorStatusController';

const router = express.Router();

// GET /monitors/:id/statuses
router.get('/:id/statuses', monitorStatusController.getMonitorStatuses);

export default router;
