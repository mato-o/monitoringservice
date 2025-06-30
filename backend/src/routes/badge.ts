import { Router } from 'express';
import * as badgeController from '../controllers/badgeController';

const router = Router();

router.get('/:monitorId.svg', badgeController.getBadgeSvg);

export default router;
