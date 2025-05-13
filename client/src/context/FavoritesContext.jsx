import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

// утиліта, щоб із movie взяти payload
const buildPayload = (movie) => {
  const isTmdb = movie.tmdb_id || typeof movie.id === 'number';

  return isTmdb
    ? {
      source: 'tmdb',
      movieId: Number(movie.tmdb_id ?? movie.id),
      data: movie,
    }
    : {
      source: 'local',
      movieId: movie._id,          // ObjectId
    };
};
export function FavoritesProvider({ children }) {
  const { authFetch, user } = useAuth();

  const [favorites, setFavorites] = useState(new Map()); // Map<movieId, favDoc>
  const [loading,   setLoading]   = useState(false);

  /* --- початкове завантаження -------------------------------------- */
  useEffect(() => {
    if (!user) { setFavorites(new Map()); return; }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await (await authFetch('/api/favorites')).json();
        if (cancelled) return;
        const map = new Map(list.map((f) => {
          const id = f.source === 'tmdb' ? f.tmdbId : f.movie;
          return [id, f];
        }));
        setFavorites(map);
      } catch (e) { console.error(e); }
      finally      { setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [user, authFetch]);

  /* --- toggle ------------------------------------------------------- */
  const toggleFavorite = async (movie) => {
    // movie може бути об’єктом або id
    const payload = typeof movie === 'object' ? buildPayload(movie) : null;
    const movieId =
      typeof movie === 'object'
        ? payload.movieId
        : movie;                    // якщо передали id

    if (loading || !user) return;   // блокуємо повторні кліки

    if (favorites.has(movieId)) {
      // видаляємо
      setLoading(true);
      try {
        const favDoc = favorites.get(movieId);
        await authFetch(`/api/favorites/${favDoc._id}`, { method: 'DELETE' });
        const newMap = new Map(favorites);
        newMap.delete(movieId);
        setFavorites(newMap);
      } catch (e) { console.error(e); }
      finally      { setLoading(false); }
    } else if (payload) {
      // додаємо
      setLoading(true);
      try {
        const res  = await authFetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const favDoc = await res.json(); // { _id, source,… }
        setFavorites(new Map(favorites).set(movieId, favDoc));
      } catch (e) { console.error(e); }
      finally      { setLoading(false); }
    }
  };

  const value = {
    favorites,
    loading,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
