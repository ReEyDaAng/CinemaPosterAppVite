import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites';

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }) {
  const { accessToken } = useAuth();
  const [favorites, setFavorites] = useState(new Map());
  const [loading, setLoading] = useState(false);

  const getFavoriteKey = (movie, isTmdb) => {
    const movieId = isTmdb ? (movie.tmdb_id || movie.id) : (movie._id || movie.id);
    return isTmdb ? `tmdb-${movieId}` : `local-${movieId}`;
  };

  const refreshFavorites = useCallback(async () => {
    if (!accessToken) return;

    try {
      const list = await getFavorites(accessToken);
      if (!Array.isArray(list)) return;

      const map = new Map(
        list
          .map((f) => {
            if ((f.source === 'tmdb' && !f.tmdbId) || (f.source === 'local' && !f.movie?._id)) {
              console.warn('Invalid favorite entry skipped:', f);
              return null;
            }
            const key = f.source === 'tmdb' ? `tmdb-${f.tmdbId}` : `local-${f.movie._id}`;
            return [key, f];
          })
          .filter(Boolean)
      );

      setFavorites(map);
    } catch (err) {
      console.error('Failed to refresh favorites:', err);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      setFavorites(new Map());
      return;
    }

    (async () => {
      setLoading(true);
      try {
        await refreshFavorites();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, refreshFavorites]);

  const toggleFavorite = useCallback(
    async (movie, isTmdb) => {
      if (!accessToken || !movie) return;

      setLoading(true);
      try {
        const movieId = isTmdb ? movie.tmdb_id || movie.id : movie._id || movie.id;
        if (!movieId) {
          console.warn('Cannot toggle favorite: missing movie ID');
          return;
        }

        const favKey = getFavoriteKey(movie, isTmdb);
        const next = new Map(favorites);

        if (favorites.has(favKey)) {
          const favDoc = favorites.get(favKey);
          const id = favDoc?._id || favDoc?.id;
          if (!id) {
            console.warn('Cannot remove favorite: missing _id');
            return;
          }

          try {
            await removeFavorite(id, accessToken);
            next.delete(favKey);
            setFavorites(next);
          } catch (err) {
            console.error(err);
          }
          return;
        }

        const payload = isTmdb
          ? { source: 'tmdb', movieId, data: movie }
          : { source: 'local', movieId, data: movie }; 


        console.log('[ADD PAYLOAD]', payload);

        const saved = await addFavorite(payload, accessToken);

        if (!saved || typeof saved !== 'object') {
          console.warn('Invalid favorite response. Refreshing list...');
          await refreshFavorites();
          return;
        }

        if (payload.source === 'local' && (!saved.movie || !saved.movie._id)) {
          console.warn('Invalid local favorite structure. Refreshing list...');
          await refreshFavorites();
          return;
        }

        const enriched = payload.source === 'tmdb'
          ? saved
          : { ...saved, movie: saved.movie, _id: saved._id };

        next.set(favKey, enriched);
        setFavorites(next);
      } catch (err) {
        console.error('toggleFavorite error:', err);
        await refreshFavorites();
      } finally {
        setLoading(false);
      }
    },
    [favorites, accessToken, refreshFavorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite, getFavoriteKey }}>
      {children}
    </FavoritesContext.Provider>
  );
}
