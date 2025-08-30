// frontend/components/Notification.js
import { useEffect, useState } from 'react';

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Добавление уведомления
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  // Удаление
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Запрос разрешения на Push-уведомления
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="notification-container">
      {notifications.map(n => (
        <div key={n.id} className={`notification ${n.type}`}>
          {n.message}
        </div>
      ))}

      <style jsx>{`
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          max-width: 300px;
        }

        .notification {
          margin-bottom: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          color: white;
          font-size: 0.95rem;
          opacity: 0.95;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease;
        }

        .notification.info { background: #4CAF50; }
        .notification.warning { background: #FF9800; }
        .notification.error { background: #F44336; }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Запрос разрешения
export const requestNotificationPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission();
  }
};

// Показ уведомления
export const showBrowserNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
};
// Глобальная функция показа
export const showNotification = (message, type = 'info') => {
  window.dispatchEvent(new CustomEvent('show-notification', { detail: { message, type } }));
};
