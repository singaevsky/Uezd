// frontend/components/Auth/Login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { saveToken } from '../../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      saveToken(data);
      router.push('/account');
    } else {
      setError(data.detail || 'Ошибка входа');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Вход</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700">
        Войти
      </button>
      <p className="mt-4 text-center">
        Нет аккаунта? <a href="/register" className="text-pink-600">Зарегистрироваться</a>
      </p>
    </form>
  );
}
