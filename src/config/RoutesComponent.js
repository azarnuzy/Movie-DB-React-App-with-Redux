import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Catalog from '../pages/Catalog';
import Detail from '../pages/Detail';
import Home from '../pages/Home';
import Category from '../pages/Category';
import SearchGrid from '../components/SearchGrid';

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:category" element={<Catalog />} />
      <Route path="/:category/:id" element={<Detail />} />
      <Route path="/:category/search/:keyword" element={<SearchGrid />} />
      <Route path="/:category/genres/:id" element={<Category />} />
    </Routes>
  );
}
