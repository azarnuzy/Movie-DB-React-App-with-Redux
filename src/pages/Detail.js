import React, { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import apiConfig from '../api/apiConfig';
import tmdbApi from '../api/tmdbApi';
import { TrailerButton } from '../components/Button';
import MovieLists from '../components/MovieLists';

export default function Detail() {
  let { category, id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    try {
      const getDetail = async () => {
        const params = { api_key: apiConfig.apiKey };
        const response = await tmdbApi.detail(category, id, { params: params });
        setItem(response);
        window.scrollTo(0, 0);
      };

      getDetail();
    } catch (error) {}
  }, [category, id]);

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
