import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import apiConfig from '../api/apiConfig';

import tmdbApi, { category as cate, movieType, tvType } from '../api/tmdbApi';
import {
  fetchMovies,
  getLoadMoreStatus,
  getMoviesError,
  getMoviesStatus,
  getPage,
  getTotalPages,
  loadMoreFetchMovies,
  selectAllMovies,
} from '../features/movies/moviesSlice';
import { OutlineButton } from './Button';
import MovieCard from './MovieCard';

export default function MovieGrid({ category }) {
  const dispatch = useDispatch();
  let { keyword } = useParams();

  let movies = useSelector(selectAllMovies);
  const moviesStatus = useSelector(getMoviesStatus);
  const moviesError = useSelector(getMoviesError);

  const loadMoreStatus = useSelector(getLoadMoreStatus);
  const page = useSelector(getPage);
  const totalPage = useSelector(getTotalPages);

  useEffect(() => {
    if (moviesStatus === 'idle') {
      dispatch(fetchMovies());
    }
  }, [moviesStatus, dispatch]);

  if (keyword !== undefined) {
    dispatch(fetchMovies(keyword));
    keyword = undefined;
  }

  const onLoadMoreClicked = () => {
    if (loadMoreStatus === 'idle') {
      dispatch(loadMoreFetchMovies(page));
    }
  };

  const location = useLocation();
  let search = '';
  if (location.state !== null) {
    search = location.state.search;
  }

  return (
    <>
      {search !== null && search.length > 0 && (
        <h3 className="text-center font-bold text-lg -mt-2 -mb-4">
          Search Result "{search}"
        </h3>
      )}

      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-10">
        {movies.map((item, i) => (
          <MovieCard
            category={category}
            item={item}
            key={i}
            mediaType={item.media_type}
          />
        ))}
      </div>
      {page < totalPage ? (
        <OutlineButton
          onClick={onLoadMoreClicked}
          className="py-1 px-4 font-semibold flex justify-center mx-auto mt-4 text-lg text-lightRed border-solid border-lightRed border w-fit rounded-full"
        >
          Load More
        </OutlineButton>
      ) : null}
    </>
  );
}
