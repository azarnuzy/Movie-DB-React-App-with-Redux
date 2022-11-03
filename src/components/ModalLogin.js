import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import {
  AiFillGoogleCircle,
  AiOutlineEyeInvisible,
  AiOutlineMail,
} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginWithFireBase,
  postLogin,
  selectLoginStatus,
} from '../features/login/loginSlice';

import Button from './Button';

import {
  auth,
  db,
  logout,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, collection, getDocs, where } from 'firebase/firestore';

export default function ModalLogin({ handleLogin, loginGoogle }) {
  let [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setErrMsg] = useState('');

  const dispatch = useDispatch();
  const loginStatus = useSelector(selectLoginStatus);

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      dispatch(loginWithFireBase(data));
      const firstName = data.name.split(' ')[0];
      const lastName = data.name.split(' ')[1];
      localStorage.setItem(
        'user-info',
        JSON.stringify({ data: { first_name: firstName, last_name: lastName } })
      );
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    fetchUserName();
  }, [user, loading]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      logInWithEmailAndPassword(email, password);
      // dispatch(postLogin({ email, password: password }));
      handleLogin();
      setEmail('');
      setPassword('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
    // console.log(e.target[0].value);
    // console.log(e.target[1].value);
    closeModal();
  };

  return (
    <>
      <div className="">
        <Button openModal={openModal}>Login</Button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto z-[100]">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {loginStatus === 'loading' && (
                    <div className="flex items-center  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  justify-center space-x-2">
                      <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
                      <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
                      <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
                    </div>
                  )}
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Login to Your Account
                  </Dialog.Title>
                  <div className="h-[1px] w-full bg-slate-300 my-3"></div>
                  <form onSubmit={handleSubmit}>
                    <div className="py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center">
                      <input
                        className="outline-none"
                        type="email"
                        placeholder="Email Address"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        autoComplete="off"
                        required
                      />
                      <label htmlFor="email">
                        <AiOutlineMail />
                      </label>
                    </div>
                    <div className="py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center">
                      <input
                        className="outline-none"
                        type="password"
                        placeholder="Password"
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        id="password"
                        required
                      />
                      <label htmlFor="password">
                        <AiOutlineEyeInvisible />
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        type={'primary'}
                        typeButton={'submit'}
                        closeModal={closeModal}
                      >
                        Login
                      </Button>
                      {/* <button
                        className="px-3 py-2 rounded-full border-solid border-lightRed transition duration-300 bg-lightRed font-medium text-white  hover:opacity-80 border flex items-center"
                        onClick={() => loginGoogle()}
                      >
                        <AiFillGoogleCircle className=" mr-2 text-xl" /> Sign in
                        with Google
                      </button> */}
                      <button
                        className="px-3 py-2 rounded-full border-solid border-lightRed transition duration-300 bg-lightRed font-medium text-white  hover:opacity-80 border flex items-center"
                        onClick={signInWithGoogle}
                      >
                        <AiFillGoogleCircle className=" mr-2 text-xl" /> Sign in
                        with Google
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
