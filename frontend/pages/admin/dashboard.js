// frontend/pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchStats = async () => {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats/', { headers }),
        fetch('/api/orders/', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setRecentOrders((await ordersRes.json()).slice(0, 5));

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Админ-панель</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Выручка (сегодня)</h3>
          <p className="value">{stats.today_revenue || 0} ₽</p>
        </div>
        <div className="stat-card">
          <h3>Заказов сегодня</h3>
          <p className="value">{stats.today_orders || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Пользователей</h3>
          <p className="value">{stats.total_users || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Топ товар</h3>
          <p className="value">{stats.top_product || '—'}</p>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Последние заказы</h2>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th>Клиент</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.created_at.split('T')[0]}</td>
                <td>{getStatusLabel(order.status)}</td>
                <td>{order.total_price} ₽</td>
                <td>{order.user?.email || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Open Sans', sans-serif;
        }

        h1, h2 {
          font-family: 'Playfair Display', serif;
          color: #6B4423;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          text-align: center;
        }

        .stat-card .value {
          font-size: 1.8rem;
          font-weight: 600;
          color: #D4AF37;
          margin: 10px 0 0 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
}

function getStatusLabel(status) {
  return {
    new: 'Новый',
    preparing: 'Готовится',
    ready: 'Готов',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
  }[status] || status;
}
