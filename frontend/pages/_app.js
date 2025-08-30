// frontend/pages/_app.js
import { useEffect } from 'react';
import Script from 'next/script'; // ✅ Правильный способ подключения внешних скриптов в Next.js
import { NotificationSystem } from '../components/Notification';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Обработка кастомных уведомлений
    const handleShowNotification = (e) => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Уездный кондитер', { // ✅ Название бренда обновлено
            body: e.detail.message,
            icon: '/favicon.ico', // ✅ Опционально: иконка уведомления
          });
        }
      }
    };

    window.addEventListener('show-notification', handleShowNotification);

    // Запрос разрешения на уведомления
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('show-notification', handleShowNotification);
    };
  }, []);

  return (
    <>
      {/* ✅ Подключение Chart.js через next/script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="afterInteractive"
      />

      {/* Основной компонент страницы */}
      <Component {...pageProps} />

      {/* Всплывающие уведомления */}
      <NotificationSystem />
    </>
  );
}

export default MyApp;
