import { useWindowWidth } from '@react-hook/window-size';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  fetchMovies,
  getMoviesError,
  getMoviesStatus,
  selectAllMovies,
} from './moviesSlice';
import { Link } from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Autoplay } from 'swiper';
// Import Swiper styles
import 'swiper/css';

const MoviesList = () => {
  const dispatch = useDispatch();

  const movies = useSelector(selectAllMovies);
  const moviesStatus = useSelector(getMoviesStatus);
  const moviesError = useSelector(getMoviesError);

  const width = useWindowWidth();

  useEffect(() => {
    if (moviesStatus === 'idle') {
      dispatch(fetchMovies());
    }
  }, [moviesStatus, dispatch]);

  const getSlidesPerView = () => {
    if (width >= 1280) {
      return 6;
    } else if (width >= 1024) {
      return 5;
    } else if (width >= 768) {
      return 4;
    } else {
      return 3;
    }
  };

  if (moviesStatus === 'suceeded') {
    console.log(movies);
  }
  return;
};

export default MoviesList;
