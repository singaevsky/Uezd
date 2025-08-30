// frontend/pages/account/orders.js
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/orders/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="account-orders">
      <div className="header">
        <h1>История заказов</h1>
        <Link href="/account">← Назад в профиль</Link>
      </div>

      {orders.length === 0 ? (
        <p>У вас пока нет заказов.</p>
      ) : (
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order.id} className="order-card">
              <div className="order-header">
             <span className={`status ${order.status}`}> {getStatusLabel(order.status)}</span>
            {order.source === 'telegram' && (
            <span className="source-tag">📱 из Telegram</span>
  )}
  <small>{new Date(order.created_at).toLocaleDateString()}</small>
</div>

              <div className="order-details">
                <p><strong>Доставка:</strong> {order.delivery_date} в {order.delivery_time}</p>
                <p><strong>Адрес:</strong> {order.delivery_address}</p>
                <p><strong>Оплата:</strong> {getPaymentLabel(order.payment_method)}</p>
                <p><strong>Телефон:</strong> {order.phone}</p>
                {order.comment && <p><strong>Комментарий:</strong> {order.comment}</p>}
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item">
                    <strong>{item.product}</strong> ({item.weight}) — {item.quantity} шт.
                    <br />
                    <small>Начинка: {item.filling}</small>
                    <div className="price">{item.price} ₽</div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                Итого: <strong>{order.total_price} ₽</strong>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .account-orders {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Open Sans', sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #6B4423;
        }
     .source-tag {
    background: #1E90FF;
    color: white;
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 12px;
    margin-left: 8px;
      }
        .header a {
          color: #D4AF37;
          text-decoration: none;
          font-weight: 600;
        }

        .loading {
          text-align: center;
          font-size: 1.2rem;
          color: #666;
          margin: 40px 0;
        }

        .orders-list {
          list-style: none;
          padding: 0;
        }

        .order-card {
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 0.9rem;
          color: #555;
        }

        .status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status.new { background: #FFE4B5; color: #D4AF37; }
        .status.preparing { background: #FFFACD; color: #8B7D6B; }
        .status.ready { background: #E6F7E6; color: #2E8B57; }
        .status.delivered { background: #E6F7FF; color: #1E90FF; }
        .status.cancelled { background: #FFECEC; color: #B22222; }

        .order-details {
          font-size: 0.95rem;
          color: #444;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .order-items {
          background: #fafafa;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .item {
          margin-bottom: 8px;
          position: relative;
        }

        .item .price {
          position: absolute;
          right: 0;
          top: 0;
          color: #6B4423;
          font-weight: 600;
        }

        .order-total {
          text-align: right;
          font-size: 1.1rem;
          font-weight: 600;
          color: #6B4423;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

// Вспомогательные функции
function getStatusLabel(status) {
  const labels = {
    new: 'Новый',
    preparing: 'Готовится',
    ready: 'Готов',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
  };
  return labels[status] || status;
}

function getPaymentLabel(method) {
  const labels = {
    cash: 'Наличные',
    card: 'Карта при получении',
    sbp: 'СБП'
  };
  return labels[method] || method;
}
