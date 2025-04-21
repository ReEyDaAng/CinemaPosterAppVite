import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: [],
  reducers: {
    addFavorite: (state, action) => { /*…*/ },
    removeFavorite: (state, action) => { /*…*/ },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
// Ось ця лінія — додає default‑експорт
export default favoritesSlice.reducer;
