import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Autoplay } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import apiConfig from '../api/apiConfig';
import {
  fetchGenres,
  getGenresError,
  getGenresStatus,
  selectAllGenres,
} from '../features/genres/genresSlice';

export function GenreList({ category, type }) {
  const dispatch = useDispatch();

  let genres = useSelector(selectAllGenres);
  const genresStatus = useSelector(getGenresStatus);
  const genresError = useSelector(getGenresError);

  const width = useWindowWidth();

  useEffect(() => {
    if (genresStatus === 'idle') {
      dispatch(fetchGenres());
    }
  }, [genresStatus, dispatch]);

  const getSlidesPerView = () => {
    if (width >= 1280) {
      return 5;
    } else if (width >= 1024) {
      return 4;
    } else if (width >= 768) {
      return 3;
    } else {
      return 2;
    }
  };

  if (genresStatus === 'succeeded') {
    console.log(genres);
  }

  return (
    <div className="w-full mx-2">
      <Swiper
        slidesPerView={getSlidesPerView()}
        spaceBetween={20}
        className="mySwiper"
        modules={[Autoplay]}
      >
        {genres.map((item, i) => (
          <SwiperSlide key={i}>
            <Link
              to={`/${category}/genres/${item.id}`}
              className="flex justify-center py-3 px-1 border-lightRed border-solid rounded-full border text-lightRed whitespace-nowrap overflow-hidden"
            >
              {item}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
