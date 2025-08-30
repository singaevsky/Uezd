// frontend/pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [promoOpen, setPromoOpen] = useState(true);

  return (
    <>
      <Head>
        <title>Уездный кондитер — Авторские торты на заказ</title>
        <meta name="description" content="Вкусные торты ручной работы от Уездного кондитера. Доставка по городу." />
         <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Промо-баннер */}
      {promoOpen && (
        <div className="bg-pink-100 text-pink-800 text-center py-2 text-sm">
          Акция! Скидка 15% на торты к Новому году{' '}
          <button onClick={() => setPromoOpen(false)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Герой-слайдер */}
      <section className="bg-gradient-to-r from-pink-50 to-amber-50 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-gray-800 mb-4">
            Сладкие моменты жизни
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Авторские торты ручной работы с доставкой
          </p>
          <Link href="/builder">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition">
              Собрать торт за 5 минут
            </button>
          </Link>
        </div>
      </section>

      {/* Хиты продаж */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-10">Хиты продаж</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {['Чёрный лес', 'Три шоколада', 'Медовик', 'Эстерхази'].map((cake) => (
              <div key={cake} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <img src={`/cakes/${cake}.webp`} alt={cake} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{cake}</h3>
                  <p className="text-gray-600 text-sm">От 1800 ₽</p>
                  <button className="mt-2 bg-amber-600 text-white text-sm px-4 py-1 rounded">В корзину</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: Создай свой торт */}
      <section className="bg-amber-50 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif mb-4">Создайте торт своей мечты</h2>
          <p className="text-gray-600 mb-6">Выберите форму, начинку, декор и получите торт под ваше событие</p>
          <Link href="/builder">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700">
              Начать конструирование
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
