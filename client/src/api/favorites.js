// src/api/favorites.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getFavorites() {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API}/api/favorites`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  // якщо статус 401–403 — показати помилку
  if (res.status === 401) throw new Error('Unauthorized');
  return res.json();  
}

export async function addFavorite(movieId) {
  const res = await fetch(`${API}/api/favorites/${movieId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return res.json();
}

export async function removeFavorite(movieId) {
  const res = await fetch(`${API}/api/favorites/${movieId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return res.json();
}
