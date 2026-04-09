import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const clientAPI = axios.create({
  baseURL: `${backendUrl}/api/client`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-create/update client on first login
export const authClient = async (firebaseUID, email, name, avatar) => {
  return clientAPI.post('/auth', {
    firebaseUID,
    email,
    name,
    avatar,
  });
};

// Get all clients for dropdown
export const getAllClients = async () => {
  return clientAPI.get('/all');
};

// Get client by email
export const getClientByEmail = async (email) => {
  return clientAPI.get(`/email/${encodeURIComponent(email)}`);
};

// Get client by Firebase UID
export const getClientByUID = async (uid) => {
  return clientAPI.get(`/uid/${uid}`);
};

export default clientAPI;
