import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import apiConfig from '../api/apiConfig';

import tmdbApi, { category as cate, movieType, tvType } from '../api/tmdbApi';
import {
  fetchMovies,
  getMoviesError,
  getMoviesStatus,
  selectAllMovies,
} from '../features/movies/moviesSlice';
import { OutlineButton } from './Button';
import MovieCard from './MovieCard';

export default function MovieGrid({ category }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const { keyword } = useParams();

  const location = useLocation();
  let search = '';
  if (location.state !== null) {
    search = location.state.search;
  }

  const dispatch = useDispatch();

  let movies = useSelector(selectAllMovies);
  const moviesStatus = useSelector(getMoviesStatus);
  const moviesError = useSelector(getMoviesError);

  useEffect(() => {
    if (moviesStatus === 'idle') {
      dispatch(fetchMovies());
    }
  }, [moviesStatus, dispatch]);

  if (moviesStatus === 'succeeded') {
    movies = movies.docs;
  }

  const loadMore = async () => {
    let response = null;
    if (keyword === undefined) {
      const params = { api_key: apiConfig.apiKey, page: page + 1 };
      switch (category) {
        case cate.movie:
          response = await tmdbApi.getMoviesList(movieType.popular, { params });
          break;
        default:
          response = await tmdbApi.getTvList(tvType.popular, { params });
      }
    } else {
      const params = {
        api_key: apiConfig.apiKey,
        page: page + 1,
        query: keyword,
      };
      response = await tmdbApi.search(category, { params });
    }
    setItems([...items, ...response.results]);
    setPage(page + 1);
  };

  return (
    <>
      {search !== null && search.length > 0 && (
        <h3 className="text-center font-bold text-lg -mt-2 -mb-4">
          Search Result "{search}"
        </h3>
      )}

      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-10">
        {movies.map((item, i) => (
          <MovieCard category={category} item={item} key={i} />
        ))}
      </div>
      {page < totalPage ? (
        <OutlineButton
          onClick={loadMore}
          className="py-1 px-4 font-semibold flex justify-center mx-auto mt-4 text-lg text-lightRed border-solid border-lightRed border w-fit rounded-full"
        >
          Load More
        </OutlineButton>
      ) : null}
    </>
  );
}
