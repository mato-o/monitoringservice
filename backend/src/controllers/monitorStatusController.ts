import { Request, Response } from 'express';
import * as monitorStatusService from '../services/monitorStatusService';

export const getMonitorStatuses = async (req: Request, res: Response) => {
  const monitorId = req.params.id;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const data = await monitorStatusService.getStatusesForMonitor(monitorId, { limit, offset });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch statuses' });
  }
};
