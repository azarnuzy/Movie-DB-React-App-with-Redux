import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiConfig from '../api/apiConfig';

import tmdbApi, { category as cate, movieType, tvType } from '../api/tmdbApi';
import MovieCard from './MovieCard';

export default function MovieGrid({ category }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const { keyword } = useParams();

  useEffect(() => {
    const getList = async () => {
      let response = null;
      if (keyword === undefined) {
        const params = { api_key: apiConfig.apiKey };
        switch (category) {
          case cate.movie:
            response = await tmdbApi.getMoviesList(movieType.popular, {
              params,
            });
            break;
          default:
            response = await tmdbApi.getTvList(tvType.popular, { params });
        }
      } else {
        const params = { api_key: apiConfig.apiKey, query: keyword };
        response = await tmdbApi.search(category, { params });
      }
      setItems(response.results);
      setTotalPage(response.total_pages);
    };

    getList();
  }, [category, keyword]);

  const loadMore = async () => {
    let response = null;
    if (keyword === undefined) {
      const params = { api_key: apiConfig.apiKey, page: page + 1 };
      switch (category) {
        case cate.movie:
          response = await tmdbApi.getMoviesList(movieType.upcoming, params);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-10">
      {items.map((item, i) => (
        <MovieCard category={category} item={item} key={i} page="popularPage" />
      ))}
    </div>
  );
}