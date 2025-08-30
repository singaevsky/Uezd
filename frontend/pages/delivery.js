// frontend/pages/delivery.js
export default function DeliveryPage() {
  return (
    <div className="page delivery">
      <h1>Доставка и оплата</h1>

      <section>
        <h2>🚚 Доставка</h2>
        <p><strong>Стоимость:</strong> от 300 ₽ (в зависимости от района)</p>
        <p><strong>Срок:</strong> от 3 часов до 2 суток</p>
        <p><strong>Интервалы:</strong> 10:00–14:00, 14:00–18:00, 18:00–22:00</p>
        <p>Торты доставляются в специальных коробках с охлаждением.</p>
      </section>

      <section>
        <h2>💳 Оплата</h2>
        <p>Принимаем:</p>
        <ul>
          <li>Наличные при получении</li>
          <li>Карта (курьером или при самовывозе)</li>
          <li>СБП (Система быстрых платежей)</li>
        </ul>
      </section>

      <section>
        <h2>📦 Самовывоз</h2>
        <p>Адрес: г. Москва, ул. Цветочная, д. 15</p>
        <p>График: ежедневно с 9:00 до 21:00</p>
      </section>

      <style jsx>{`
        .page {
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Open Sans', sans-serif;
          line-height: 1.6;
        }
        h1, h2 {
          font-family: 'Playfair Display', serif;
          color: #6B4423;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
        }
        section {
          margin-bottom: 30px;
        }
        ul {
          margin: 10px 0 10px 20px;
        }
      `}</style>
    </div>
  );
}
