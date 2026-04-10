
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import { NotificationContext } from '../context/NotificationContext.jsx';
import { motion } from 'framer-motion';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { token, setToken, setCartItems, showSearch, setShowSearch, getCartCount, cartItems, products, cartCount, logout } = useContext(ShopContext);
  const { success, error: showError } = useContext(NotificationContext);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(token);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down more than 50px, hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true);
      } 
      // If scrolling up, show navbar
      else if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { label: 'Portfolio', to: '/' },
    { label: 'Shop', to: '/collection' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  

  return (
    <nav className={`navbar ${isHidden ? 'navbar-hidden' : 'navbar-visible'}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} className="logo" alt="Logo" />
        </Link>

        {/* Desktop main links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <motion.li
              key={item.to}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={{ duration: 0.15 }}
            >
              <NavLink to={item.to}>{item.label}</NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Right side: search, cart, and auth */}
        <div className="nav-right">
                    {/* Shop button (left of cart icon) - only show on small screens when menu is NOT open */}
                    {!isOpen && (
                      <button
                        className="nav-auth-btn nav-shop-btn shop-mobile-only"
                        onClick={() => navigate('/collection')}
                        style={{
                          marginRight: '2px',
                          padding: '4px 10px',
                          fontSize: '13px',
                          minWidth: 'unset',
                          fontWeight: 500,
                          background: 'transparent',
                          color: '#e5e7eb',
                          borderColor: 'rgba(148, 163, 184, 0.6)'
                        }}
                      >
                        Shop
                      </button>
                    )}
          {/* Shop button (left of cart icon) - only show on mobile menu */}
          {/* The Shop button is now only in the mobile menu below */}
          {/* Search icon */}
          <img
            onClick={() => {
              setShowSearch(!showSearch);
              navigate('/collection');
            }}
            src={assets.search_icon}
            className="nav-icon search-icon"
            alt="Search"
          />

          {/* Cart icon with count */}
          <Link to="/cart" className="nav-cart">
            <img src={assets.cart_icon} className="nav-icon cart-icon" alt="Cart" />
            <span className="cart-count">{cartCount}</span>
          </Link>

          <div className="nav-auth">
            {/* Client Portal Link */}
            <button
              className="nav-auth-btn"
              onClick={() => navigate('/client/dashboard')}
              style={{
                borderColor: '#8b8b8b',
                color: '#d4d4d8',
                fontSize: '13px'
              }}
              title="Client Dashboard"
            >
              Client Portal
            </button>
            
            {isLoggedIn ? (
              <>
                <button
                  className="nav-auth-btn"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </button>
                <button
                  className="nav-auth-btn"
                  onClick={() => navigate('/orders')}
                >
                  Purchases
                </button>
                <button
                  className="nav-auth-btn nav-auth-logout"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="nav-auth-btn nav-auth-primary"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <img
            onClick={() => setIsOpen(!isOpen)}
            src={assets.menu_icon}
            className="mobile-menu-btn"
            alt="Menu"
          />
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="mobile-menu"
          style={{
            background: '#131313',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999
          }}
        >
          <div className="mobile-menu-header" onClick={() => setIsOpen(false)}>
            <img src={assets.dropdown_icon} alt="Back" className="back-icon" />
            <p>Back</p>
          </div>

          {/* Main links on mobile */}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="mobile-nav-item"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {/* Client Portal Link on Mobile */}
          <NavLink
            to="/client/dashboard"
            className="mobile-nav-item"
            onClick={() => setIsOpen(false)}
            style={{
              color: '#d4d4d8',
              fontWeight: 500,
              borderTop: '1px solid #3f3f46',
              paddingTop: '12px',
              marginTop: '12px'
            }}
          >
            Client Portal
          </NavLink>

          {/* Auth on mobile */}
          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className="mobile-nav-item"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </NavLink>
              <NavLink
                to="/orders"
                className="mobile-nav-item"
                onClick={() => setIsOpen(false)}
              >
                Purchases
              </NavLink>
              <p
                className="mobile-nav-item mobile-nav-logout"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                Logout
              </p>
            </>
          ) : (
            <NavLink
              to="/login"
              className="mobile-nav-item mobile-nav-login"
              onClick={() => setIsOpen(false)}
            >
              Login
            </NavLink>
          )}
        </motion.div>
      )}
    </nav>
  );
}