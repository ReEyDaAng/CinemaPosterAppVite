import React from "react";
import { Link } from "react-router-dom";
import { EmptyHeartIcon } from "./icons/empty-heart-icon.component";

function MovieCard({ movie, genres }) {
  const genreNames = movie.genre_ids
    .map((id) => genres[id])
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="rounded-[20px] w-[300px] h-[450px] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800 dark:shadow-lg dark:hover:shadow-white-2xl"
    >
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[300px] object-cover object-center"
        />
        <div
          className="border absolute right-[20px] top-[20px] border-white h-[32px] w-[32px] backdrop-blur-[5.93px] flex items-center justify-center"
          style={{
            borderRadius: "8.296px",
            borderWidth: "0.593px",
            background:
              "linear-gradient(99deg, #FFF 3.36%, rgba(255, 255, 255, 0) 238.16%)",
          }}
        >
          <EmptyHeartIcon />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {movie.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
          {genreNames || "Не вказано"}
        </p>
        <p className="text-yellow-500 font-semibold">★ {movie.vote_average}</p>
      </div>
    </Link>
  );
}

export default MovieCard;
