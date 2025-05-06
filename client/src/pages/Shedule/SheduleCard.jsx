import React from "react";

export default function SheduleCard({ movie, genres }) {
  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 max-w-3xl w-full gap-6">
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="w-[120px] h-auto rounded object-cover"
      />
      <div className="flex flex-col justify-start gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{movie.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {movie.release_date} | {movie.genre_ids?.map((id) => genres[id]).join(", ")}
          </p>
        </div>
        
        {/* Піднімаємо вище */}
        <div className="flex flex-wrap gap-2 mt-[30px]">
          {movie.times.map((time, idx) => (
            <span
              key={idx}
              className="bg-red-600 text-white text-sm px-3 py-1 rounded-full"
            >
              {time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
