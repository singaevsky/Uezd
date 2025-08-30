// frontend/pages/chef/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated } from '../../lib/auth';

export default function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const fetchChefData = async () => {
      const token = localStorage.getItem('access_token');

      const [ordersRes, recipesRes, ingredientsRes] = await Promise.all([
        fetch('/api/orders/', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/recipes/', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/ingredients/', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const orders = await ordersRes.json();
      const recipes = await recipesRes.json();
      const ingredients = await ingredientsRes.json();

      // Фильтруем только "новые" и "готовятся" заказы
      const activeOrders = orders.filter(o => ['new', 'preparing'].includes(o.status));
      setOrders(activeOrders);
      setRecipes(recipes);
      setIngredients(ingredients);
      setLoading(false);
    };

    fetchChefData();
  }, []);

  if (loading) return <div className="loading">Загрузка данных...</div>;

  return (
    <div className="chef-dashboard">
      <header className="header">
        <h1>Кондитерская панель</h1>
        <Link href="/" className="back-link">← На сайт</Link>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Текущие заказы
        </button>
        <button
          className={activeTab === 'recipes' ? 'active' : ''}
          onClick={() => setActiveTab('recipes')}
        >
          Рецепты
        </button>
        <button
          className={activeTab === 'ingredients' ? 'active' : ''}
          onClick={() => setActiveTab('ingredients')}
        >
          Ингредиенты
        </button>
      </nav>

      {/* Вкладка: Заказы */}
      {activeTab === 'orders' && (
        <section className="tab-content">
          <h2>Заказы в работе</h2>
          {orders.length === 0 ? (
            <p>Нет активных заказов.</p>
          ) : (
            <ul className="orders-list">
              {orders.map(order => (
                <li key={order.id} className="order-card">
                  <div className="order-header">
                    <strong>Заказ #{order.id}</strong>
                    <span className={`status ${order.status}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p><strong>Дата доставки:</strong> {order.delivery_date} в {order.delivery_time}</p>
                  <p><strong>Адрес:</strong> {order.delivery_address}</p>
                  <p><strong>Телефон:</strong> {order.phone}</p>
                  <div className="items-preview">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="item">
                        {item.product} ({item.weight}) — {item.quantity} шт.
                      </div>
                    ))}
                  </div>
                  <div className="actions">
                    <button className="btn ready" onClick={() => markAsReady(order.id)}>
                      Готов
                    </button>
                    <button className="btn cancel">Отменить</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Вкладка: Рецепты */}
      {activeTab === 'recipes' && (
        <section className="tab-content">
          <h2>Рецепты тортов</h2>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <h3>{recipe.name}</h3>
                <p><strong>Время:</strong> {recipe.prep_time} мин</p>
                <details>
                  <summary>Ингредиенты</summary>
                  <ul>
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing.name} — {ing.amount}</li>
                    ))}
                  </ul>
                </details>
                <details>
                  <summary>Рецепт</summary>
                  <p>{recipe.instructions}</p>
                </details>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Вкладка: Ингредиенты */}
      {activeTab === 'ingredients' && (
        <section className="tab-content">
          <h2>Склад ингредиентов</h2>
          <table className="ingredients-table">
            <thead>
              <tr>
                <th>Ингредиент</th>
                <th>Остаток</th>
                <th>Ед. изм.</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map(ing => (
                <tr key={ing.id}>
                  <td>{ing.name}</td>
                  <td>{ing.stock}</td>
                  <td>{ing.unit}</td>
                  <td>
                    <span className={`stock-status ${getStockStatus(ing.stock)}`}>
                      {getStockLabel(ing.stock)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <style jsx>{`
        .chef-dashboard {
          font-family: 'Open Sans', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #fdfaf5;
          min-height: 100vh;
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

        .back-link {
          color: #D4AF37;
          text-decoration: none;
          font-weight: 600;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tabs button {
          padding: 12px 20px;
          background: #eee;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .tabs button.active {
          background: #D4AF37;
          color: white;
        }

        .tab-content {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .tab-content h2 {
          font-family: 'Playfair Display', serif;
          color: #6B4423;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        /* Заказы */
        .orders-list {
          list-style: none;
          padding: 0;
        }

        .order-card {
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          background: #fff;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 1.1rem;
        }

        .status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status.new { background: #FFE4B5; color: #D4AF37; }
        .status.preparing { background: #FFFACD; color: #8B7D6B; }

        .items-preview {
          margin: 10px 0;
          font-size: 0.95rem;
        }

        .item {
          margin: 4px 0;
        }

        .actions {
          margin-top: 12px;
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .btn.ready { background: #4CAF50; color: white; }
        .btn.cancel { background: #f44336; color: white; }

        /* Рецепты */
        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .recipe-card {
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 16px;
          background: #fff;
          font-size: 0.95rem;
        }

        .recipe-card h3 {
          margin-top: 0;
          color: #6B4423;
        }

        details summary {
          cursor: pointer;
          font-weight: 600;
          color: #333;
        }

        /* Ингредиенты */
        .ingredients-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .ingredients-table th,
        .ingredients-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .ingredients-table th {
          background: #f5f5f5;
          color: #333;
        }

        .stock-status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .stock-status.ok { background: #e6ffe6; color: #2e8b57; }
        .stock-status.low { background: #fff3e0; color: #ff8f00; }
        .stock-status.critical { background: #ffebee; color: #c62828; }

        .loading {
          text-align: center;
          font-size: 1.2rem;
          color: #666;
          margin: 40px 0;
        }
      `}</style>
    </div>
  );
}

// Вспомогательные функции
function getStatusLabel(status) {
  return {
    new: 'Новый',
    preparing: 'Готовится'
  }[status] || status;
}

function getStockStatus(amount) {
  if (amount < 0.1) return 'critical';
  if (amount < 0.5) return 'low';
  return 'ok';
}

function getStockLabel(amount) {
  if (amount < 0.1) return 'Критично';
  if (amount < 0.5) return 'Мало';
  return 'Достаточно';
}
