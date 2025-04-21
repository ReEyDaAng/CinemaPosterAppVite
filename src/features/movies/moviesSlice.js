import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get('/data/movies.json');
  return response.data;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchMovies.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default moviesSlice.reducer;