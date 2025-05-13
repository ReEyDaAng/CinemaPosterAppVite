import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import Banner    from "./Banner";

import { useAuth }        from "../../context/AuthContext";
import { getLocalMovies } from "../../api/movies";

export default function Home() {
  const { accessToken } = useAuth();

  const [localMovies, setLocalMovies] = useState([]);
  const [tmdbMovies,  setTmdbMovies]  = useState([]);
  const [genresMap,   setGenresMap]   = useState({});
  const [status,      setStatus]      = useState("idle");
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  // API-ключ TMDb із .env
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!accessToken) return; // чекаємо токен

    const fetchAll = async () => {
      setStatus("loading");
      try {
        // 1) Локальні фільми
        const local = await getLocalMovies(accessToken);
        setLocalMovies(local);

        // 2) TMDb — дві сторінки popular + жанри
        const [res1, res2, resGenres] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=uk-UA&page=${page}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=uk-UA&page=${page + 1}`
          ),
          fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=uk-UA`
          ),
        ]);

        if (!res1.ok || !res2.ok || !resGenres.ok) {
          throw new Error("Помилка при завантаженні даних TMDb");
        }

        const tmdb1      = await res1.json();
        const tmdb2      = await res2.json();
        const genresData = await resGenres.json();

        setTotalPages(tmdb1.total_pages);

        // 3) мапа жанрів: id → назва
        const map = {};
        genresData.genres.forEach((g) => (map[g.id] = g.name));
        setGenresMap(map);

        // 4) TMDb-результати
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

  // 5) зливаємо локальні та TMDb
  const movies = [
    ...localMovies.map((m) => ({
      ...m,
      id: m._id,
      genre_ids: m.genre_ids || [],
      vote_average: m.vote_average || 0,
    })),
    ...tmdbMovies,
  ];

  return (
    <div className="space-y-10 mt-[-56px]">
      {movies.length > 0 && <Banner movie={movies[0]} genres={genresMap} />}

      <div className="ml-[290px] flex flex-wrap gap-[24px]">
        {movies.slice(1, 21).map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genresMap} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-[20px] disabled:opacity-50"
        >
          ←
        </button>

        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-[20px] disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
