// frontend/components/Cart.js
import { useState } from 'react';

export default function Cart({ items = [], onClose }) {
  const [cartItems, setCartItems] = useState(items);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Корзина</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex items-center gap-4 py-4 border-b">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-amber-600 font-semibold">{item.price} ₽</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center border">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center border">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500 text-sm">Удалить</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {total > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-lg font-bold">
              Итого: {total} ₽
            </div>
            <button className="w-full bg-amber-600 text-white py-3 rounded mt-4 hover:bg-amber-700">
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
