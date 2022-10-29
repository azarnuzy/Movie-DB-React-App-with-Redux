import React, { useEffect, useState } from 'react';
import {
  AiFillGoogleCircle,
  AiOutlineSearch,
  AiOutlineUser,
} from 'react-icons/ai';
import logo from '../images/Logo.svg';
import { useMediaQuery } from 'react-responsive';
import ModalElement from './ModalElement';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ModalRegister from './ModalRegister';
import ModalLogin from './ModalLogin';
import MenuProfile from './MenuProfile';
import { Menu } from '@headlessui/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector } from 'react-redux';
import { selectLogin, selectLoginStatus } from '../features/login/loginSlice';
import {
  selectRegister,
  selectRegisterStatus,
} from '../features/register/registerSlice';

export default function Navbar() {
  const isSmallWidth = useMediaQuery({ query: '(min-width: 640px)' });
  const isPhone = useMediaQuery({ query: '(max-width: 640px)' });
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState();
  const page = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const user = useSelector(selectLogin) || '';
  const loginStatus = useSelector(selectLoginStatus);

  const registerUser = useSelector(selectRegister);
  const registerStatus = useSelector(selectRegisterStatus);

  const category =
    page.pathname.indexOf('/tv') >= 0
      ? 'tv'
      : page.pathname.indexOf('/movie') >= 0
      ? 'movie'
      : 'multi';

  useEffect(() => {
    if (localStorage.getItem('user-info')) {
      const data = JSON.parse(localStorage.getItem('user-info')).data;
      setIsLogin(true);
      setFirstName(data.first_name || 'Google');
      setLastName(data.last_name || 'User');
    } else if (loginStatus === 'succeeded' || registerStatus === 'succeeded') {
      // console.log(user);
      console.log(registerStatus);
      setIsLogin(true);
      setFirstName(user.first_name || registerUser?.first_name);
      setLastName(user.last_name || registerUser?.last_name);
    }
  }, [
    loginStatus,
    registerStatus,
    registerUser.first_name,
    registerUser.last_name,
    user,
    user.first_name,
    user.last_name,
  ]);

  const handleLogin = () => {
    if (localStorage.getItem('user-info')) {
      const data = JSON.parse(localStorage.getItem('user-info')).data;
      setIsLogin(true);
      setFirstName(data.first_name || 'Google');
      setLastName(data.last_name || 'User');
    } else if (loginStatus === 'succeeded' || registerStatus === 'succeeded') {
      setFirstName(user?.first_name || registerUser?.first_name);
      setFirstName(user?.last_name || registerUser?.last_name);
    }
  };

  const handleLogout = () => {
    setIsLogin(false);
    setFirstName('');
    setLastName('');
    localStorage.removeItem('user-info');
    localStorage.removeItem('token');
  };

  const handleKeyPressed = (e) => {
    if (e.key === 'Enter') {
      navigate(`/${category}/search/${keyword}`, {
        state: { search: keyword },
      });
      setKeyword('');
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem(
        'user-info',
        JSON.stringify({ data: tokenResponse })
      );
      localStorage.setItem('token', JSON.stringify(tokenResponse.access_token));
      console.log(tokenResponse);
      handleLogin();
    },
  });

  return (
    <div className="flex justify-between mt-3 relative z-10">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="" className="transform scale-90  lg:scale-110" />
      </Link>
      {isPhone && !isLogin && (
        <div className="flex gap-3 text-[30px]  text-slate-200 items-center ">
          <ModalElement />
          <DropDownMenu handleLogin={handleLogin} loginGoogle={loginGoogle} />
        </div>
      )}
      {isPhone && isLogin && (
        <div className="flex gap-3 text-[30px]  text-slate-200 items-center ">
          <ModalElement />
          <MenuProfile
            firstName={firstName}
            lastName={lastName}
            handleLogout={handleLogout}
          />
        </div>
      )}
      {isSmallWidth && (
        <div className="sm:flex w-full sm:w-auto sm:flex-grow mx-5 lg:mx-20 justify-between px-4 py-[6.5px] rounded-full group focus-within:border-lightRed border-slate-300 border-solid border items-center hidden">
          <input
            type="text"
            className="outline-none bg-transparent text-white w-full"
            id="search-movie"
            placeholder="what do you want to watch?"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => handleKeyPressed(e)}
          />
          <label htmlFor="search-movie">
            <AiOutlineSearch className="text-white" />
          </label>
        </div>
      )}
      {isSmallWidth && !isLogin && (
        <div className="sm:flex justify-between gap-2 hidden">
          <ModalLogin handleLogin={handleLogin} loginGoogle={loginGoogle} />
          <ModalRegister handleLogin={handleLogin} />
        </div>
      )}
      {isSmallWidth && isLogin && (
        <MenuProfile
          firstName={firstName}
          lastName={lastName}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
}

function DropDownMenu({ handleLogin, loginGoogle }) {
  const [customOpen, setCustomOpen] = useState(false);
  function buttonClicked() {
    setCustomOpen((prev) => !prev);
  }
  return (
    <div className="flex items-center">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              onClick={buttonClicked}
              className="flex gap-2 items-center"
            >
              <AiOutlineUser />
            </Menu.Button>

            {customOpen && (
              <Menu.Items
                static
                className="fixed top-8 bg-transparent sm:px-5 sm:right-2 right-0 mt-2 w-fit p-2  origin-top-right  rounded-sm md:text-lg  ring-1 ring-black ring-opacity-5 focus:outline-none text-black text-sm flex flex-col gap-3 items-end"
              >
                <Menu.Item className="text-left">
                  <ModalLogin handleLogin={handleLogin} />
                </Menu.Item>
                <Menu.Item className="text-left">
                  <ModalRegister handleLogin={handleLogin} />
                </Menu.Item>
                <Menu.Item className="text-left flex items-center px-3 py-2 rounded-full border-solid border-lightRed transition duration-300 bg-lightRed font-medium text-white  hover:opacity-80 border">
                  <button
                    className="px-3 py-2 rounded-full border-solid border-lightRed transition duration-300 bg-lightRed font-medium text-white  hover:opacity-80 border flex items-center"
                    onClick={() => loginGoogle()}
                  >
                    <AiFillGoogleCircle className=" mr-2 text-xl" /> Sign in
                    with Google
                  </button>
                </Menu.Item>
              </Menu.Items>
            )}
          </>
        )}
      </Menu>
    </div>
  );
}
