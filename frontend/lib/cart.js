// frontend/lib/cart.js
import { getAccessToken } from './auth';

// Сохранение корзины в localStorage
export const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// Добавление в корзину (с API)
export const addToCart = async (variantId, quantity = 1) => {
  const token = getAccessToken();
  const res = await fetch('/api/cart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });

  if (res.ok) {
    const cart = getCart();
    const item = cart.find(i => i.variantId === variantId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.push({ variantId, quantity });
    }
    saveCart(cart);
  }
};
