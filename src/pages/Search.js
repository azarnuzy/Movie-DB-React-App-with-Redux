import React from 'react';
import { useParams } from 'react-router-dom';
import SearchGrid from '../components/SearchGrid';
export default function Category() {
  const { category } = useParams();

  return (
    <div>
      <SearchGrid category={category} />
    </div>
  );
}
