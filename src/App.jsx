import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Search from './pages/Search'
import Schedule from './pages/Schedule'
import Favorites from './pages/Favorites'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'
import { Moon, Sun } from 'lucide-react'

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <AuthProvider>
      <Navbar />
      <div className="p-4 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="sticky top-20 flex justify-end">
          <button
            onClick={() => setDarkMode((p) => !p)}
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center text-blue-500 dark:text-blue-300 my-6">
          Вітаємо в Кіноафіші! 🎬
        </h1>

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/favorites" element={<Favorites />} />
 
          {/* AUTH */}
          <Route path="/login" element={<Login />} />
 
          {/* PRIVATE */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
