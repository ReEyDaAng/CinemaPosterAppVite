import React, { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import Banner from "./Banner";
import { ACCESS_TOKEN } from "../../constants/token";

function Home() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle");
  const [genres, setGenres] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      try {
        const [moviesRes1, moviesRes2, genresRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=${page}`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            }
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=${
              page + 1
            }`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            }
          ),
          fetch("https://api.themoviedb.org/3/genre/movie/list?language=uk", {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }),
        ]);

        const moviesData1 = await moviesRes1.json();
        const moviesData2 = await moviesRes2.json();
        const genresData = await genresRes.json();

        const allMovies = [...moviesData1.results, ...moviesData2.results];
        const genresMap = {};
        genresData.genres.forEach((genre) => {
          genresMap[genre.id] = genre.name;
        });

        setMovies(allMovies);
        setGenres(genresMap);
        setTotalPages(moviesData1.total_pages);
        setStatus("succeeded");
      } catch (error) {
        console.error("Помилка завантаження:", error);
        setStatus("failed");
      }
    };

    fetchData();
  }, [page]);

  if (status === "loading") return <p>Завантаження...</p>;
  if (status === "failed") return <p>Помилка завантаження</p>;

  return (
    <div className="space-y-10 mt-[-56px]">
      <Banner movie={movies[0]} />

      <div className="ml-[290px] flex flex-wrap gap-[24px]">
        {movies.slice(1, 21).map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genres} />
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

export default Home;
