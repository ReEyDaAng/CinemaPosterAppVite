const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getFavorites(accessToken) {
  const res = await fetch(`${API}/api/favorites`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Cannot fetch favorites');
  return res.json();
}

export async function addFavorite(payload, accessToken) {
  const res = await fetch(`${API}/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 204) return null;

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cannot add favorite: ${errorText}`);
  }

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn('Response is not valid JSON:', text);
    return null;
  }
}

export async function removeFavorite(id, accessToken) {
  const res = await fetch(`${API}/api/favorites/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (res.status === 204) return;
  if (!res.ok) throw new Error('Cannot delete favorite');

  try {
    return res.json();
  } catch (err) {
    return null;
  }
}