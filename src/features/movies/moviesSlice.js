import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiConfig from '../../api/apiConfig';

const initialState = {
  movies: [],
  status: 'idle',
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  try {
    const response = await axios.get(`${apiConfig.baseUrl}/movies`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const loadMoreFetchMovies = createAsyncThunk(
  'movies/loadMoreFetchMovies',
  async (page) => {
    try {
      const response = await axios.get(`${apiConfig.baseUrl}/movies`, {
        page: page + 1,
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMovies.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // console.log(action.payload.data);
        state.movies = action.payload.data;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadMoreFetchMovies.pending, (state, action) => {
        state.status = 'loading-loadMore';
      })
      .addCase(loadMoreFetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded-loadMore';
        state.movies.push(action.payload.data);
      })
      .addCase(loadMoreFetchMovies.rejected, (state, action) => {
        state.status = action.error.message;
      });
  },
});

export const selectAllMovies = (state) => state.movies.movies;
export const getMoviesStatus = (state) => state.movies.status;
export const getMoviesError = (state) => state.movies.error;

export const getLoadMoreMovies = (state) => state.movies;

export default moviesSlice.reducer;
