import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { EmptyHeartIcon } from './icons/empty-heart-icon.component';
import { FilledHeartIcon } from './icons/filled-heart-icon.component';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MovieCard({ movie, genres = {}, fluid = false }) {
  const { favorites, toggleFavorite, loading } = useFavorites();

  const isTmdb = Boolean(movie.tmdb_id || typeof movie.id === 'number');
  const movieId = (isTmdb ? movie.tmdb_id ?? movie.id : movie._id ?? movie.id).toString();
  const favKey = isTmdb ? `tmdb-${movieId}` : `local-${movieId}`;

  const liked = favorites.has(favKey);
  const title = movie.title || movie.name || 'Без назви';
  const year =
    movie.year ||
    movie.releaseYear ||
    (movie.release_date ? movie.release_date.substring(0, 4) : null);

  let posterUrl = '';
  if (isTmdb && movie.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  } else {
    const rawPoster =
      movie.posterUrl ||
      movie.poster ||
      movie.image ||
      movie.poster_path ||
      movie.posterPath;
    if (rawPoster) {
      posterUrl = rawPoster.startsWith('http')
        ? rawPoster
        : `${API}/${rawPoster.replace(/^\/?/, '')}`;
    }
  }

  let genreNames = '';
  if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    genreNames = movie.genre_ids.map((id) => genres[id]).filter(Boolean).join(', ');
  } else if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    genreNames = movie.genres.join(', ');
  } else {
    genreNames = movie.genre || 'Не вказано';
  }

  const rating = movie.rating ?? movie.vote_average ?? 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!loading) toggleFavorite(movie, isTmdb);
  };

  return (
    <Link
      to={`/movie/${movieId}`}
      className={`block bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-white-2xl transition ${
        fluid ? 'w-full' : 'w-72'
      }`}
    >
      <div className="relative">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-96 object-cover"
          />
        ) : (
          <div className="w-full h-96 flex items-center justify-center bg-gray-700 text-gray-400">
            Немає зображення
          </div>
        )}
        <button
          onClick={handleToggle}
          disabled={loading}
          className="absolute top-2 right-2 w-[34px] h-[34px] flex items-center justify-center backdrop-blur-[5.93px] shadow-md"
          style={{
            borderRadius: '8.296px',
            border: '0.593px solid white',
            background: 'linear-gradient(99deg,#FFF 3.36%,rgba(255,255,255,0) 238.16%)',
          }}
          aria-label={liked ? 'Прибрати з обраного' : 'Додати до обраного'}
        >
          {liked ? <FilledHeartIcon size={20} /> : <EmptyHeartIcon size={20} />}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        {year && <p className="text-xs text-gray-400 mb-1">{year}</p>}
        <p className="text-xs text-gray-400 mb-2">{genreNames}</p>
        {rating != null && (
          <p className="text-sm font-semibold text-yellow-400">★ {rating}</p>
        )}
      </div>
    </Link>
  );
}
