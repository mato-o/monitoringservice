import { Router } from 'express';
import * as monitorController from '../controllers/monitorController';

const router = Router();

router.get('/project/:projectId', monitorController.listMonitors);
router.post('/project/:projectId', monitorController.createMonitor);

router.get('/:id/statuses', monitorController.getStatuses);
router.get('/:id', monitorController.getMonitorById);

router.put('/:id', monitorController.updateMonitor);
router.delete('/:id', monitorController.deleteMonitor);

export default router;
