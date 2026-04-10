import React, { useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProjectsList from './ProjectsList';
import ProjectForm from './ProjectForm';
import ProjectDetail from './ProjectDetail';
import AdminReelDetail from './AdminReelDetail';

export default function Admin({ setToken }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isProjectsActive = location.pathname.startsWith('/projects');

  const navItems = [
    { path: '/', label: 'Dashboard', section: 'projects' },
    { path: '/projects', label: 'Projects', section: 'projects' },
    { path: '/products/list', label: 'Products', section: 'products' },
    { path: '/products/add', label: 'Add Product', section: 'products' },
    { path: '/products/orders', label: 'Orders', section: 'products' },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-light">Admin Panel</h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-14"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-14 md:top-0 w-64 h-screen bg-black border-r border-gray-800 p-6 flex flex-col transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="mb-8 hidden md:block">
          <h1 className="text-2xl font-light tracking-tight">Admin Panel</h1>
          <p className="text-gray-500 text-xs mt-1">Client Portal & Inventory</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8 flex-1">
          {/* Projects Section */}
          <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-600 font-medium mt-4">Projects</p>
          {navItems.filter(item => item.section === 'projects').map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Products Section */}
          <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-600 font-medium mt-6">Products</p>
          {navItems.filter(item => item.section === 'products').map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
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

        {/* Settings */}
        <div className="space-y-2">
          <p className="px-4 py-2 text-xs uppercase tracking-wider text-gray-600">Settings</p>
          <button
            onClick={() => {
              setToken('');
              setSidebarOpen(false);
            }}
            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 mt-14 md:mt-0">
        {/* Top Bar */}
        <div className="border-b border-gray-700 px-4 md:px-8 py-4 flex items-center justify-between hidden md:flex" style={{ backgroundColor: '#131313' }}>
          <div>
            <h2 className="text-lg font-light text-white">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/projects' && 'Projects'}
              {location.pathname === '/projects/new' && 'New Project'}
              {location.pathname.includes('/reel/') && 'Reel Management'}
              {!location.pathname.includes('/reel/') && location.pathname.includes('/projects/') && !location.pathname.includes('/edit') && location.pathname !== '/projects' && 'Project Details'}
              {location.pathname.includes('/projects/') && location.pathname.includes('/edit') && 'Edit Project'}
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

        {/* Mobile Top Bar */}
        <div className="md:hidden border-b border-gray-700 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#131313' }}>
          <div>
            <h2 className="text-sm font-light text-white truncate">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/projects' && 'Projects'}
              {location.pathname === '/projects/new' && 'New Project'}
              {location.pathname.includes('/reel/') && 'Reel Management'}
              {!location.pathname.includes('/reel/') && location.pathname.includes('/projects/') && !location.pathname.includes('/edit') && location.pathname !== '/projects' && 'Project Details'}
              {location.pathname.includes('/projects/') && location.pathname.includes('/edit') && 'Edit Project'}
            </h2>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 md:px-8 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/reel/:reelNumber" element={<AdminReelDetail />} />
            <Route path="/projects/:id/edit" element={<ProjectForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
