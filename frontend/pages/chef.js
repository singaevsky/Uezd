// frontend/pages/chef.js
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';

export default function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  let socket = null;

  useEffect(() => {
    // Защита от SSR
    if (typeof window === 'undefined') return;

    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchInitialData = async () => {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const res = await fetch('/api/orders/', { headers });
        const data = await res.json();
        const activeOrders = data.filter(o => ['new', 'preparing'].includes(o.status));
        setOrders(activeOrders);
      } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
      } finally {
        setLoading(false);
      }
    };

    const setupWebSocket = () => {
      const token = localStorage.getItem('access_token');
      const wsHost = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
      socket = new WebSocket(`${wsHost}/orders/?token=${token}`);

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('Новое обновление:', data);
        fetchInitialData();
      };

      socket.onclose = () => {
        setTimeout(setupWebSocket, 3000);
      };
    };

    fetchInitialData();
    setupWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const markAsReady = async (orderId) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    await fetch(`/api/orders/${orderId}/`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'ready' }),
    });
    // Обновим список
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const res = await fetch('/api/orders/', { headers });
    const data = await res.json();
    const activeOrders = data.filter(o => ['new', 'preparing'].includes(o.status));
    setOrders(activeOrders);
  };

  if (loading) return <p>Загрузка данных...</p>;

  return (
    <div className="chef-dashboard" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Кондитерская панель</h1>
      <h2>Текущие заказы</h2>
      {orders.length === 0 ? (
        <p>Нет активных заказов.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map(order => (
            <li key={order.id} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
              <strong>Заказ #{order.id}</strong> — {order.delivery_date}
              <button onClick={() => markAsReady(order.id)} style={{ marginLeft: '10px' }}>
                Готов
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
