import React from "react";
import { useNavigate } from "react-router-dom";

export default function ScheduleCard({ movie }) {
  const navigate = useNavigate();

  const handleTimeClick = ({ sessionId, time }) => {
    navigate(`/seats/${sessionId}/${time}`, {
      state: {
        poster: movie.posterUrl,
        title:  movie.title,
        date:   new Date().toISOString().split("T")[0],
      },
    });
  };

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 max-w-3xl w-full gap-6">
      {/* Постер або заглушка */}
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-[120px] h-auto rounded object-cover"
        />
      ) : (
        <div className="w-[120px] h-[180px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-center">
          Немає<br/>зображення
        </div>
      )}

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {movie.title}
          </h3>
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

        <div className="flex flex-wrap gap-2 mt-4">
          {Array.isArray(movie.times) && movie.times.length > 0 ? (
            movie.times.map(slot => (
              <button
                key={`${slot.sessionId}-${slot.time}`}
                onClick={() => handleTimeClick(slot)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded-full hover:bg-red-500 focus:outline-none"
              >
                {slot.time}
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
