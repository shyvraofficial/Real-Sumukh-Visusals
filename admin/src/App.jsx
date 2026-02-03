import React from 'react';
import NavBar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login.jsx';
import NotificationProvider from './context/NotificationContext';
import Notification from './components/Notification';

export const currency = '₹';

import { useState,useEffect } from 'react';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):''); 
  useEffect(()=>{
    localStorage.setItem('token', token)
  }, [token])

  return (
    <NotificationProvider>
      <Notification />
      <div className="bg-gray-50 min-h-screen">
        {token === '' ? (
          <Login setToken={setToken}  />
        ) : (
          <>
            <NavBar setToken={setToken}/>
            <hr />
            <div className="flex w-full">
              <Sidebar />
              <div className=" w-[70%] mx-auto ml-[max(5vh,25px)] my-8 text-gray-700 text-base">
                <Routes>
                  <Route path="/add" element={<Add token={token}/>} />
                  <Route path="/list" element={<List token={token}  />} />
                  <Route path="/order" element={<Orders token={token} />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </NotificationProvider>
  );
};

export default App;