import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Admin from './pages/Admin';
import LegacyAdmin from './pages/LegacyAdmin';
import { ProjectProvider } from './context/ProjectContext';
import NotificationProvider from './context/NotificationContext';
import Notification from './components/Notification';

export const currency = '₹';
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <NotificationProvider>
      <Notification />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <ProjectProvider>
          <Routes>
            <Route path="/*" element={<Admin token={token} setToken={setToken} />} />
            <Route path="/products/*" element={<LegacyAdmin token={token} setToken={setToken} />} />
          </Routes>
        </ProjectProvider>
      )}
    </NotificationProvider>
  );
};

export default App;