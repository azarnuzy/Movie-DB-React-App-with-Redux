import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  fetchGenres,
  getGenresError,
  getGenresStatus,
  selectAllGenres,
} from './genresSlice';

const GenresList = () => {
  const dispatch = useDispatch();

  const genres = useSelector(selectAllGenres);
  const genresStatus = useSelector(getGenresStatus);
  const genresError = useSelector(getGenresError);

  useEffect(() => {
    if (genresStatus === 'idle') {
      dispatch(fetchGenres());
    }
  }, [genresStatus, dispatch]);

  if (genresStatus === 'suceeded') {
    console.log(genres);
  }
  return;
};

export default GenresList;
