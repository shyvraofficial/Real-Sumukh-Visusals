import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProjectsList from './ProjectsList';
import ProjectForm from './ProjectForm';
import ProjectDetail from './ProjectDetail';
import AdminReelDetail from './AdminReelDetail';

export default function Admin({ setToken }) {
  const location = useLocation();

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
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-black border-r border-gray-800 p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
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

        {/* Page Content */}
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
  );
}
