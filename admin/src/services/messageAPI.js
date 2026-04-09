import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${backendUrl}/api/message`,
});

export const messageAPI = {
  // Get all messages for a reel
  getMessages: async (projectId, reelNumber) => {
    return api.get(`/${projectId}/${reelNumber}`);
  },

  // Send a message
  sendMessage: async (projectId, reelNumber, messageData) => {
    return api.post(`/${projectId}/${reelNumber}`, messageData);
  },

  // Update a message
  updateMessage: async (messageId, content) => {
    return api.put(`/${messageId}`, { content });
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    return api.delete(`/${messageId}`);
  },
};
