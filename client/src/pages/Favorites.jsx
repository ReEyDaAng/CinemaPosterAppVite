import React from "react";
import MovieCard     from "../components/MovieCard";
import Loader        from "../components/Loader";
import { useAuth }   from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();

  if (!user)
    return (
      <p className="ml-[258px] mt-10 text-center">
        Спочатку потрібно увійти.
      </p>
    );

  if (loading) return <Loader className="ml-[258px]" />;

  const list = Array.from(favorites.values());

  if (list.length === 0)
    return (
      <p className="ml-[258px] mt-10 text-center">
        У вас поки немає обраних фільмів.
      </p>
    );

  return (
    <main className="ml-[258px] px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Мої обрані</h1>

      <div
        className="grid gap-6
                   [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]"
      >
        {list.map((fav) => (
          <MovieCard
            key={fav._id}
            movie={fav.data ?? fav.movie}
            genres={{}}      /* локал → genres уже рядок; tmdb → є в data */
            fluid            /* ← «ґумова» */
          />
        ))}
      </div>
    </main>
  );
}
