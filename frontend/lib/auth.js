// frontend/lib/auth.js
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export function login(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}
