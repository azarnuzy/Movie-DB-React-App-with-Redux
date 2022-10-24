import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiConfig from '../../api/apiConfig';

const initialState = {
  genres: [],
  status: 'idle',
  error: null,
};

export const fetchGenres = createAsyncThunk('genres/fetchGenres', async () => {
  try {
    const response = await axios.get(`${apiConfig.baseUrl}/movies/genres`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGenres.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genres = action.payload.data;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAllGenres = (state) => {
  console.log(state);
  //   return state.genres.genres;
};
export const getGenresStatus = (state) => state.genres.status;
export const getGenresError = (state) => state.genres.error;

export default genresSlice.reducer;
