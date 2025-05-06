import React, { useState } from "react";
import { FilledHeartIcon } from "../../components/icons/filled-heart-icon.component";
import { EmptyHeartIcon } from "../../components/icons/empty-heart-icon.component";
import { format } from "date-fns";

export default function Banner({ movie }) {
  const [liked, setLiked] = useState(false);

  if (!movie) return null;

  return (
    <div
      className="relative h-[455px] overflow-hidden ml-[258px] mr-[-1rem]"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-10 pb-[53px] flex flex-col justify-end text-white">
        <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>

        <div className="flex text-lg items-center mb-4 gap-[10px]">
          <p>
            {format(new Date(movie.release_date), "dd.MM.yyyy")}
          </p>
          <span>| </span>
          <p className="text-yellow-500 font-semibold">
            ★ {movie.vote_average}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-[14px] h-[54px] w-[180px] whitespace-nowrap text-white text-[16px] font-semibold transition">
            Дивитись зараз
          </button>
          <button
            onClick={() => setLiked((prev) => !prev)}
            className="w-[54px] h-[54px] backdrop-blur-[5.93px] flex items-center justify-center"
            style={{
              borderRadius: "8.296px",
              border: "0.593px solid white",
              background:
                "linear-gradient(99deg, #FFF 3.36%, rgba(255, 255, 255, 0) 238.16%)",
            }}
          >
            {liked ? (
              <FilledHeartIcon size={24} />
            ) : (
              <EmptyHeartIcon size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
