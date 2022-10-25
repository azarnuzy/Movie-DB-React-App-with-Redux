import React from 'react';
import { category, movieType } from '../api/tmdbApi';
import { GenreList } from '../components/GenreList';
import MovieLists from '../components/MovieLists';
import Slider from '../components/Slider';
import TitleSection from '../components/TitleSection';

export default function Home() {
  return (
    <div>
      <Slider />
      <TitleSection section={'homePopularMovie'} destination={'allMovie'}>
        Popular Movies
      </TitleSection>
      <MovieLists category={category.movie} type={movieType.popular} />
      <TitleSection section={''} destination={'allMovie'}>
        Genres Movies
      </TitleSection>
      <GenreList category={category.movie} />
      {/* <TitleSection section={'category'} destination={'genres'}>
        Movie Category
      </TitleSection>
      <GenreList category={category.movie} type={'movie'} />
      <TitleSection section={'homePopularTV'} destination={'allTv'}>
        Popular TV Shows
      </TitleSection>
      <MovieLists category={category.tv} type={tvType.popular} />
      <TitleSection section={'category'} destination={'genres'}>
        TV Category
      </TitleSection>
      <GenreList category={category.tv} type={'tv'} /> */}
    </div>
  );
}
