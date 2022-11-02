import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';
import Button from './Button';
import { useDispatch, useSelector } from 'react-redux';
import { postRegister } from '../features/register/registerSlice';
import { selectLoginStatus } from '../features/login/loginSlice';
import { registerWithEmailAndPassword } from '../firebase';

const EMAIL_REGEX = /^[A-Za-z0-9_!#$%&'*+\\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function ModalRegister({ handleLogin }) {
  let [isOpen, setIsOpen] = useState(false);

  const errRef = useRef();

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const dispatch = useDispatch();
  const loginStatus = useSelector(selectLoginStatus);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
    setName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      // dispatch(postRegister({ firstName, lastName, email, pwd, matchPwd }));

      registerWithEmailAndPassword(name, email, pwd);

      localStorage.setItem(
        'user-info',
        JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
        })
      );

      closeModal();

      // console.log(JSON.stringify(response?.data));
      handleLogin();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    console.log('click me!');
    setIsOpen(true);
  }

  return (
    <>
      <div className="">
        <Button type={'primary'} openModal={openModal}>
          Register
        </Button>
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
          <div className="fixed inset-0 overflow-y-auto">
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
                    <div class="flex items-center  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  justify-center space-x-2">
                      <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
                      <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
                      <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
                    </div>
                  )}
                  <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                  >
                    {errMsg}
                  </p>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Account
                  </Dialog.Title>
                  <div className="h-[1px] w-full bg-slate-300 my-3"></div>
                  <form onSubmit={handleSubmit}>
                    <div className="py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center">
                      <input
                        className="outline-none w-full"
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        placeholder="First Name"
                        id="first-name"
                        autoComplete="off"
                        required
                      />
                      <label htmlFor="first-name">
                        <AiOutlineUser />
                      </label>
                    </div>
                    <div className="py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center">
                      <input
                        className="outline-none w-full"
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        placeholder="Last Name"
                        id="last-name"
                        autoComplete="off"
                        required
                      />
                      <label htmlFor="last-name">
                        <AiOutlineUser />
                      </label>
                    </div>
                    <div
                      className={
                        emailFocus && email && !validEmail
                          ? `py-2 px-4 border border-red-500 border-solid rounded-full my-3 flex justify-between items-center `
                          : `py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center `
                      }
                    >
                      <input
                        className="outline-none w-full"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        aria-invalid={validEmail ? 'false' : 'true'}
                        aria-describedby="emailidnote"
                        placeholder="Email Address"
                        id="email"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        autoComplete="off"
                        required
                      />
                      <label htmlFor="email">
                        <AiOutlineMail />
                      </label>
                    </div>
                    <p
                      id="emailidnote"
                      className={
                        emailFocus && email && !validEmail
                          ? 'text-sm sm:text-base relative rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none -mt-2 text-red-500 pl-3 flex items-center'
                          : 'offscreen'
                      }
                    >
                      <FaInfoCircle />
                      The email is not a valid email address
                    </p>
                    <div
                      className={
                        pwdFocus && pwd && !validPwd
                          ? `py-2 px-4 border border-red-500 border-solid rounded-full my-3 flex justify-between items-center `
                          : `py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center `
                      }
                    >
                      <input
                        className="outline-none w-full"
                        type="password"
                        placeholder="Password"
                        autoComplete="off"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        aria-invalid={validPwd ? 'false' : 'true'}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        required
                      />
                      <label htmlFor="password">
                        <FaCheck className={validPwd ? 'valid' : 'hide'} />
                        <FaTimes
                          className={validPwd || !pwd ? 'hide' : 'invalid'}
                        />
                      </label>
                    </div>
                    <div
                      id="pwdnote"
                      className={
                        pwdFocus && pwd && !validPwd
                          ? 'text-sm sm:text-base relative rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none text-red-500 pl-3 flex flex-col -mt-2'
                          : 'offscreen'
                      }
                    >
                      <span>
                        <FaInfoCircle />
                      </span>
                      8 to 24 characters. Must include uppercase and lowercase
                      letters, a number and a special character. Allowed special
                      characters:{' '}
                      <div className="flex">
                        <span aria-label="exclamation mark">!</span>{' '}
                        <span aria-label="at symbol">@</span>{' '}
                        <span aria-label="hashtag">#</span>{' '}
                        <span aria-label="dollar sign">$</span>{' '}
                        <span aria-label="percent">%</span>
                      </div>
                    </div>
                    <div
                      className={
                        matchPwd && matchFocus && !validMatch
                          ? `py-2 px-4 border border-red-500 border-solid rounded-full my-3 flex justify-between items-center `
                          : `py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center `
                      }
                    >
                      <input
                        className="outline-none w-full"
                        type="password"
                        placeholder="Password Confirmation"
                        autoComplete="off"
                        id="password-confirm"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        aria-invalid={validMatch ? 'false' : 'true'}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        required
                      />
                      <label htmlFor="password-confirm">
                        <FaCheck
                          className={validMatch && matchPwd ? 'valid' : 'hide'}
                        />
                        <FaTimes
                          className={
                            validMatch || !matchPwd ? 'hide' : 'invalid'
                          }
                        />
                        {/* <AiOutlineEyeInvisible className="" /> */}
                      </label>
                    </div>
                    <p
                      id="confirmnote"
                      className={
                        matchFocus && !validMatch
                          ? 'text-sm sm:text-base relative rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none -mt-3 mb-3 text-red-500 pl-3 flex items-center'
                          : 'offscreen'
                      }
                    >
                      <FaInfoCircle />
                      Must match the first password input field.
                    </p>
                    <Button type={'primary'} typeButton={'submit'}>
                      Register
                    </Button>
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
