import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 flex items-center p-4 bg-gray-200 dark:bg-gray-800">
      <NavLink to="/" className="mr-4 hover:underline">Головна</NavLink>
      <NavLink to="/search" className="mr-4 hover:underline">Пошук</NavLink>
      <NavLink to="/schedule" className="mr-4 hover:underline">Сеанси</NavLink>

      {user?.role === 'user' && (
        <NavLink to="/favorites" className="mr-4 hover:underline">Обрані</NavLink>
      )}
      {user?.role === 'admin' && (
        <NavLink to="/admin" className="mr-4 hover:underline">Адмін</NavLink>
      )}

      <div className="ml-auto">
        {user ? (
          <button onClick={logout} className="hover:underline">Вийти</button>
        ) : (
          <NavLink to="/login" className="hover:underline">Увійти</NavLink>
        )}
      </div>
    </nav>
  );
}
