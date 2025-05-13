import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import Banner from "./Banner";
import { useAuth } from "../../context/AuthContext";
import { getLocalMovies } from "../../api/movies";

export default function Home() {
  const { accessToken } = useAuth();
  const [localMovies, setLocalMovies] = useState([]);
  const [tmdbMovies,  setTmdbMovies]  = useState([]);
  const [genresMap,   setGenresMap]   = useState({});
  const [status,      setStatus]      = useState("idle");
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;   // TMDb key з .env

  useEffect(() => {
    if (!accessToken) return;
    const fetchAll = async () => {
      setStatus("loading");
      try {
        // 1) локальні фільми
        const local = await getLocalMovies(accessToken);
        setLocalMovies(local);
        // 2) TMDb: 2 сторінки popular + жанри
        const [r1, r2, rGenres] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=uk-UA&page=${page}`),
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=uk-UA&page=${page + 1}`),
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=uk-UA`)
        ]);
        if (!r1.ok || !r2.ok || !rGenres.ok) throw new Error("TMDb error");
        const tmdb1      = await r1.json();
        const tmdb2      = await r2.json();
        const genresData = await rGenres.json();
        setTotalPages(tmdb1.total_pages);
        // мапа жанрів
        const map = {};
        genresData.genres.forEach(g => (map[g.id] = g.name));
        setGenresMap(map);
        setTmdbMovies([...tmdb1.results, ...tmdb2.results]);
        setStatus("succeeded");
      } catch (err) {
        console.error("Home fetch error:", err);
        setStatus("failed");
      }
    };
    fetchAll();
  }, [accessToken, page, apiKey]);

  if (status === "loading") return <p>Завантаження…</p>;
  if (status === "failed")  return <p>Не вдалося завантажити фільми.</p>;

  // зливаємо локальні та TMDb
  const movies = [
    ...localMovies.map(m => ({
      ...m,
      id: m._id,
      genre_ids: m.genre_ids || [],
      vote_average: m.vote_average || 0
    })),
    ...tmdbMovies
  ];

  return (
    <div className="space-y-10 mt-[-56px]">
      {movies.length > 0 && <Banner movie={movies[0]} genres={genresMap} />}
      <div className="ml-[290px] flex flex-wrap gap-[24px]">
        {movies.slice(1, 21).map(movie => (
          <MovieCard key={movie.id} movie={movie} genres={genresMap} />
        ))}
      </div>
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