import React from 'react';
import { EmptyHeartIcon }  from './icons/empty-heart-icon.component';
import { FilledHeartIcon } from './icons/filled-heart-icon.component';
import { useFavorites }    from '../context/FavoritesContext';

/**
 * props:
 *   movie – весь об’єкт TMDb чи LocalMovie (потрібен для payload)
 *   className – додаткові Tailwind-класи
 */
export default function FavoriteButton({ movie, className = '' }) {
  const { favorites, toggleFavorite, loading } = useFavorites();

  const movieId = movie.tmdb_id || movie.id || movie._id;
  const liked   = favorites.has(movieId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(movie)}
      disabled={loading}
      className={
        'flex items-center justify-center w-8 h-8 rounded-md ' +
        'backdrop-blur-[5px] hover:scale-110 transition ' +
        className
      }
      style={{
        border: '1px solid rgba(255,255,255,0.8)',
        background:
          'linear-gradient(99deg,#FFF 3%,rgba(255,255,255,0) 238%)',
      }}
      title={liked ? 'Видалити з обраного' : 'Додати до обраного'}
    >
      {liked ? <FilledHeartIcon /> : <EmptyHeartIcon />}
    </button>
  );
}
