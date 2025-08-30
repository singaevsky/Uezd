// frontend/lib/auth.js

// Проверка, что мы в браузере
const isBrowser = typeof window !== 'undefined';

export const saveToken = (tokens) => {
  if (!isBrowser) return;
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
};

export const getAccessToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem('refresh_token');
};

export const logout = () => {
  if (!isBrowser) return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  if (!isBrowser) return false;
  return !!getAccessToken();
};
