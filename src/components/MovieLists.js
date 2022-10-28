import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Autoplay } from 'swiper';
// Import Swiper styles
import 'swiper/css';

import { useWindowWidth } from '@react-hook/window-size';
import MovieCard from './MovieCard';

import {
  fetchMovies,
  getMoviesError,
  getMoviesStatus,
  selectAllMovies,
} from '../features/movies/moviesSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function MovieLists({ category, type, id }) {
  const dispatch = useDispatch();

  let movies = useSelector(selectAllMovies);
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
      return 5;
    } else if (width >= 1024) {
      return 4;
    } else if (width >= 768) {
      return 3;
    } else {
      return 2;
    }
  };

  return (
    <div className="w-full">
      <Swiper
        slidesPerView={getSlidesPerView()}
        spaceBetween={30}
        className="mySwiper"
        modules={[Autoplay]}
      >
        {movies.map((item, i) => (
          <SwiperSlide key={i}>
            <MovieCard item={item} category={category} page="homePage" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// export function GenreList({ category, type }) {
//   const [items, setItems] = useState([]);
//   const width = useWindowWidth();

//   useEffect(() => {
//     const getGenres = async () => {
//       try {
//         const params = { api_key: apiConfig.apiKey };
//         const response = await tmdbApi.genres(type, { params });
//         setItems(response.genres);
//       } catch (error) {}
//     };
//     getGenres();
//   }, [type]);

//   const getSlidesPerView = () => {
//     if (width >= 1280) {
//       return 6;
//     } else if (width >= 1024) {
//       return 5;
//     } else if (width >= 768) {
//       return 4;
//     } else {
//       return 3;
//     }
//   };

//   return (
//     <div className="w-full mx-2">
//       <Swiper
//         slidesPerView={getSlidesPerView()}
//         spaceBetween={20}
//         className="mySwiper"
//         modules={[Autoplay]}
//       >
//         {items.map((item, i) => (
//           <SwiperSlide key={i}>
//             <Link
//               to={`/${category}/genres/${item.id}`}
//               className="flex justify-center py-3 px-1 border-lightRed border-solid rounded-full border text-lightRed whitespace-nowrap overflow-hidden"
//             >
//               {item.name}
//             </Link>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
