import React, { useState, useEffect } from 'react';

export default function MovieForm(props) {
  // якщо initialData === null, перетворимо на {}
  const initialData = props.initialData ?? {};
  const { onSubmit, onCancel } = props;
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [releaseYear, setReleaseYear] = useState(initialData.releaseYear || '');
  const [rating, setRating] = useState(initialData.rating ?? 0);

  const [genresList, setGenresList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(initialData.genres || []);

  const [posterFile, setPosterFile] = useState(null);
  const [error, setError] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [genresError, setGenresError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);
        // **тут додано префікс /api/**
        const res = await fetch(`${API}/api/admin/genres`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data = await res.json();
        setGenresList(data);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setGenresError('Не вдалося завантажити список жанрів');
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, [API]);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !releaseYear) {
      setError("Заповніть обов'язкові поля");
      return;
    }
    if (genresError) {
      setError('Неможливо зберегти без жанрів');
      return;
    }

    setLoadingSubmit(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('releaseYear', releaseYear);
      formData.append('rating', rating);
      formData.append('genres', JSON.stringify(selectedGenres));
      if (posterFile) formData.append('poster', posterFile);

      const method = initialData._id ? 'PATCH' : 'POST';
      const url = initialData._id
        ? `${API}/api/admin/films/${initialData._id}`
        : `${API}/api/admin/films`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Помилка збереження');
      }

      const data = await response.json();
      onSubmit(data);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Сталася помилка при збереженні фільму');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
      >
        {genresError && (
          <div className="bg-red-700 px-4 py-2 rounded text-white">
            {genresError}
          </div>
        )}

        {error && (
          <div className="bg-red-800 px-4 py-2 rounded text-white">
            {error}
          </div>
        )}

        {/* Назва */}
        <div>
          <label className="block text-sm font-medium mb-1">Назва *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded"
            required
          />
        </div>

        {/* Опис */}
        <div>
          <label className="block text-sm font-medium mb-1">Опис</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded"
            rows={4}
          />
        </div>

        {/* Рік випуску */}
        <div>
          <label className="block text-sm font-medium mb-1">Рік випуску *</label>
          <input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded"
            required
          />
        </div>

        {/* Рейтинг */}
        <div>
          <label className="block text-sm font-medium mb-1">Рейтинг</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded"
          />
        </div>

        {/* Жанри */}
        <div>
          <label className="block text-sm font-medium mb-1">Жанри</label>
          {loadingGenres ? (
            <p className="text-gray-300">Завантаження жанрів...</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {genresList.length > 0 ? (
                genresList.map((genre) => (
                  <label key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                      className="form-checkbox mr-2"
                    />
                    <span>{genre}</span>
                  </label>
                ))
              ) : (
                <p className="col-span-3 text-gray-300">Жанри не знайдено</p>
              )}
            </div>
          )}
        </div>

        {/* Постер */}
        <div>
          <label className="block text-sm font-medium mb-1">Постер</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPosterFile(e.target.files[0])}
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded"
          />
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            disabled={loadingSubmit}
          >
            Відміна
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            disabled={loadingSubmit || loadingGenres || !!genresError}
          >
            {loadingSubmit ? 'Обробка...' : initialData._id ? 'Оновити' : 'Додати'}
          </button>
        </div>
      </form>
    </div>
  );
}
