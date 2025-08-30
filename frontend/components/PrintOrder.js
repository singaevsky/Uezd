// frontend/components/PrintOrder.js
import { useRef } from 'react';

export const PrintOrder = ({ order }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const popup = window.open('', '_blank', 'width=600,height=600');
    popup.document.write(`
      <html>
        <head>
          <title>Заказ №${order.id}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .section { margin: 15px 0; }
            table { width: 100%; border-collapse: collapse; }
            td, th { border: 1px solid #ddd; padding: 8px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h2>Заказ №${order.id}</h2>
            <p>${new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div class="section">
            <strong>Статус:</strong> ${getStatusLabel(order.status)}
          </div>

          <div class="section">
            <strong>Доставка:</strong> ${order.delivery_date} в ${order.delivery_time}
          </div>

          <div class="section">
            <strong>Адрес:</strong> ${order.delivery_address}
          </div>

          <table>
            <thead><tr><th>Товар</th><th>Кол-во</th><th>Цена</th></tr></thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.product} (${item.weight})</td>
                  <td>${item.quantity}</td>
                  <td>${item.price} ₽</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="section">
            <strong>Итого:</strong> ${order.total_price} ₽
          </div>
        </body>
      </html>
    `);
    popup.document.close();
  };

  return (
    <button onClick={handlePrint} className="print-btn">🖨️ Распечатать</button>
  );
};

function getStatusLabel(status) {
  return {
    new: 'Новый',
    preparing: 'Готовится',
    ready: 'Готов',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
  }[status] || status;
}
