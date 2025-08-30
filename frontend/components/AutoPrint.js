// frontend/components/AutoPrint.js
export const AutoPrint = ({ order }) => {
  const printOrder = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Заказ №${order.id}</title></head>
        <body onload="window.print(); window.close();">
          <h2>Заказ №${order.id}</h2>
          <p><strong>Дата:</strong> ${order.created_at}</p>
          <p><strong>Статус:</strong> ${getStatusLabel(order.status)}</p>
          <p><strong>Доставка:</strong> ${order.delivery_date} в ${order.delivery_time}</p>
          <p><strong>Адрес:</strong> ${order.delivery_address}</p>
          <h3>Товары:</h3>
          <ul>
            ${order.items.map(i => `<li>${i.product} — ${i.quantity} шт.</li>`).join('')}
          </ul>
          <h3>Итого: ${order.total_price} ₽</h3>
        </body>
      </html>
    `);
  };

  useEffect(() => {
    if (autoPrintEnabled && order) {
      printOrder();
    }
  }, [order]);

  return <button onClick={printOrder}>🖨️ Распечатать</button>;
};
