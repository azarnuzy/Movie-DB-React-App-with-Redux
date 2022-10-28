import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiConfig from '../../api/apiConfig';
import { category as cate } from '../../api/tmdbApi';

const initialState = {
  search: [],
  status: 'idle',
  loadingStatus: 'idle',
  page: 1,
  total_pages: 0,
  error: null,
};

export const fetchMoviesByGenres = createAsyncThunk(
  'search/fetchMoviesByGenres',
  async (id) => {
    try {
      const params = { api_key: apiConfig.apiKey, with_genres: id };
      const response = await axios.get(`${apiConfig.baseUrl}/discover/movie`, {
        params,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(id);
      console.error(error);
    }
  }
);

export const loadMoreFetchMoviesByGenres = createAsyncThunk(
  'search/loadMoreFetchMovies',
  async (id, page) => {
    try {
      const params = {
        api_key: apiConfig.apiKey,
        with_genres: id,
        page: page + 1,
      };
      const response = await axios.get(`${apiConfig.baseUrl}/discover/movie`, {
        params,
      });
      console.log(page);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);

export const searchMoviesByInput = createAsyncThunk(
  'search/searchMoviesByInput',
  async (args) => {
    const { category, keyword } = args;
    console.log(args);
    try {
      const params = { api_key: apiConfig.apiKey, query: keyword };
      const response = await axios.get(
        `${apiConfig.baseUrl}search/${cate[category]}`,
        {
          params,
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const loadMoreSearchByInput = createAsyncThunk(
  'search/loadMoreSearchByInput',
  async (args) => {
    const { category, keyword, page } = args;
    try {
      const params = {
        api_key: apiConfig.apiKey,
        query: keyword,
        page: page + 1,
      };
      const response = await axios.get(
        `${apiConfig.baseUrl}search/${cate[category]}`,
        {
          params,
        }
      );
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMoviesByGenres.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMoviesByGenres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload);
        state.search = action.payload.results;
        state.total_pages = action.payload.total_pages;
        state.page = 1;
      })
      .addCase(fetchMoviesByGenres.rejected, (state, action) => {
        state.status = action.error.message;
      })
      .addCase(loadMoreFetchMoviesByGenres.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.search = [...state.search, ...action.payload.results];
        state.page += 1;
      })
      .addCase(searchMoviesByInput.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(searchMoviesByInput.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload);
        state.search = action.payload.results;
        state.total_pages = action.payload.total_pages;
        state.page = 1;
      })
      .addCase(searchMoviesByInput.rejected, (state, action) => {
        state.status = action.error.message;
      })
      .addCase(loadMoreSearchByInput.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.search = [...state.search, ...action.payload.results];
        state.page += 1;
      });
  },
});

export const selectAllMovies = (state) => state.search.search;
export const getMoviesStatus = (state) => state.search.status;
export const getMoviesError = (state) => state.search.error;

export const getLoadMoreStatus = (state) => state.search.loadingStatus;

export const getPage = (state) => state.search.page;
export const getTotalPages = (state) => state.search.total_pages;

export default searchSlice.reducer;
