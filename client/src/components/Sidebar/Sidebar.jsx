import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[274px] bg-gray-200 dark:bg-gray-800 p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">Cinema Poster</h2>

      <NavLink to="/" className="hover:underline">Головна</NavLink>
      <NavLink to="/schedule" className="hover:underline">Сеанси</NavLink>

      {user?.role === "user" && (
        <NavLink to="/favorites" className="hover:underline">Обрані</NavLink>
      )}
      {user?.role === "admin" && (
        <NavLink to="/admin" className="hover:underline">Адмін</NavLink>
      )}

      <div className="mt-auto">
        {user ? (
          <button onClick={logout} className="hover:underline">Вийти</button>
        ) : (
          <NavLink to="/login" className="hover:underline">Увійти</NavLink>
        )}
      </div>
    </aside>
  );
}
