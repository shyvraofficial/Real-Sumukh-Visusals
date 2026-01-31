import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import './MyProfile.css'

const MyProfile = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  const formatJoinDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const loadProfileData = async () => {
    try {
      setLoading(true);
      if (!token) {
        console.log('No token, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Loading profile with token:', token);

      // Load user profile
      const userResponse = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Profile response:', userResponse.data);

      if (userResponse.data.success) {
        setUserData(userResponse.data.user);
      } else {
        console.error('Profile fetch failed:', userResponse.data.message);
      }

      // Load recent orders
      const orderResponse = await axios.post(`${backendUrl}/api/order/userOrders`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Orders response:', orderResponse.data);

      if (orderResponse.data.success) {
        let allOrderItems = [];
        orderResponse.data.orders.slice(0, 3).map((order) => {
          order.items.slice(0, 1).map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id;
            allOrderItems.push(item);
          });
        });
        setOrderData(allOrderItems);
      }
    } catch (error) {
      console.error('Profile load error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadProfileData();
    }
  }, [token]);

  const handleLogout = () => {
    const redirectPath = localStorage.getItem('lastVisitedPath');
    const blockedPaths = ['/login', '/newlogin', '/finish-login'];
    const target = redirectPath && !blockedPaths.includes(redirectPath) ? redirectPath : '/';

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate(target);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  if (loading) {
    return (
      <div className='profile-container'>
        <div className='loading'>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className='profile-container'>
      <motion.div
        className='profile-content'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div className='profile-header' variants={itemVariants}>
          <div className='profile-avatar'>
            {getInitials(userData?.name || 'User')}
          </div>
          <div className='profile-header-info'>
            <h1 className='profile-name'>{userData?.name || 'User'}</h1>
            <p className='profile-email'>{userData?.email || 'No email'}</p>
            <p className='profile-joined'>Member since {formatJoinDate(userData?.createdAt)}</p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div className='profile-stats' variants={itemVariants}>
          <div className='stat-card'>
            <div className='stat-number'>{orderData.length || 0}</div>
            <div className='stat-label'>Total Purchases</div>
          </div>
          <div className='stat-card'>
            <div className='stat-number'>
              {orderData.length > 0 ? currency : '0'}
              {orderData.length > 0 && (orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(0)}
            </div>
            <div className='stat-label'>Total Spent</div>
          </div>
          <div className='stat-card'>
            <div className='stat-number'>Premium</div>
            <div className='stat-label'>Membership</div>
          </div>
        </motion.div>

        {/* Recent Purchases Section */}
        <motion.div className='profile-section' variants={itemVariants}>
          <div className='section-header'>
            <h2 className='section-title'>Recent Purchases</h2>
            <button
              onClick={() => navigate('/orders')}
              className='view-all-btn'
            >
              View All →
            </button>
          </div>

          {orderData.length > 0 ? (
            <div className='recent-purchases'>
              {orderData.map((item, index) => (
                <motion.div
                  key={index}
                  className='purchase-item'
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                >
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className='purchase-image'
                  />
                  <div className='purchase-details'>
                    <p className='purchase-name'>{item.name}</p>
                    <p className='purchase-date'>{new Date(item.date).toDateString()}</p>
                    <p className='purchase-price'>{currency}{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className={`purchase-status ${item.status?.toLowerCase()}`}>
                    {item.status}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='no-purchases'>
              <p>No purchases yet</p>
              <button
                onClick={() => navigate('/collection')}
                className='shop-now-btn'
              >
                Start Shopping
              </button>
            </div>
          )}
        </motion.div>

        {/* Account Details Section */}
        <motion.div className='profile-section' variants={itemVariants}>
          <h2 className='section-title'>Account Details</h2>
          <div className='details-grid'>
            <div className='detail-item'>
              <span className='detail-label'>Email</span>
              <span className='detail-value'>{userData?.email || 'N/A'}</span>
            </div>
            <div className='detail-item'>
              <span className='detail-label'>Account Status</span>
              <span className='detail-value active'>Active</span>
            </div>
            <div className='detail-item'>
              <span className='detail-label'>Member Since</span>
              <span className='detail-value'>{formatJoinDate(userData?.createdAt)}</span>
            </div>
            <div className='detail-item'>
              <span className='detail-label'>Last Updated</span>
              <span className='detail-value'>{formatJoinDate(userData?.updatedAt)}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className='profile-section' variants={itemVariants}>
          <h2 className='section-title'>Quick Actions</h2>
          <div className='actions-grid'>
            <button
              onClick={() => navigate('/orders')}
              className='action-btn'
            >
              <span className='action-icon'>📦</span>
              <span>My Purchases</span>
            </button>
            <button
              onClick={() => navigate('/collection')}
              className='action-btn'
            >
              <span className='action-icon'>🛍️</span>
              <span>Continue Shopping</span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className='action-btn'
            >
              <span className='action-icon'>ℹ️</span>
              <span>About Us</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className='action-btn'
            >
              <span className='action-icon'>💬</span>
              <span>Contact Support</span>
            </button>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div className='profile-section help-section' variants={itemVariants}>
          <h2 className='section-title'>Need Help?</h2>
          <div className='help-content'>
            <p>Have questions about your account or purchases?</p>
            <button
              onClick={() => navigate('/contact')}
              className='help-btn'
            >
              Contact Our Support Team
            </button>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div className='profile-logout' variants={itemVariants}>
          <button
            onClick={handleLogout}
            className='logout-btn'
          >
            Log Out
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MyProfile;
