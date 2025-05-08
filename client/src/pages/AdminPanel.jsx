import React, { useState, useEffect } from 'react';
import MovieForm from '../forms/MovieForm';
import SessionForm from '../forms/SessionForm';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPanel() {
  const [films, setFilms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState([]);

  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editMovie, setEditMovie] = useState(null);

  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editSession, setEditSession] = useState(null);

  const [currentMovie, setCurrentMovie] = useState(null);
  const [sessionsForMovie, setSessionsForMovie] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
    loadFilms();
    loadSessions();
    loadStats();
  }, []);

  const checkAuth = () => {
    if (!localStorage.getItem('accessToken')) {
      setError('Необхідна авторизація. Увійдіть в систему.');
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  };

  const parseArray = async (res) => {
    if (!res.ok) {
      const { message } = await res.json().catch(() => ({}));
      throw new Error(message || res.statusText);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
  };

  const loadFilms = () =>
    fetch(`${API}/api/admin/films`, { headers: getAuthHeaders() })
      .then(parseArray)
      .then(setFilms)
      .catch((e) => setError('Не вдалося завантажити фільми'));

  const loadSessions = () =>
    fetch(`${API}/api/admin/sessions`, { headers: getAuthHeaders() })
      .then(parseArray)
      .then(setSessions)
      .catch((e) => setError('Не вдалося завантажити сеанси'));

  const loadStats = () =>
    fetch(`${API}/api/admin/stats`, { headers: getAuthHeaders() })
      .then(parseArray)
      .then(setStats)
      .catch((e) => setError('Не вдалося завантажити статистику'));

  // Фільми
  const handleAddFilm = () => {
    setEditMovie(null);
    setShowMovieForm(true);
  };
  const handleEditFilm = (film) => {
    setEditMovie(film);
    setShowMovieForm(true);
  };
  const handleMovieSubmit = () => {
    setShowMovieForm(false);
    setEditMovie(null);
    loadFilms();
  };
  const handleMovieCancel = () => {
    setShowMovieForm(false);
    setEditMovie(null);
  };
  const handleDeleteFilm = (id) => {
    if (!window.confirm('Видалити цей фільм?')) return;
    fetch(`${API}/api/admin/films/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(loadFilms);
  };
  const handleViewSessions = (film) => {
    setCurrentMovie(film);
    setEditSession(null);
    setSessionsForMovie(sessions.filter((s) => s.movieTitle === film.title));
  };

  // Сеанси
  const handleCloseSessions = () => {
    setCurrentMovie(null);
    setEditSession(null);
  };
  const handleAddSession = () => {
    setEditSession(null);
    setShowSessionForm(true);
  };
  const handleEditSession = (sess) => {
    setEditSession(sess);
    setShowSessionForm(true);
  };
  const handleSessionSubmit = () => {
    setShowSessionForm(false);
    setEditSession(null);
    loadSessions();
    if (currentMovie) handleViewSessions(currentMovie);
  };
  const handleSessionCancel = () => {
    setShowSessionForm(false);
    setEditSession(null);
  };
  const handleDeleteSession = (id) => {
    if (!window.confirm('Видалити цей сеанс?')) return;
    fetch(`${API}/api/admin/sessions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(() => {
      loadSessions();
      if (currentMovie) handleViewSessions(currentMovie);
    });
  };
  const handlePriceChange = (id, price) => {
    fetch(`${API}/api/admin/sessions/${id}/price`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ price: Number(price) }),
    }).then(loadSessions);
  };

  return (
    <div className="ml-64 p-6 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Адмін-панель</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Помилка: </strong>
          <span>{error}</span>
        </div>
      )}

      {/* Фільми */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Фільми</h2>
          <button
            onClick={handleAddFilm}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
          >
            Додати фільм
          </button>
        </div>

        {showMovieForm && (
          <MovieForm
            initialData={editMovie}
            onSubmit={handleMovieSubmit}
            onCancel={handleMovieCancel}
          />
        )}

        {films.length === 0 ? (
          <p>Немає фільмів</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">Постер</th>
                <th className="px-4 py-2">Назва</th>
                <th className="px-4 py-2">Рік</th>
                <th className="px-4 py-2">Жанри</th>
                <th className="px-4 py-2">Дії</th>
              </tr>
            </thead>
            <tbody>
              {films.map((f) => (
                <tr key={f._id || f.id} className="odd:bg-white dark:odd:bg-gray-700 even:bg-gray-50 dark:even:bg-gray-800">
                  <td className="px-4 py-2">
                    <img
                      src={f.posterUrl || f.posterPath}
                      alt={f.title}
                      className="h-16"
                    />
                  </td>
                  <td className="px-4 py-2">{f.title}</td>
                  <td className="px-4 py-2">{f.year || f.releaseYear}</td>
                  <td className="px-4 py-2">{(f.genres || []).join(', ')}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => handleEditFilm(f)} className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded">
                      Редагувати
                    </button>
                    <button onClick={() => handleDeleteFilm(f._id || f.id)} className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded">
                      Видалити
                    </button>
                    <button onClick={() => handleViewSessions(f)} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded">
                      Сеанси
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Сеанси */}
      {currentMovie && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Сеанси для «{currentMovie.title}»</h2>
            <div className="space-x-2">
              <button
                onClick={handleAddSession}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
              >
                Додати сеанс
              </button>
              <button
                onClick={handleCloseSessions}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
              >
                Закрити сеанси
              </button>
            </div>
          </div>

          {showSessionForm && (
            <SessionForm
              initialData={editSession}
              movieId={currentMovie._id}
              onSubmit={handleSessionSubmit}
              onCancel={handleSessionCancel}
            />
          )}

          {sessionsForMovie.length === 0 ? (
            <p>Немає сеансів</p>
          ) : (
            <table className="w-full table-auto border-collapse mb-6">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Дата</th>
                  <th className="px-4 py-2">Час</th>
                  <th className="px-4 py-2">Ціна</th>
                  <th className="px-4 py-2">Дії</th>
                </tr>
              </thead>
              <tbody>
                {sessionsForMovie.map((s) => (
                  <tr key={s.id} className="odd:bg-white dark:odd:bg-gray-700 even:bg-gray-50 dark:even:bg-gray-800">
                    <td className="px-4 py-2">{s.date}</td>
                    <td className="px-4 py-2">{s.time}</td>
                    <td className="px-4 py-2">{s.price}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleEditSession(s)} className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded">
                        Редагувати
                      </button>
                      <button onClick={() => handleDeleteSession(s.id)} className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded">
                        Видалити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Статистика */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Статистика продажів</h2>
        {stats.length === 0 ? (
          <p>Немає даних</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={stats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
