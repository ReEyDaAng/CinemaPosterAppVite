import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { AnimatePresence, motion } from 'framer-motion';

const TMDB_BASE = 'https://image.tmdb.org/t/p/w780';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirm, setConfirm] = useState('');
  const [bgPath, setBgPath] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Підвантажуємо випадкове фонове зображення
  useEffect(() => {
    const id = Math.floor(Math.random() * 1000) + 1;
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
    )
      .then(r => r.json())
      .then(data => {
        if (data.backdrop_path) {
          setBgPath(data.backdrop_path);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  // Поки фон не підвантажився, показуємо Loader
  if (!loaded) return <Loader />;

  const variants = {
    initial: { opacity: 0, y: mode === 'login' ? -20 : 20 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: mode === 'login' ? 20 : -20 },
  };

  // Обробка відправки форми (логін або реєстрація)
  const handleSubmit = async e => {
    e.preventDefault();
    console.log('🔑 password =', password, '| confirm =', confirm);
    try {
      if (mode === 'login') {
        const ok = await login({ username, password });
        if (ok) navigate('/');
        else alert('Невірний нікнейм або пароль');
      } else {
        await register({ username, email, password, confirm });
        navigate('/');
      }
    } catch (err) {
      alert(err.message || 'Сталася помилка');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* фон */}
      {bgPath && (
        <img
          src={TMDB_BASE + bgPath}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/70" />

      {/* анімовані форми */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative z-10 w-full max-w-md p-8 bg-gray-800/90 rounded-lg shadow-xl flex flex-col items-center"
        >
          {/* перемикач режимів */}
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Увійти
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                mode === 'register'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Реєстрація
            </button>
          </div>

          {/* заголовок */}
          <h2 className="text-3xl font-bold text-white mb-6">
            {mode === 'login' ? 'Увійти' : 'Реєстрація'}
          </h2>

          {/* сама форма */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="email" className="block text-gray-200 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  required
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-gray-200 mb-1">
                Нікнейм
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ваш нікнейм"
                required
                className="w-full bg-gray-700 text-white px-4 py-2 rounded placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-200 mb-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Пароль"
                required
                className="w-full bg-gray-700 text-white px-4 py-2 rounded placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirm" className="block text-gray-200 mb-1">
                  Підтвердження пароля
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Повторіть пароль"
                  required
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition-colors mt-4"
            >
              {mode === 'login' ? 'Увійти' : 'Зареєструватися'}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
