// frontend/pages/admin/analytics.js
import { useEffect, useRef } from 'react';

export default function Analytics() {
  const chartRef = useRef();

  useEffect(() => {
    fetch('/api/admin/analytics/', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const ctx = chartRef.current.getContext('2d');
        new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.dates,
            datasets: [{
              label: 'Выручка (₽)',
              data: data.revenue,
              backgroundColor: '#D4AF37'
            }]
          },
          options: { responsive: true }
        });
      });
  }, []);

  return (
    <div>
      <h1>Аналитика продаж</h1>
      <canvas ref={chartRef} height="100" />
    </div>
  );
}
