// frontend/pages/account/index.js
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';

export default function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Загрузка...</p>;

  return (
    <div className="account-dashboard">
      <h1>Личный кабинет</h1>
      <p><strong>Привет, {user.first_name || user.username}!</strong></p>
      <p>Телефон: {user.phone || 'не указан'}</p>
      <p>Бонусных баллов: <strong>{user.bonus_points || 0}</strong></p>

      <div className="menu">
        <a href="/account/orders" className="menu-item">История заказов</a>
        <a href="/account/profile" className="menu-item">Редактировать профиль</a>
        <a href="/catalog" className="menu-item">Продолжить покупки</a>
        <button onClick={() => {
          localStorage.removeItem('access_token');
          window.location.href = '/';
        }} className="menu-item danger">
          Выйти
        </button>
      </div>

      <style jsx>{`
        .account-dashboard {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Open Sans', sans-serif;
          text-align: center;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          color: #6B4423;
          margin-bottom: 20px;
        }

        .menu {
          margin-top: 30px;
        }

        .menu-item {
          display: block;
          padding: 12px 20px;
          margin: 10px 0;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: all 0.2s;
        }

        .menu-item:hover {
          background: #f5f5f5;
          border-color: #D4AF37;
        }

        .menu-item.danger {
          background: #ffebeb;
          color: #c00;
          border-color: #f00;
        }
      `}</style>
    </div>
  );
}
