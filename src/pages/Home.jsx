import MovieCard from '../components/MovieCard';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../features/movies/moviesSlice';
import { Link } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies.list);
  const status = useSelector(state => state.movies.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>Завантаження...</p>;
  if (status === 'failed') return <p>Помилка завантаження</p>;

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {movies.map(movie => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </div>
);
}

export default Home;