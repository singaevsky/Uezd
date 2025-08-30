// frontend/pages/chef.js
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';

export default function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  let socket = null;

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

  const fetchInitialData = async () => {
    const token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const res = await fetch('/api/orders/', { headers });
    const data = await res.json();
    const activeOrders = data.filter(o => ['new', 'preparing'].includes(o.status));
    setOrders(activeOrders);
    setLoading(false);
  };

  const setupWebSocket = () => {
    const token = localStorage.getItem('access_token');
    socket = new WebSocket(`ws://localhost:8000/ws/orders/?token=${token}`);

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Новое обновление:', data);
      fetchInitialData();
    };

    socket.onclose = () => {
      setTimeout(setupWebSocket, 3000);
    };
  };

  const markAsReady = async (orderId) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/orders/${orderId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'ready' }),
    });
    fetchInitialData();
  };

  if (loading) return <p>Загрузка данных...</p>;

  return (
    <div className="chef-dashboard">
      <h1>Кондитерская панель</h1>
      <h2>Текущие заказы</h2>
      {orders.length === 0 ? (
        <p>Нет активных заказов.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <strong>Заказ #{order.id}</strong> — {order.delivery_date}
              <button onClick={() => markAsReady(order.id)}>Готов</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
