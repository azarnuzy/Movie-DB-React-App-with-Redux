import React, { useEffect, useState } from 'react';
import apiConfig from '../api/apiConfig';
import tmdbApi, { movieType } from '../api/tmdbApi';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
// import required modules
import { EffectFade, Autoplay, Pagination } from 'swiper';
import { TrailerButton } from './Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMovies,
  getMoviesError,
  getMoviesStatus,
  selectAllMovies,
} from '../features/movies/moviesSlice';

export default function Slider() {
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
    movies = movies.slice(2, 5);
  }

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return `<span class="border-0 ${className}"></span>`;
    },
  };

  return (
    <div className="absolute top-0 left-0 w-full">
      <Swiper
        pagination={pagination}
        effect={'fade'}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper"
        modules={[EffectFade, Autoplay, Pagination]}
      >
        {movies.map((item, i) => {
          const background = apiConfig.originalImage(
            item.backdrop_path ? item.backdrop_path : item.poster_path
          );
          return (
            <SwiperSlide key={i}>
              <div className="w-full h-[100vh] relative">
                <div className="bg-[#0006] absolute w-full h-[100vh]"></div>
                <img
                  className="absolute w-full h-[100vh] object-top object-cover -z-[10] "
                  src={background}
                  alt=""
                />
                <div className="h-[100vh] transform translate-y-[40%] text-white mx-4 lg:max-w-5xl lg:mx-auto">
                  <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
                  <p className=" text-md mb-3">
                    {item.overview.length > 200
                      ? `${item.overview.substring(0, 200)}...`
                      : item.overview}
                  </p>
                  <TrailerButton item={item} />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
