import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Button from './Button';

const EMAIL_REGEX = /^[A-Za-z0-9_!#$%&'*+\\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
const PWD_REGEX = /[a-z]/;

export default function ModalRegister() {
  let [isOpen, setIsOpen] = useState(false);

  const errRef = useRef();

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [firstName, lastName, email, pwd, matchPwd]);

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
      const response = await axios.post(
        'http://notflixtv.herokuapp.com/api/v1/users',
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: pwd,
          password_confirmation: pwd,
        }
      );
      closeModal();
      localStorage.setItem('data', JSON.stringify(response?.data));
      console.log(JSON.stringify(response?.data));
      setSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPwd('');
      setSuccess(true);
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
                        className="outline-none"
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
                        className="outline-none"
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
                    <div className="py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center">
                      <input
                        className="outline-none"
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
                          ? 'instructions'
                          : 'offscreen'
                      }
                    >
                      <FaInfoCircle />
                      The email is not a valid email address
                    </p>
                    <div className="py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center">
                      <input
                        className="outline-none"
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
                    <p
                      id="pwdnote"
                      className={
                        pwdFocus && !validPwd ? 'instructions' : 'offscreen'
                      }
                    >
                      <FaInfoCircle />
                      8 to 24 characters.
                      <br />
                      Must include uppercase and lowercase letters, a number and
                      a special character.
                      <br />
                      Allowed special characters:{' '}
                      <span aria-label="exclamation mark">!</span>{' '}
                      <span aria-label="at symbol">@</span>{' '}
                      <span aria-label="hashtag">#</span>{' '}
                      <span aria-label="dollar sign">$</span>{' '}
                      <span aria-label="percent">%</span>
                    </p>
                    <div className="py-2 px-4 border border-slate-300 border-solid rounded-full my-3 flex justify-between items-center">
                      <input
                        className="outline-none"
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
                        <FaCheck className={validPwd ? 'valid' : 'hide'} />
                        <FaTimes
                          className={validPwd || !pwd ? 'hide' : 'invalid'}
                        />
                        {/* <AiOutlineEyeInvisible className='' /> */}
                      </label>
                    </div>
                    <p
                      id="confirmnote"
                      className={
                        matchFocus && !validMatch ? 'instructions' : 'offscreen'
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
