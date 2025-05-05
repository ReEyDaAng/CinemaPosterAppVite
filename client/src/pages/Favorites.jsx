import React from 'react';
import { useAuth } from '../context/AuthContext';

function Favorites() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-700">
          Спочатку потрібно <a href="/login" className="text-blue-600 underline">увійти</a>.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* тут ваш рендер списку обраних */}
    </div>
  );
}

export default Favorites;
