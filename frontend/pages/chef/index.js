// frontend/pages/chef/index.js
useEffect(() => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return;
  }

  fetchInitialData();
  setupWebSocket();

  return () => {
    if (socket) socket.close();
  };
}, []);

const setupWebSocket = () => {
  const token = localStorage.getItem('access_token');
  const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  const wsUrl = `${wsScheme}://${host}/ws/orders/${token}/`;

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('✅ WebSocket подключён');
  };
  socket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.event === 'order_updated') {
    fetchInitialData();
    showNotification(`Заказ №${data.data.id} обновлён: ${getStatusLabel(data.data.status)}`);
  }
};
  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.event === 'order_updated') {
      console.log('🔄 Получено обновление заказа:', data.data);
      fetchInitialData(); // Перезагружаем заказы
    }
  };

  socket.onclose = () => {
    console.log('🔁 WebSocket закрыт. Переподключение...');
    setTimeout(setupWebSocket, 3000);
  };

  socket.onerror = (err) => {
    console.error('❌ Ошибка WebSocket:', err);
  };
};
const showNotification = (message) => {
  if (Notification.permission === 'granted') {
    new Notification('Обновление заказа', { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Обновление заказа', { body: message });
      }
    });
  }
};
// В WebSocket onmessage
if (data.event === 'order_updated') {
  fetchInitialData();
  showBrowserNotification('Новый заказ', `Заказ №${data.data.id} — ${getStatusLabel(data.data.status)}`);
};
