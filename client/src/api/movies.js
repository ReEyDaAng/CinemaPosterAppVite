const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getLocalMovies(token) {
  const res = await fetch(`${API}/api/admin/films`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Cannot load local movies");
  return res.json();
}

export { getFavorites, addFavorite, removeFavorite } from "./favorites";
export { getGenres, getNowPlaying, getPopular }      from "./tmdb";
