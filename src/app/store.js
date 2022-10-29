import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/movies/moviesSlice';
import genresReducer from '../features/genres/genresSlice';
import searchReducer from '../features/search/searchSlice';
import detailReducer from '../features/detail/detailSlice';
import loginReducer from '../features/login/loginSlice';
import registerReducer from '../features/register/registerSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    genres: genresReducer,
    search: searchReducer,
    detail: detailReducer,
    login: loginReducer,
    register: registerReducer,
  },
});
