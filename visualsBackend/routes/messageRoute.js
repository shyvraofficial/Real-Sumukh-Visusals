import express from 'express';
import {
  getReelMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js';

const messageRouter = express.Router();

// Get all messages for a reel
messageRouter.get('/:projectId/:reelNumber', getReelMessages);

// Send a message
messageRouter.post('/:projectId/:reelNumber', sendMessage);

// Update a message
messageRouter.put('/:messageId', updateMessage);

// Delete a message
messageRouter.delete('/:messageId', deleteMessage);

export default messageRouter;
