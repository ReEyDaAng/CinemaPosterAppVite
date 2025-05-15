import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavorites, addFavorite, removeFavorite } from '../../services/favoriteService';

// authFetch передаємо аргументом при dispatch
export const fetchFavs = createAsyncThunk(
  'favorites/fetch',
  async (authFetch) => getFavorites(authFetch)
);

export const addToFavs = createAsyncThunk(
  'favorites/add',
  async ({ payload, authFetch }) => addFavorite(payload, authFetch)
);

export const delFromFavs = createAsyncThunk(
  'favorites/remove',
  async ({ id, authFetch }) => {
    await removeFavorite(id, authFetch);
    return id;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFavs.fulfilled,  (s, a) => { s.list = a.payload; s.status='succeeded'; })
      .addCase(addToFavs.fulfilled,  (s, a) => { if (a.payload?._id) s.list.push(a.payload); })
      .addCase(delFromFavs.fulfilled,(s,a) => { s.list = s.list.filter(f => f._id !== a.payload); });
  },
});

export default favoritesSlice.reducer;
