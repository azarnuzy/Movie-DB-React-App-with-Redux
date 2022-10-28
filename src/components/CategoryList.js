import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OutlineButton } from '../components/Button';
import MovieCard from '../components/MovieCard';
import PageHeader from '../components/PageHeader';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMoviesByGenres,
  getLoadMoreStatus,
  getMoviesError,
  getMoviesStatus,
  getPage,
  getTotalPages,
  loadMoreFetchMoviesByGenres,
  selectAllMovies,
} from '../features/search/searchSlice';
export default function CategoryList({ category }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  let movies = useSelector(selectAllMovies);
  const moviesStatus = useSelector(getMoviesStatus);
  const moviesError = useSelector(getMoviesError);

  const loadMoreStatus = useSelector(getLoadMoreStatus);
  const page = useSelector(getPage);
  const totalPage = useSelector(getTotalPages);

  console.log(moviesStatus);

  useEffect(() => {
    dispatch(fetchMoviesByGenres(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const onLoadMoreClicked = () => {
    dispatch(loadMoreFetchMoviesByGenres(id, page));
  };

  return (
    <>
      <PageHeader>{category === 'movie' ? 'Movies' : 'Tv'} Category</PageHeader>
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-10">
        {movies.map((item, i) => (
          <MovieCard
            category={category}
            item={item}
            mediaType={item.media_type}
            key={i}
            page="popularPage"
          />
        ))}
      </div>
      {page < totalPage ? (
        <OutlineButton
          onClick={onLoadMoreClicked}
          className="py-1 px-4 font-semibold flex justify-center mx-auto mt-4 text-lg text-lightRed border-solid border-lightRed border w-fit rounded-full relative"
        >
          <div
            class={`flex items-center  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  justify-center space-x-2 ${
              moviesStatus === 'loading' ? '' : 'hidden'
            }`}
          >
            <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
            <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
            <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
          </div>
          Load More
        </OutlineButton>
      ) : null}
    </>
  );
}
