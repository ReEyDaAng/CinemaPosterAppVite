import React from "react";
import { useNavigate } from "react-router-dom";

export default function ScheduleCard({ movie }) {
  const navigate = useNavigate();

  const handleTimeClick = (time) => {
    navigate(`/seats/${movie.id}/${time}`, {
      state: {
        // передаємо в стейт актуальні поля
        poster: movie.posterUrl,
        title: movie.title,
        date: movie.date || new Date().toISOString().split("T")[0], 
      },
    });
  };

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 max-w-3xl w-full gap-6">
      {/* Постер */}
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-[120px] h-auto rounded object-cover"
        />
      ) : (
        <div className="w-[120px] h-[180px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
          Немає<br/>зображення
        </div>
      )}

      <div className="flex flex-col justify-between flex-1">
        <div>
          {/* Назва */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {movie.title}
          </h3>
          {/* Рік та жанри */}
          {movie.year && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Рік: {movie.year}
            </p>
          )}
          {Array.isArray(movie.genres) && movie.genres.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Жанри: {movie.genres.join(", ")}
            </p>
          )}
        </div>

        {/* Часи сеансів */}
        <div className="flex flex-wrap gap-2 mt-4">
          {movie.times && movie.times.length > 0 ? (
            movie.times.map((t) => (
              <button
                key={t}
                onClick={() => handleTimeClick(t)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded-full hover:bg-red-500 focus:outline-none"
              >
                {t}
              </button>
            ))
          ) : (
            <span className="text-gray-500">Часів немає</span>
          )}
        </div>
      </div>
    </div>
  );
}
