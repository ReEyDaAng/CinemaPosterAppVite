// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (login({ username, password })) {
       navigate('/');
     } else {
       alert('Невірний нікнейм або пароль');
     }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Увійти</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">Нікнейм</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Ваш нікнейм"
            required
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Пароль"
            required
            className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Увійти
        </button>
      </form>
    </div>
  );
}
