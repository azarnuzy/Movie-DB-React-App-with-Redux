import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export default function TitleSection({ children, section, destination }) {
  let mt, link;

  if (section === 'homePopularMovie') {
    mt = 'mt-[97vh]';
  }

  if (section === 'homePopularTV') {
    mt = 'mt-3';
  }
  if (destination === 'allMovie') {
    link = '/movie';
  }

  return (
    <div
      className={`flex text-lg  mb-4 justify-between mx-2 ${mt} font-semibold mt-4 `}
    >
      <h2>{children}</h2>
      <Link to={link} className={section === 'category' ? 'hidden' : ''}>
        <div className="text-lightRed gap-3 flex items-center">
          <span className="">View More</span> <AiOutlineArrowRight />
        </div>
      </Link>
    </div>
  );
}
