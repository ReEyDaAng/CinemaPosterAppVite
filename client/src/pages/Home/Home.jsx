import React, { useEffect, useState } from 'react';
import MovieCard from "../../components/MovieCard";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Y2ZhNWE3MWEwM2NhOTlkMzFmNmIxNDhkOGY0MWEzMSIsIm5iZiI6MTc0NTkyNDk4NS44NDUsInN1YiI6IjY4MTBiMzc5MjEzN2YzNGMyNGVhYmY5OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d6FLpDgj77XHTKhXD3tawH4UU09WOiw9_aWXdYk2vEg'; // скорочено для прикладу

function Home() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('idle');
  const [genres, setGenres] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('loading');
      try {
        const [moviesRes1, moviesRes2, genresRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=${page}`, {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }),
          fetch(`https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=${page + 1}`, {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }),
          fetch('https://api.themoviedb.org/3/genre/movie/list?language=uk', {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }),
        ]);

        const moviesData1 = await moviesRes1.json();
        const moviesData2 = await moviesRes2.json();
        const genresData = await genresRes.json();

        const allMovies = [...moviesData1.results, ...moviesData2.results];
        const genresMap = {};
        genresData.genres.forEach(genre => {
          genresMap[genre.id] = genre.name;
        });

        setMovies(allMovies);
        setGenres(genresMap);
        setTotalPages(moviesData1.total_pages); // тільки для пагінації
        setStatus('succeeded');
      } catch (error) {
        console.error('Помилка завантаження:', error);
        setStatus('failed');
      }
    };

    fetchData();
  }, [page]);

  if (status === 'loading') return <p>Завантаження...</p>;
  if (status === 'failed') return <p>Помилка завантаження</p>;

  return (
    <div className="space-y-10 mt-[-56px]">
      {/* 🎬 Банер */}
      {movies.length > 0 && (
        <div
          className="relative h-[455px] overflow-hidden ml-[258px] mr-[-1rem]"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-10 pb-[53px] flex flex-col justify-end text-white">
            <h2 className="text-4xl font-bold mb-2">{movies[0].title}</h2>
            <p className="text-lg mb-4">
              {movies[0].release_date} | ★ {movies[0].vote_average}
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-[14px] h-[54px] w-[139px] w-fit">
              Watch now
            </button>
          </div>
        </div>
      )}

      {/* 🎞️ Картки фільмів */}
      <div className="ml-[290px] flex flex-wrap gap-[24px]">
        {movies.slice(1, 21).map(movie => (
          <MovieCard key={movie.id} movie={movie} genres={genres} />
        ))}
      </div>

      {/* 🔄 Пагінація */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-[20px] disabled:opacity-50"
        >
          ←
        </button>

        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-[20px] disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default Home;