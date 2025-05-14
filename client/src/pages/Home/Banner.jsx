import React from 'react';
import { parseISO, isValid, format } from 'date-fns';
import { useFavorites } from '../../context/FavoritesContext';
import { EmptyHeartIcon } from '../../components/icons/empty-heart-icon.component';
import { FilledHeartIcon } from '../../components/icons/filled-heart-icon.component';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Banner({ movie }) {
  const { favorites, toggleFavorite, loading, getFavoriteKey } = useFavorites();
  if (!movie) return null;

  const isTmdb = Boolean(movie.tmdb_id || typeof movie.id === 'number');
  const favKey = getFavoriteKey(movie, isTmdb);
  const liked = favorites.has(favKey);
  const movieId = isTmdb ? movie.id : movie._id;

  const title = movie.title || movie.name || 'Без назви';

  let dateLabel = 'Дата невідома';
  const rawDate = movie.release_date || movie.releaseDate || movie.releaseYear;

  if (typeof rawDate === 'number') {
    dateLabel = String(rawDate);
  } else if (typeof rawDate === 'string') {
    const parsed = parseISO(rawDate);
    if (isValid(parsed)) {
      dateLabel = format(parsed, 'dd.MM.yyyy');
    } else if (/^\d{4}$/.test(rawDate)) {
      dateLabel = rawDate;
    }
  }

  const rating = movie.rating ?? movie.vote_average ?? 0;
  const posterUrl = movie.backdrop_path || movie.backdropPath || movie.posterPath || '';
  const backgroundImage = isTmdb
    ? `https://image.tmdb.org/t/p/original${posterUrl}`
    : `${API}/${posterUrl.replace(/^\/?/, '')}`;

  return (
  <Link
    to={`/movie/${movieId}`}
    className="relative block h-[455px] overflow-hidden ml-[258px] mr-[-1rem] group"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-10 pb-[53px] flex flex-col justify-end text-white z-10">
      <h2 className="text-4xl font-bold mb-2">{title}</h2>
      <div className="flex text-lg items-center mb-4 gap-[10px]">
        <p>{dateLabel}</p>
        <span>|</span>
        <p className="text-yellow-500 font-semibold">★ {rating}</p>
      </div>
      <div className="flex items-center gap-4">
        {/* Зупиняємо клік по кнопках, щоб не переходило по посиланню */}
        <button
          onClick={(e) => e.preventDefault()}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-[14px] h-[54px] w-[180px] whitespace-nowrap text-white text-[16px] font-semibold transition"
        >
          Дивитись зараз
        </button>
        <button
          onClick={(e) => {
            e.preventDefault(); // Зупинити переходи по посиланню
            toggleFavorite(movie, isTmdb);
          }}
          disabled={loading}
          className="w-[54px] h-[54px] flex items-center justify-center backdrop-blur-[5.93px]"
          style={{
            borderRadius: '8.296px',
            border: '0.593px solid white',
            background: 'linear-gradient(99deg,#FFF 3.36%,rgba(255,255,255,0) 238.16%)',
          }}
        >
          {liked ? <FilledHeartIcon size={24} /> : <EmptyHeartIcon size={24} />}
        </button>
      </div>
    </div>
  </Link>
);
}
