import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Add from './Add';
import List from './List';
import Orders from './Orders';

export default function LegacyAdmin({ token, setToken }) {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const navItems = [
    { path: '/products/add', label: 'Add Product' },
    { path: '/products/list', label: 'Products List' },
    { path: '/products/orders', label: 'Orders' },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-black border-r border-gray-800 p-6">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-tight">Products</h1>
          <p className="text-gray-500 text-xs mt-1">Inventory Management</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6" />

        {/* Back to Projects */}
        <div className="space-y-2">
          <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-600">Navigation</p>
          <Link
            to="/"
            className="block text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            ← Projects
          </Link>
          <button
            onClick={() => setToken('')}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <div className="border-b border-gray-700 px-8 py-4 flex items-center justify-between" style={{ backgroundColor: '#131313' }}>
          <div>
            <h2 className="text-lg font-light text-white">
              {location.pathname.includes('/add') && 'Add Product'}
              {location.pathname.includes('/list') && 'Products List'}
              {location.pathname.includes('/orders') && 'Orders'}
            </h2>
          </div>
          <div className="text-gray-400 text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Page Content */}
        <Routes>
          <Route path="/add" element={<Add token={token} />} />
          <Route path="/list" element={<List token={token} />} />
          <Route path="/orders" element={<Orders token={token} />} />
        </Routes>
      </div>
    </div>
  );
}
