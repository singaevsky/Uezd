// frontend/pages/checkout.js
import { useState, useEffect } from 'react';
import { getCart } from '../lib/cart';
import { isAuthenticated } from '../lib/auth';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    date: '',
    time: '12:00',
    payment: 'cash',
    phone: '',
    comment: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
    } else {
      setCart(getCart());
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    const orderData = {
      ...formData,
      total_price: total,
      items: cart.map(c => ({ variant_id: c.variantId, quantity: c.quantity })),
    };

    const res = await fetch('/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      alert('Заказ оформлен!');
      localStorage.removeItem('cart');
      window.location.href = '/account/orders';
    } else {
      alert('Ошибка при оформлении заказа');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif mb-6">Оформление заказа</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl mb-4">Адрес доставки</h2>
            <textarea
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full border p-2 rounded"
              rows="3"
              placeholder="Улица, дом, квартира"
              required
            />
          </div>
          <div>
            <h2 className="text-xl mb-4">Контакты</h2>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full border p-2 rounded mb-4"
              placeholder="Телефон"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full border p-2 rounded mb-4"
              required
            />
            <select
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="10:00">10:00</option>
              <option value="12:00">12:00</option>
              <option value="14:00">14:00</option>
              <option value="16:00">16:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl mb-4">Способ оплаты</h2>
          <label className="inline-flex items-center mr-6">
            <input type="radio" name="payment" value="cash" checked={formData.payment === 'cash'} onChange={e => setFormData({...formData, payment: e.target.value})} />
            <span className="ml-2">Наличные</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="payment" value="card" checked={formData.payment === 'card'} onChange={e => setFormData({...formData, payment: e.target.value})} />
            <span className="ml-2">Карта при получении</span>
          </label>
        </div>

        <div className="mt-6">
          <label>Комментарий</label>
          <textarea
            value={formData.comment}
            onChange={e => setFormData({...formData, comment: e.target.value})}
            className="w-full border p-2 rounded"
            rows="2"
          />
        </div>

        <div className="mt-8 font-bold text-xl">
          Итого: {total} ₽
        </div>
        <button
          type="submit"
          className="mt-4 bg-amber-600 text-white px-8 py-3 rounded font-semibold hover:bg-amber-700"
        >
          Подтвердить заказ
        </button>
      </form>
    </div>
  );
}
