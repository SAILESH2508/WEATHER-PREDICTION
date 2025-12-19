import { useState, useEffect, useCallback } from 'react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, [removeNotification]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-danger';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  };

  // Expose addNotification globally
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, [addNotification]);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`alert ${getAlertClass(notification.type)} notification fade show`}
          role="alert"
        >
          <div className="d-flex align-items-center">
            <span className="notification-icon me-2">
              {getIcon(notification.type)}
            </span>
            <span className="notification-message flex-grow-1">
              {notification.message}
            </span>
            <button
              type="button"
              className="btn-close"
              onClick={() => removeNotification(notification.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;