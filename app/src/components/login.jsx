import React from "react";
import { useState, useContext } from "react";

import get_access_token, { create_new_user } from "../http-requests/login";
import { AppContext } from "../App";
import get_self_user from "../http-requests/user-data";

const LogIn = () => {
  /*
        This is the component for login page.
    */
  const [loginMode, setLoginMode] = useState(0);
  const [loading, setLoading] = useState(0);

  let { setAlert, setAppPage, setUserDetail } = useContext(AppContext);

  const switch_mode = () => {
    loginMode === 0 ? setLoginMode(1) : setLoginMode(0);
    return;
  };

  const login = async () => {
    setLoading(1);
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    if (username === "" || password === "") {
      setAlert(1);
      setLoading(0);
      return;
    }
    const response = await get_access_token(username, password);
    setLoading(0);
    if (response === 1) {
      // login success
      const user_detail = await get_self_user();
      if (user_detail === 2 || user_detail === 5) {
        setAlert(9);
      } else {
        console.log(user_detail);
        setUserDetail(user_detail);
      }
      setAlert(2);
      setAppPage(1);
      return;
    } else if (response === 2) {
      // invalid username or password
      setAlert(3);
      return;
    }
    // unknown error
    setAlert(6);
    return;
  };

  const signup = async () => {
    setLoading(1);
    const username = document.getElementById("sign-up-username").value;
    const password = document.getElementById("sign-up-password").value;
    const confirm_password = document.getElementById(
      "sign-up-confirm-password"
    ).value;

    if (username === "" || password === "" || confirm_password === "") {
      setAlert(1);
      setLoading(0);
      return;
    } else if (password !== confirm_password) {
      setAlert(4);
      setLoading(0);
      return;
    }

    const response = await create_new_user(username, password);
    setLoading(0);

    if (response === 1) {
      // successfully registed
      setAlert(5);
      return;
    } else {
      // invalid username or password
      setAlert(3);
      return;
    }
    setAlert(6);
    return;
  };

  return (
    <div className="w-[70%] min-h-[60%] xl:min-h-[80%] bg-gradient-to-br from-gray-900 to-gray-700 font-bold rounded-lg flex flex-col xl:flex-row">
      {/* Login page banner */}
      <div
        className="w-[100%] h-[30%] rounded-tl-lg xs:rounded-tr-lg sm:rounded-tr-lg lg:rounded-tr-lg
                            xl:w-[50%] xl:h-[100%] xl:rounded-tl-lg xl:rounded-bl-lg xl:rounded-tr-none
                            bg-gradient-to-br from-purple-700 to-green-700 bg-opacity-50 
                            font-bold flex items-center justify-center flex-col flex-row p-6"
      >
        <span
          className="text-3xl
                                 text-transparent bg-clip-text bg-gradient-to-br from-gray-100 to-gray-200 drop-shadow-[0_5px_3px_rgba(200,0,200,0.8)]"
        >
          API Based <br /> GPT Chat Interface
        </span>
        <span className="text-sm p-4 xl:p-10 drop-shadow-[0_1px_1px_rgba(200,0,200,0.8)]">
          Using GPT on a pay-as-you-go basis!
        </span>
      </div>
      {/* Login & Sign Up form */}
      <div
        className="w-[100%] h-[70%] rounded-tl-lg xs:rounded-tr-lg sm:rounded-tr-lg lg:rounded-tr-lg
                xl:w-[50%] xl:h-[100%] xl:rounded-tl-lg xl:rounded-bl-lg xl:rounded-tr-none flex flex-col items-center justify-center"
      >
        {loginMode === 0 && (
          <div className="w-[70%] flex flex-col items-center xl:w-[100%] p-4">
            <div className="pb-10 text-4xl xl:text-3xl">Login page</div>
            <div className="w-[80%] text-left text-md mb-2 pb-4">
              <label htmlFor="login-username" className="block text-sm">
                Username
              </label>
              <input
                type="text"
                name="login-username"
                id="login-username"
                className="w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1"
              />
            </div>

            <div className="w-[80%] text-left text-md mb-2 pb-4">
              <label htmlFor="login-password" className="block text-sm">
                Password
              </label>
              <input
                type="password"
                name="login-password"
                id="login-password"
                className="w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1"
              />
            </div>
            <div className="text-sm">
              Not yet have an account? Sign up{" "}
              <span onClick={switch_mode} className="underline">
                here
              </span>
              .
            </div>
            {loading === 0 ? (
              <button
                className="text-3xl xl:text-2xl pt-10 text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-500"
                onClick={login}
              >
                Login
              </button>
            ) : (
              <div className="text-3xl xl:text-2xl pt-10 text-gray-500">
                Loading...
              </div>
            )}
          </div>
        )}
        {loginMode === 1 && (
          <div className="w-[70%] flex flex-col items-center xl:w-[100%] p-4">
            <div className="pb-10 text-4xl xl:text-3xl">Sign Up page</div>
            <div className="w-[80%] text-left text-md mb-2 pb-4">
              <label htmlFor="sign-up-username" className="block text-sm">
                Username
              </label>
              <input
                type="text"
                name="sign-up-username"
                id="sign-up-username"
                className="w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1"
              />
            </div>

            <div className="w-[80%] text-left text-md mb-2 pb-4">
              <label htmlFor="sign-up-password" className="block text-sm">
                Password
              </label>
              <input
                type="password"
                name="sign-up-password"
                id="sign-up-password"
                className="w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1"
              />
            </div>

            <div className="w-[80%] text-left text-md mb-2 pb-4">
              <label
                htmlFor="sign-up-confirm-password"
                className="block text-sm"
              >
                Password
              </label>
              <input
                type="password"
                name="sign-up-confirm-password"
                id="sign-up-confirm-password"
                className="w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1"
              />
            </div>
            <div className="text-sm">
              Back to{" "}
              <span onClick={switch_mode} className="underline">
                login
              </span>
              .
            </div>
            {loading === 0 ? (
              <button
                className="text-3xl xl:text-2xl pt-10 text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-500"
                onClick={signup}
              >
                Sign Up
              </button>
            ) : (
              <div className="text-3xl xl:text-2xl pt-10 text-gray-500">
                Loading...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default LogIn;
