import { Request, Response } from 'express';
import * as projectService from '../services/projectService';

export const listProjects = async (req: Request, res: Response) => {
  const { offset = '0', limit = '10', label, tags, sort } = req.query;

  try {
    const result = await projectService.listProjects({
      offset: parseInt(offset as string),
      limit: parseInt(limit as string),
      label: label as string,
      tags: (tags as string)?.split(','),
      sort: sort as string,
    });

    res.json(result);
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: 'Invalid input' });
  }
};

export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await projectService.getProject(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(project);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const updated = await projectService.updateProject(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid input' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
