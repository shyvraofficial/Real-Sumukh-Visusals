import express from 'express';
import { getClientProjects, getProjectById, getProjectByIdAdmin, getReelDetail, createProject, updateProject, deleteProject, updateReelStatus, getAllProjects } from '../controllers/projectController.js';
import auth from '../middleware/auth.js';

const projectRouter = express.Router();

// Admin routes (define before generic routes to avoid conflicts)
projectRouter.post('/admin/create', createProject);
projectRouter.get('/admin/all', getAllProjects);
projectRouter.get('/admin/:id', getProjectByIdAdmin); // Get single project for admin (no auth check)
projectRouter.put('/admin/:id', updateProject);
projectRouter.delete('/admin/:id', deleteProject);

// Client routes (protected)
projectRouter.get('/client', auth, getClientProjects);
projectRouter.get('/:id', auth, getProjectById);
projectRouter.get('/:projectId/reel/:reelNumber', auth, getReelDetail);

// Reel update
projectRouter.put('/:projectId/reel/:reelNumber', updateReelStatus);

export default projectRouter;
