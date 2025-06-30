import { Request, Response } from 'express';
import * as monitorService from '../services/monitorService';

export const listMonitors = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { type, label, status, offset = '0', limit = '10' } = req.query;

  try {
    const monitors = await monitorService.listMonitors({
      projectId,
      type: type as string,
      label: label as string,
      status: status as string,
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
    });
    res.json(monitors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching monitors' });
  }
};

export const createMonitor = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    const monitor = await monitorService.createMonitor(projectId, req.body);
    res.status(201).json(monitor);
  } catch (err) {
    res.status(400).json({ message: 'Invalid monitor data' });
  }
};

export const updateMonitor = async (req: Request, res: Response) => {
  try {
    const monitor = await monitorService.updateMonitor(req.params.id, req.body);
    res.json(monitor);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update monitor' });
  }
};

export const deleteMonitor = async (req: Request, res: Response) => {
  try {
    await monitorService.deleteMonitor(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete monitor' });
  }
};

export const getStatuses = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { from, to, status } = req.query;

  try {
    const statuses = await monitorService.getStatuses(id, {
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
      status: status as string,
    });
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching statuses' });
  }
};

export async function getMonitorById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  console.log('[getMonitorById] Fetching monitor with ID:', id); 

  try {
    const monitor = await monitorService.getMonitorById(id);
    console.log('[getMonitorById] Found monitor:', monitor);    

    if (!monitor) {
      res.status(404).json({ message: 'Monitor not found' });
      return;
    }

    res.status(200).json(monitor);
  } catch (error) {
    console.error('[getMonitorById] ERROR:', error); 
    res.status(500).json({ message: 'Internal server error' });
  }
}



