// frontend/pages/admin/pricing.js
import { useEffect, useState } from 'react';

export default function PricingSync() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    fetch('/api/products/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => res.json())
      .then(data => setPrices(data));
  }, []);

  const syncWithExternal = () => {
    // Имитация синхронизации с внешним прайсом
    const updated = prices.map(p => ({
      ...p,
      base_price: p.base_price * 1.05 // Пример: индексация на 5%
    }));

    Promise.all(
      updated.map(p =>
        fetch(`/api/products/${p.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify(p)
        })
      )
    ).then(() => {
      alert('Цены синхронизированы!');
      window.location.reload();
    });
  };

  return (
    <div>
      <h1>Синхронизация цен</h1>
      <button onClick={syncWithExternal}>🔄 Синхронизировать с прайсом</button>
      <p><small>Последнее обновление цен: {new Date().toLocaleString()}</small></p>
    </div>
  );
}
