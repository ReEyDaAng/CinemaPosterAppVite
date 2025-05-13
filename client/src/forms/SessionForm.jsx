import React, { useState } from 'react';

// SessionForm як модальне вікно для додавання/редагування сеансу
export default function SessionForm({ initialData, movieId, onSubmit, onCancel }) {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Додано стандартне значення
  // Якщо є початкові дані, розбиваємо ISO на дату та час
  const [date, setDate] = useState(
    initialData?.sessionTime?.split('T')[0] || ''
  );
  const [time, setTime] = useState(
    initialData?.sessionTime?.split('T')[1]?.slice(0,5) || ''
  );
  const [price, setPrice] = useState(initialData?.price || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time || !price) {
      setError('Будь ласка, заповніть усі поля');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const id = initialData?._id || initialData?.id;
      const baseUrl = `${API}/api/admin/sessions`;
      const url = id ? `${baseUrl}/${id}` : baseUrl;
      const method = id ? 'PATCH' : 'POST';
      
      // Формуємо тіло запиту з правильними ключами
      const sessionTime = new Date(`${date}T${time}`).toISOString();
      const body = id
        ? { sessionTime, price: Number(price) }  // Added sessionTime to the update request
        : {
            movie: movieId,
            sessionTime: sessionTime,
            price: Number(price),
          };

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Необхідна авторизація. Будь ласка, увійдіть в систему.');
      }

      // Check if token is valid before making request
      if (token === 'undefined' || token === 'null') {
        localStorage.removeItem('AccessToken'); // Clear invalid token
        throw new Error('Недійсний токен авторизації. Будь ласка, увійдіть в систему знову.');
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        localStorage.removeItem('AccessToken'); // Clear expired token
        throw new Error('Сесія закінчилася. Будь ласка, увійдіть в систему знову.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);

      onSubmit(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Час</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ціна</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Введіть ціну квитка"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            disabled={loading}
          >
            Відміна
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
            disabled={loading}
          >
            {loading ? 'Завантаження...' : (initialData ? 'Зберегти' : 'Додати')}
          </button>
        </div>
      </form>
    </div>
  );
}