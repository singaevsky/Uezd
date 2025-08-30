// frontend/pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, phone })
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.email?.[0] || 'Ошибка регистрации');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Регистрация</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="tel" placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Зарегистрироваться</button>
      <p>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </p>

      <style jsx>{`
        .auth-form {
          max-width: 400px;
          margin: 40px auto;
          padding: 30px;
          border: 1px solid #eee;
          border-radius: 12px;
          font-family: 'Open Sans', sans-serif;
        }
        h2 {
          text-align: center;
          color: #6B4423;
          margin-bottom: 20px;
        }
        input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #D4AF37;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .error {
          color: #f44336;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
      `}</style>
    </form>
  );
}
