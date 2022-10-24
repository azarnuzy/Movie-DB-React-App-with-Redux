import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import MoviesList from './features/movies/MoviesList';
import GenresList from './features/genres/GenresList';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MoviesList />
      <GenresList />
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
