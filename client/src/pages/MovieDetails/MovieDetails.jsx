import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { FilledHeartIcon } from "../../components/icons/filled-heart-icon.component";
import { EmptyHeartIcon } from "../../components/icons/empty-heart-icon.component";
import { ACCESS_TOKEN } from "../../constants/token";
 
export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [liked, setLiked] = useState(false);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?language=uk-UA`, {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?language=uk-UA`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            }
          ),
        ]);

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();

        setMovie(movieData);
        setCredits(creditsData);
        setStatus("succeeded");
      } catch (error) {
        console.error("Помилка завантаження:", error);
        setStatus("failed");
      }
    };

    fetchMovieData();
  }, [id]);

  if (status === "loading")
    return <p className="ml-[290px] p-10">Завантаження...</p>;
  if (status === "failed" || !movie)
    return <p className="ml-[290px] p-10">Не вдалося завантажити дані.</p>;

  const director = credits?.crew.find((p) => p.job === "Director");
  const writer = credits?.crew.find((p) => p.job === "Screenplay");
  const topCast = credits?.cast?.slice(0, 5) || [];

  return (
    <div className="ml-[290px] p-10 text-gray-800 dark:text-gray-100 max-w-6xl transition-colors">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <img
          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          alt={movie.title}
          className="rounded-xl w-full max-w-[260px] shadow-md"
        />

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-[25px]">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <button
              onClick={() => setLiked((prev) => !prev)}
              className="w-[40px] h-[40px] flex items-center justify-center z-10"
              style={{
                borderRadius: "8.296px",
                border: "1px solid white",
                background:
                  "linear-gradient(99deg, #FFF 3.36%, rgba(255, 255, 255, 0) 238.16%)",
                padding: 0, 
                lineHeight: 0, 
              }}
            >
              {liked ? (
                <FilledHeartIcon size={24} />
              ) : (
                <EmptyHeartIcon size={24} />
              )}
            </button>
          </div>

          <p className="text-gray-500 dark:text-gray-400 italic">
            {movie.original_title}
          </p>

          <ul className="text-base space-y-1">
            <li>
              <strong>Дата релізу:</strong>{" "}
              {format(new Date(movie.release_date), "dd.MM.yyyy")}
            </li>
            <li>
              <strong>Рейтинг:</strong> ★ {movie.vote_average}
            </li>
            <li>
              <strong>Тривалість:</strong> {movie.runtime} хв
            </li>
            <li>
              <strong>Жанри:</strong>{" "}
              {movie.genres?.map((g) => g.name).join(", ")}
            </li>
            <li>
              <strong>Мова:</strong> {movie.original_language?.toUpperCase()}
            </li>
            <li>
              <strong>Країна:</strong>{" "}
              {movie.production_countries?.map((c) => c.name).join(", ")}
            </li>
            <li>
              <strong>Студія:</strong>{" "}
              {movie.production_companies?.map((c) => c.name).join(", ")}
            </li>
            <li>
              <strong>Режисер:</strong> {director?.name || "—"}
            </li>
            <li>
              <strong>Сценарист:</strong> {writer?.name || "—"}
            </li>
            <li>
              <strong>У ролях:</strong> {topCast.map((a) => a.name).join(", ")}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2">Опис</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
