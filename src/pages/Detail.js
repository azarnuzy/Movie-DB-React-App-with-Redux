import React, { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import apiConfig from '../api/apiConfig';
import tmdbApi from '../api/tmdbApi';
import { TrailerButton } from '../components/Button';
import MovieLists from '../components/MovieLists';
import {
  fetchDetailMovie,
  getDetailError,
  selectDetail,
  selectDetailStatus,
} from '../features/detail/detailSlice';

export default function Detail() {
  const dispatch = useDispatch();

  let { category, id } = useParams();
  const item = useSelector(selectDetail);
  const detailStatus = useSelector(selectDetailStatus);
  const detailError = useSelector(getDetailError);

  useEffect(() => {
    dispatch(fetchDetailMovie({ category, id }));
    window.scrollTo(0, 0);
  }, [category, dispatch, id]);

  console.log(item);
  return (
    <div>
      <div className="h-[85vh]"></div>
      <div className="absolute top-0 left-0 w-full">
        {item && (
          <div className="w-full h-[100vh] relative">
            <div className="bg-[#0006] absolute w-full h-[100vh]"></div>
            <img
              className="absolute w-full h-[100vh] object-cover -z-[10]"
              src={apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )}
              alt=""
            />
            <div className="h-[100vh] transform flex justify-center flex-col text-white mx-4 lg:max-w-5xl lg:mx-auto">
              <h2 className="text-3xl font-bold">{item.title || item.name}</h2>
              <div className="flex flex-wrap gap-2 my-4">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, i) => (
                    <span
                      key={i}
                      className="rounded-full px-3 py-1 text-white font-semibold text-lg border border-solid border-white bg-transparent "
                    >
                      {genre.name}
                    </span>
                  ))}
              </div>
              <p className=" text-md mb-3">{item.overview}</p>
              <span className="flex gap-3 items-center text-yellow-400 mt-1 mb-3 ">
                <AiFillStar /> <p>{item.vote_average?.toFixed(1)} / 10</p>
              </span>
              <TrailerButton item={item} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
