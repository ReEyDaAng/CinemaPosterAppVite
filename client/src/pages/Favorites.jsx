import React from "react";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites({ genres }) {
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();

  if (!user) {
    return (
      <p className="ml-[258px] mt-10 text-center">
        Спочатку потрібно увійти.
      </p>
    );
  }

  if (loading) {
    return <Loader className="ml-[258px]" />;
  }

  const list = Array.from(favorites.values()).filter(Boolean); // фільтруємо null/undefined

  if (list.length === 0) {
    return (
      <p className="ml-[258px] mt-10 text-center">
        У вас поки немає обраних фільмів.
      </p>
    );
  }

  return (
    <main className="ml-[258px] px-4 py-6">
  <h1 className="text-3xl font-bold mb-6">Мої обрані</h1>
  <div className="flex flex-wrap gap-6 justify-start">
  {list.map((fav) => {
    if (!fav || !fav.source) return null;

    const movie = fav.source === "tmdb" ? fav.data : fav.movie;
    return (
      <MovieCard
        key={fav._id}
        movie={movie}
        genres={genres}
      />
    );
  })}
</div>
</main>
  );
}
