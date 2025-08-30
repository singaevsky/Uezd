importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  const notification = payload.notification;
  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: '/favicon.ico'
  });
});
