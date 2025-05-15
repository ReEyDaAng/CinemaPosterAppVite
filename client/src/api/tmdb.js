const TMDB_BASE = "https://api.themoviedb.org/3";

/**
 * Робить запит до TMDb із переданим токеном.
 * @param {string} path — маршрут після /3, наприклад "/movie/popular"
 * @param {string} token — ваш JWT accessToken з AuthContext
 * @param {number} [page] — якщо потрібно пагінацію
 */
async function fetchTMDB(path, token, page) {
  const url =
    `${TMDB_BASE}${path}` +
    (page ? `?page=${page}&language=uk-UA` : `?language=uk-UA`);
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`TMDb fetch failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

/**
 * Повертає мапу жанрів.
 * @param {string} token
 */
export function getGenres(token) {
  return fetchTMDB("/genre/movie/list", token);
}

/**
 * Повертає now_playing.
 * @param {string} token
 * @param {number} page
 */
export function getNowPlaying(token, page = 1) {
  return fetchTMDB("/movie/now_playing", token, page);
}

/**
 * Повертає popular.
 * @param {string} token
 * @param {number} page
 */
export function getPopular(token, page = 1) {
  return fetchTMDB("/movie/popular", token, page);
}
