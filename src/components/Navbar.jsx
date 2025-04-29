import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-800 text-white p-4 sticky top-0 z-50">
      <div className="flex space-x-4">
        <NavLink to="/"        className="hover:underline">Гловна</NavLink>
        <NavLink to="/search"  className="hover:underline">Пошук</NavLink>
        <NavLink to="/schedule"className="hover:underline">Сеанси</NavLink>

        {user?.role === 'user' && (
          <NavLink to="/favorites" className="hover:underline">Обрані</NavLink>
        )}

        {user?.role === 'admin' && (
          <NavLink to="/admin" className="hover:underline">Адмін</NavLink>
        )}

        <div className="ml-auto">
          {user
            ? <button onClick={logout} className="hover:underline">Вийти</button>
            : <NavLink to="/login" className="hover:underline">Увійти</NavLink>
          }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;