import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants/token";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 1) {
        fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}&language=uk-UA&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => setResults(data.results || []))
          .catch((err) => console.error("Помилка пошуку:", err));
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectMovie = (id) => {
    navigate(`/movie/${id}`);
    setQuery("");
    setOpen(false);
  };

  const handleIconClick = () => {
    setOpen((prev) => !prev);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={handleIconClick}
        className="p-2 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <Search className="text-black dark:text-white" />
      </button>

      {open && (
        <div className="relative transition-all">
          <input
            ref={inputRef}
            type="text"
            placeholder="Пошук..."
            className="w-[250px] px-4 py-2 rounded-[12px] text-black dark:text-white bg-white dark:bg-[#1f2937] placeholder-gray-400 dark:placeholder-gray-400 outline-none shadow-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {results.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#111827] rounded-[12px] shadow-lg z-10 max-h-[300px] overflow-auto border border-gray-300 dark:border-gray-700">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie.id)}
                  className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-800"
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {movie.title}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-400">
                    {movie.release_date?.slice(0, 4)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
