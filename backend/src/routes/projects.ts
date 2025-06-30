import { Router } from 'express';
import * as projectController from '../controllers/projectController';

const router = Router();

// GET /api/projects - list projects
router.get('/', projectController.listProjects);

// POST /api/projects - create project
router.post('/', projectController.createProject);

// GET /api/projects/:id - get one project
router.get('/:id', projectController.getProject);

// PUT /api/projects/:id - update project
router.put('/:id', projectController.updateProject);

// DELETE /api/projects/:id - delete project
router.delete('/:id', projectController.deleteProject);

export default router;
