import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="rounded overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800 dark:shadow-lg dark:hover:shadow-white-2xl dark:transition-shadow dark:duration-300">
      <img src={movie.poster} alt={movie.title} className="w-full h-72 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{movie.title}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">Жанр: {movie.genre}</p>
        <p className="text-yellow-500 font-semibold">★ {movie.rating}</p>
      </div>
    </Link>
  );
}

export default MovieCard;
