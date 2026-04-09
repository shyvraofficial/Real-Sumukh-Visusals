import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Project API endpoints
export const projectAPI = {
  // Get all projects for client
  getClientProjects: () => api.get('/api/project/client'),

  // Get single project
  getProject: (projectId) => api.get(`/api/project/${projectId}`),

  // Get reel details
  getReel: (projectId, reelNumber) =>
    api.get(`/api/project/${projectId}/reel/${reelNumber}`),

  // Admin: Create project
  createProject: (data) => api.post('/api/project/admin/create', data),

  // Admin: Get all projects
  getAllProjects: () => api.get('/api/project/admin/all'),

  // Admin: Update project
  updateProject: (projectId, data) =>
    api.put(`/api/project/admin/${projectId}`, data),

  // Admin: Delete project
  deleteProject: (projectId) => api.delete(`/api/project/admin/${projectId}`),

  // Update reel status
  updateReelStatus: (projectId, reelNumber, data) =>
    api.put(`/api/project/${projectId}/reel/${reelNumber}`, data),
};

export default api;
