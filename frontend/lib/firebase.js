import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = { /* ваш конфиг */ };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFirebaseNotification = async () => {
  const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
  if (token) {
    // Отправьте токен на сервер
    await fetch('/api/users/save-fcm-token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fcm_token: token })
    });
  }
};

// Обработка уведомлений в foreground
onMessage(messaging, (payload) => {
  alert(`Новое уведомление: ${payload.notification.body}`);
});
