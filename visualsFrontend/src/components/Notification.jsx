import React, { useContext, useEffect } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import './Notification.css';

const Notification = () => {
  const { notification, closeNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        closeNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, closeNotification]);

  if (!notification) return null;

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {notification.type === 'success' && '✓'}
          {notification.type === 'error' && '✕'}
          {notification.type === 'warning' && '⚠'}
          {notification.type === 'info' && 'ℹ'}
        </span>
        <span className="notification-message">{notification.message}</span>
      </div>
      <button className="notification-close" onClick={closeNotification}>
        ×
      </button>
    </div>
  );
};

export default Notification;
