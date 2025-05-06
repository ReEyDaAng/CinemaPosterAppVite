import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0Y2ZhNWE3MWEwM2NhOTlkMzFmNmIxNDhkOGY0MWEzMSIsIm5iZiI6MTc0NTkyNDk4NS44NDUsInN1YiI6IjY4MTBiMzc5MjEzN2YzNGMyNGVhYmY5OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d6FLpDgj77XHTKhXD3tawH4UU09WOiw9_aWXdYk2vEg'; // скорочено для прикладу

export default function Schedule() {
    const [movies, setMovies] = useState([]);
    const [status, setStatus] = useState("idle");
    const [genres, setGenres] = useState({});
  
    useEffect(() => {
      const fetchMovies = async () => {
        setStatus("loading");
        try {
          const [resMovies, resGenres] = await Promise.all([
            fetch("https://api.themoviedb.org/3/movie/now_playing?language=uk-UA&page=1", {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            })
            ,
            fetch("https://api.themoviedb.org/3/genre/movie/list?language=uk", {
              headers: {
                accept: "application/json",
                Authorization: ACCESS_TOKEN,
              },
            }),
          ]);
  
          const dataMovies = await resMovies.json();
          const dataGenres = await resGenres.json();
  
          const genresMap = {};
          dataGenres.genres.forEach((g) => (genresMap[g.id] = g.name));
  
          const latest7 = dataMovies.results
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
            .slice(0, 8)
            .map((movie) => ({
              ...movie,
              times: generateRandomTimes(),
            }));
  
          setMovies(latest7);
          setGenres(genresMap);
          setStatus("succeeded");
        } catch (e) {
          console.error("Помилка завантаження:", e);
          setStatus("failed");
        }
      };
  
      fetchMovies();
    }, []);
  
    const generateRandomTimes = () => {
      const times = [];
      const count = Math.floor(Math.random() * 4) + 2; 
      for (let i = 0; i < count; i++) {
        const hour = String(10 + Math.floor(Math.random() * 10)).padStart(2, "0");
        const minute = String(Math.floor(Math.random() * 2) * 30).padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
      return [...new Set(times)];
    };
  
    if (status === "loading") return <p>Завантаження...</p>;
    if (status === "failed") return <p>Помилка завантаження</p>;
  
    return (
        <div className="ml-[290px] py-10 px-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Сеанси</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {movies.map((movie) => (
              <ScheduleCard key={movie.id} movie={movie} genres={genres} />
            ))}
          </div>
        </div>
      );
      
  }