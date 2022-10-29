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
    </div>
  );
}
