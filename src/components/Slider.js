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
    movies = movies.docs.slice(2, 5);
  }

  const [movieItems, setMovieItems] = useState([]);
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return `<span class="border-0 ${className}"></span>`;
    },
  };

  // useEffect(() => {
  //   const getMovies = async () => {
  //     const params = { api_key: apiConfig.apiKey, page: 1 };
  //     try {
  //       const response = await tmdbApi.getMoviesList(movieType.popular, {
  //         params,
  //       });
  //       setMovieItems(response.results.slice(1, 4));
  //     } catch {
  //       console.log('error');
  //     }
  //   };
  //   getMovies();
  // }, []);

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
          const background = apiConfig.originalImage(item.poster);
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
                    {item.synopsis.length > 200
                      ? `${item.synopsis.substring(0, 200)}...`
                      : item.synopsis}
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
