import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MovieDetails() {
  const { id } = useParams();
  const movie = useSelector(state => state.movies.list.find(m => m.id.toString() === id));

  if (!movie) return <p>Фільм не знайдено</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <img src={movie.poster} alt={movie.title} className="w-full h-96 object-cover mb-4" />
      <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
      <p className="mb-2">Жанр: {movie.genre}</p>
      <p className="mb-2">Рік: {movie.year}</p>
      <p className="mb-2">Рейтинг: {movie.rating}</p>
      <p className="mb-2">Опис: {movie.description}</p>
      <iframe
        className="w-full h-64 mt-4"
        src={movie.trailer}
        title="трейлер"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default MovieDetails;