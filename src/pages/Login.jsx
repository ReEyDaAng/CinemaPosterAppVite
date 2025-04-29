// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/'); // після входу на головну (або куди вам треба)
    } else {
      setError('Невірне ім’я або пароль');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Увійти</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* поля username/password */}
      </form>
    </div>
  );
}

export default Login;
