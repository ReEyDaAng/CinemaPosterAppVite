import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Search from './pages/Search';
import Schedule from './pages/Schedule';
import Favorites from './pages/Favorites';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <>
      <Navbar />
      <div className="p-4 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        <div className="flex justify-end">
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            title={darkMode ? 'Перемкнути на світлу тему' : 'Перемкнути на темну тему'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center text-blue-500 dark:text-blue-300 my-6">
          Вітаємо в Кіноафіші! 🎬
        </h1>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;