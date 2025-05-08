import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";

// Базовий URL вашого бекенду
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Schedule() {
  const [movies, setMovies]   = useState([]);
  const [genresMap, setGenresMap] = useState({});
  const [status, setStatus]   = useState("idle");
  const [error, setError]     = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setStatus("failed");
      setError("Необхідна авторизація. Увійдіть в систему.");
      return;
    }

    const fetchAll = async () => {
      setStatus("loading");
      try {
        // паралельно беремо: TMDb (жанри + now_playing), локальні фільми + сесії
        const [
          resTmdbGenres,
          resTmdbNow,
          resFilms,
          resSessions
        ] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=uk`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=uk&page=1`
          ),
          fetch(`${API}/api/admin/films`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/api/admin/sessions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // перевіряємо помилки
        if (resFilms.status === 401 || resSessions.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!resFilms.ok || !resSessions.ok) {
          throw new Error("Не вдалося отримати локальні дані");
        }

        // парсимо відповіді
        const tmdbGenresData  = await resTmdbGenres.json();
        const tmdbNowData     = await resTmdbNow.json();
        const localFilms      = await resFilms.json();
        const sessionsData    = await resSessions.json();

        // генеруємо мапу жанрів з TMDb
        const gm = {};
        (tmdbGenresData.genres || []).forEach((g) => {
          gm[g.id] = g.name;
        });
        setGenresMap(gm);

        // Локальні фільми: пришиваємо справжні сеанси і афішу
        const localWithTimes = localFilms.map((film) => {
          const times = sessionsData
            .filter((s) => s.movieTitle === film.title)
            .map((s) => s.time);
          return {
            _id:       film._id,
            title:     film.title,
            year:      film.releaseYear,
            genres:    film.genres,
            times,
            posterUrl: film.posterPath
              ? `${API}${film.posterPath}`
              : "", // або якийсь placeholder
          };
        });

        // TMDb: найновіші 8 фільмів + випадкові часи
        const tmdbItems = (tmdbNowData.results || [])
          .sort(
            (a, b) =>
              new Date(b.release_date) - new Date(a.release_date)
          )
          .slice(0, 8)
          .map((m) => ({
            _id:       m.id,
            title:     m.title,
            year:      m.release_date?.split("-")[0],
            genres:    m.genre_ids.map((id) => gm[id]).filter(Boolean),
            times:     generateRandomTimes(),
            posterUrl: m.poster_path
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
              : "",
          }));

        // локальні зверху, TMDb — далі
        setMovies([...localWithTimes, ...tmdbItems]);
        setStatus("succeeded");
      } catch (e) {
        console.error(e);
        setStatus("failed");
        setError(
          e.message === "Unauthorized"
            ? "Термін дії сесії закінчився. Увійдіть знову."
            : e.message
        );
      }
    };

    fetchAll();
  }, []);

  // Хелпер для випадкових часів
  const generateRandomTimes = () => {
    const timesSet = new Set();
    const count = 2 + Math.floor(Math.random() * 4); // від 2 до 5
    while (timesSet.size < count) {
      const h = String(10 + Math.floor(Math.random() * 10)).padStart(2, "0");
      const m = Math.random() < 0.5 ? "00" : "30";
      timesSet.add(`${h}:${m}`);
    }
    return Array.from(timesSet);
  };

  if (status === "loading")
    return (
      <p className="text-center py-10 text-gray-500">Завантаження...</p>
    );
  if (status === "failed")
    return (
      <p className="text-center py-10 text-red-500">
        {error || "Не вдалося завантажити сеанси"}
      </p>
    );

  return (
    <div className="ml-[290px] py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Сеанси</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {movies.map((movie) => (
          <ScheduleCard
            key={movie._id}
            movie={movie}
            genres={genresMap}
          />
        ))}
      </div>
    </div>
  );
}
