import express from 'express';
import {
  createOrUpdateClient,
  getAllClients,
  getClientByEmail,
  getClientByUID,
} from '../controllers/clientController.js';

const clientRouter = express.Router();

// Client auto-creates/updates on login
clientRouter.post('/auth', createOrUpdateClient);

// Get all clients (for admin dropdown)
clientRouter.get('/all', getAllClients);

// Get client by email (admin lookup)
clientRouter.get('/email/:email', getClientByEmail);

// Get client by Firebase UID
clientRouter.get('/uid/:uid', getClientByUID);

export default clientRouter;
