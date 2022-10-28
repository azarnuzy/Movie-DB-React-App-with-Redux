import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/movies/moviesSlice';
import genresReducer from '../features/genres/genresSlice';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    genres: genresReducer,
    search: searchReducer,
  },
});
