import React from "react";
import { Link } from "react-router-dom";
import { EmptyHeartIcon } from "./icons/empty-heart-icon.component";
import { FilledHeartIcon } from "./icons/filled-heart-icon.component";
import { useFavorites } from "../context/FavoritesContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function MovieCard({ movie, genres = {}, fluid = false }) {
  const { favorites, toggleFavorite, loading } = useFavorites();
  
  if (!movie) {
    console.error("No movie data provided to MovieCard");
    return null;
  }

  /* --- ID та інші базові дані ------------------------------------------ */
  const isTmdb = Boolean(movie.tmdb_id || typeof movie.id === "number");
  const movieId = isTmdb ? (movie.id ?? movie.tmdb_id) : movie._id;
  const title = movie.title || movie.name || "Без назви";
  const year = movie.year || (movie.release_date ? movie.release_date.substring(0, 4) : null);

  /* --- джерело та постер ------------------------------------------- */
  let posterUrl = null;
  
  // Якщо це дані з TMDB
  if (isTmdb && movie.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  } 
  // Якщо це локальні дані
  else {
    const rawPoster = movie.posterUrl || movie.poster || movie.image || movie.poster_path;
    if (rawPoster) {
      posterUrl = /^https?:\/\//i.test(rawPoster)
        ? rawPoster
        : `${API}/${rawPoster.replace(/^\/?/, "")}`;
    }
  }

  const liked = favorites.has(movieId);

  /* --- жанри -------------------------------------------------------- */
  let genreNames = "";
  
  if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    genreNames = movie.genre_ids.map((id) => genres[id]).filter(Boolean).join(", ");
  } else if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    genreNames = movie.genres.join(", ");
  } else {
    genreNames = movie.genre || "Не вказано";
  }

  /* --- розміри картки ---------------------------------------------- */
  const cardClasses = [
    "relative rounded-[20px] overflow-hidden shadow-lg",
    "hover:shadow-white-2xl transition-shadow duration-300",
    "bg-white dark:bg-gray-800",
    fluid ? "w-full aspect-[2/3]" : "w-[300px] h-[450px]",
  ].join(" ");

  return (
    <div className={cardClasses}>
      {/* ---- постер або заглушка ---- */}
      <Link to={`/movie/${movieId}`}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-[300px] object-cover object-center"
            loading="lazy"
            onError={(e) => {
              console.error("Image failed to load:", posterUrl);
              e.target.onerror = null;
              e.target.src = ""; // Use a default image URL or leave empty
              e.target.parentElement.innerHTML = 
                '<div class="w-full h-[300px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs text-center">Немає<br />зображення</div>';
            }}
          />
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs text-center">
            Немає<br />зображення
          </div>
        )}
      </Link>

      {/* ---- зірочка ---- */}
      <button
        onClick={() => toggleFavorite(movie)}
        disabled={loading}
        className="absolute right-[20px] top-[20px] h-[32px] w-[32px] flex items-center justify-center backdrop-blur-[5.93px]"
        style={{
          borderRadius: "8.296px",
          border: "1px solid rgba(255,255,255,0.8)",
          background:
            "linear-gradient(99deg,#FFF 3.36%,rgba(255,255,255,0) 238.16%)",
        }}
        aria-label={liked ? "Прибрати з обраного" : "Додати до обраного"}
      >
        {liked ? <FilledHeartIcon /> : <EmptyHeartIcon />}
      </button>

      {/* ---- текст ---- */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-snug line-clamp-2">
          {title}
        </h3>

        {year && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-[2px]">
            {year}
          </p>
        )}

        <p className="text-gray-700 dark:text-gray-300 text-xs mb-1 line-clamp-1">
          {genreNames}
        </p>

        {movie.vote_average && (
          <p className="text-yellow-500 font-semibold">
            ★ {movie.vote_average}
          </p>
        )}
      </div>
    </div>
  );
}

export default MovieCard;