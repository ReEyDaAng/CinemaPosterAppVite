const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getFavorites(authFetch) {
  const res = await authFetch(`${API}/api/favorites`);
  if (!res.ok) throw new Error('Не вдалося завантажити обрані');
  return res.json();
}

export async function addFavorite(payload, authFetch) {
  const res = await authFetch(`${API}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Не вдалося додати в обране');
  return res.json();     // або 200 без тіла, якщо вже було
}

export async function removeFavorite(id, authFetch) {
  const res = await authFetch(`${API}/api/favorites/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Не вдалося видалити з обраного');
}
