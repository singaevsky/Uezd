// frontend/pages/admin/products.js
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [fillings, setFillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    fetch('/api/fillings/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => res.json())
      .then(data => setFillings(data));

    fetchProducts();
  }, []);

  // В интерфейсе редактирования
<input
  name="base_price"
  type="number"
  value={editProduct.base_price}
  onChange={handleChange}
  step="0.01"
  className="input"
  placeholder="Цена за 1 кг"
/>
  const fetchProducts = () => {
    fetch('/api/products/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  const handleEdit = (product) => {
    setEditProduct({ ...product });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/products/${editProduct.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editProduct)
    });

    setEditProduct(null);
    fetchProducts();
    showNotification('Товар обновлён');
  };

  const addProduct = async () => {
    const newProduct = {
      name: 'Новый торт',
      description: 'Описание',
      category: 'cake',
      base_price: 1800,
      image: '/placeholder.jpg',
      is_seasonal: false
    };

    const token = localStorage.getItem('access_token');
    const res = await fetch('/api/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProduct)
    });

    if (res.ok) {
      fetchProducts();
      showNotification('Товар добавлен');
    }
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className="admin-products">
      <h1>Управление товарами</h1>
      <button onClick={addProduct} className="btn add">+ Добавить товар</button>

      {editProduct && (
        <div className="edit-modal">
          <h3>Редактировать: {editProduct.name}</h3>
          <input name="name" value={editProduct.name} onChange={handleChange} className="input" />
          <textarea name="description" value={editProduct.description} onChange={handleChange} className="input" rows="3" />
          <input name="base_price" type="number" value={editProduct.base_price} onChange={handleChange} className="input" />
          <label>
            <input
              type="checkbox"
              checked={editProduct.is_seasonal}
              onChange={(e) => setEditProduct(prev => ({ ...prev, is_seasonal: e.target.checked }))}
            />
            Сезонный
          </label>
          <div className="actions">
            <button onClick={saveProduct} className="btn save">Сохранить</button>
            <button onClick={() => setEditProduct(null)} className="btn cancel">Отмена</button>
          </div>
        </div>
      )}

      <table className="products-table">
        <thead>
          <tr>
            <th>Фото</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td><img src={p.image} alt={p.name} className="thumb" /></td>
              <td>{p.name}</td>
              <td>{p.base_price} ₽</td>
              <td>{p.category}</td>
              <td>
                <button onClick={() => handleEdit(p)} className="btn edit">Редактировать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .admin-products {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Open Sans', sans-serif;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          color: #6B4423;
        }

        .btn {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .btn.add { background: #4CAF50; color: white; }
        .btn.edit { background: #FF9800; color: white; font-size: 0.9rem; }
        .btn.save { background: #2196F3; color: white; }
        .btn.cancel { background: #f44336; color: white; }

        .input {
          width: 100%;
          padding: 8px;
          margin: 8px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .edit-modal {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .thumb {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
