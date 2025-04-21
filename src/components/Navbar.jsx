import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="sticky top-0 bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link to="/" className="mr-4">Кіноафіша</Link>
        <Link to="/search" className="mr-4">Пошук</Link>
        <Link to="/schedule" className="mr-4">Сеанси</Link>
        <Link to="/favorites" className="mr-4">Обрані</Link>
      </div>
      <div>
        <Link to="/admin" className="mr-4">Адмін</Link>
        <Link to="/login">Увійти</Link>
      </div>
    </nav>
  );
}

export default Navbar;