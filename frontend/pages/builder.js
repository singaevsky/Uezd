// frontend/pages/builder.js
import { useState } from 'react';
import Head from 'next/head';

// Начинки (как на jvcake.ru)
const fillings = [
  'Ванильная',
  'Медовик',
  'Морковная',
  'Прага',
  'Сливочный пломбир с ягодами',
  'Творожно-ягодная',
  'Три шоколада',
  'Шоколадная с арахисом и карамелью',
  'Шоколадно-ванильная',
  'Шоколадный мусс',
  'Эстерхази',
  'Чёрный лес'
];

export default function Builder() {
  const [weight, setWeight] = useState('1');
  const [filling, setFilling] = useState('');
  const [event, setEvent] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const price = weight === '1' ? 1800 : 3200;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('weight', weight);
    formData.append('filling', filling);
    formData.append('event', event);
    formData.append('comment', comment);
    if (image) formData.append('design_image', image);

    const token = localStorage.getItem('access_token');
    const res = await fetch('/api/builder/submit/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {
      alert('Заявка отправлена! Мы свяжемся с вами.');
    } else {
      alert('Ошибка при отправке.');
    }
  };

  return (
    <>
      <Head>
        <title>Конструктор тортов — Уездный кондитер</title>
      </Head>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif mb-8">Создайте свой торт</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          {/* Вес */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Вес</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="weight"
                  value="1"
                  checked={weight === '1'}
                  onChange={() => setWeight('1')}
                />
                <span className="ml-2">1 кг</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="weight"
                  value="2"
                  checked={weight === '2'}
                  onChange={() => setWeight('2')}
                />
                <span className="ml-2">2 кг</span>
              </label>
            </div>
          </div>

          {/* Начинка */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Начинка</label>
            <select
              value={filling}
              onChange={(e) => setFilling(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Выберите начинку</option>
              {fillings.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Событие */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Событие</label>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="День рождения, свадьба..."
              className="w-full border rounded p-2"
            />
          </div>

          {/* Комментарий */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Комментарий к заказу</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full border rounded p-2"
              placeholder="Цвет, надпись, особые пожелания..."
            />
          </div>

          {/* Загрузка эскиза */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Загрузите эскиз (по желанию)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {preview && (
              <div className="image-preview mt-2">
                <img
                  src={preview}
                  alt="Предпросмотр"
                  style={{ maxWidth: '300px', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>

          {/* Итого */}
          <div className="mb-6 font-bold text-lg">
            Итого: {price} ₽
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            className="bg-amber-600 text-white px-6 py-3 rounded font-semibold hover:bg-amber-700"
          >
            Отправить заявку
          </button>
        </form>
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        .image-preview img {
          border: 1px solid #ddd;
        }
      `}</style>
    </>
  );
}
