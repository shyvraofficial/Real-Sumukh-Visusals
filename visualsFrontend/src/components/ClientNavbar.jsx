import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar for Client Dashboard - Professional Portal
 * Strict Color Palette: #000000, #131313, #f3f3f3, #ffffff only
 * Clean navigation with logo, menu items, and user profile
 */
const ClientNavbar = ({
  clientName = "Client",
  clientAvatar = "https://via.placeholder.com/40",
  onLogout,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/billing', label: 'Billing' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ backgroundColor: '#000000', borderColor: '#f3f3f3' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: '#131313', color: '#ffffff' }}
          >
            ▶
          </div>
          <span style={{ color: '#ffffff' }} className="font-semibold text-base hidden sm:block tracking-tight">
            Sumukh Visuals
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-white'
                  : 'text-f3f3f3 hover:text-white'
              }`}
              style={{
                color: isActive(item.href) ? '#ffffff' : '#f3f3f3'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button style={{ color: '#f3f3f3' }} className="md:hidden hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={clientAvatar}
                alt={clientName}
                className="w-10 h-10 rounded-full object-cover border"
                style={{ borderColor: '#f3f3f3' }}
              />
              <div className="hidden sm:block text-left">
                <p style={{ color: '#ffffff' }} className="text-sm font-semibold">
                  {clientName}
                </p>
                <p style={{ color: '#f3f3f3' }} className="text-xs">Client</p>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#f3f3f3' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div
              className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg"
              style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
              >
                <div className="p-4 border-b" style={{ borderColor: '#f3f3f3' }}>
                  <p style={{ color: '#ffffff' }} className="text-sm font-semibold">{clientName}</p>
                  <p style={{ color: '#f3f3f3' }} className="text-xs">client@example.com</p>
                </div>
                <div className="space-y-1 p-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm transition-colors rounded"
                    style={{ color: '#f3f3f3' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#f3f3f3'}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm transition-colors rounded"
                    style={{ color: '#f3f3f3' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#f3f3f3'}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-4 py-2 text-sm transition-colors rounded border-t mt-2 pt-2"
                    style={{ color: '#f3f3f3', borderColor: '#f3f3f3' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#f3f3f3'}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
