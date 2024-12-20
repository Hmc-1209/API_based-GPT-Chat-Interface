import React from 'react';
import { useState } from 'react';

import get_access_token from "../http-requests/login";
import { get_self_user } from '../http-requests/login';

const LogIn = () => {
    /*
        This is the component for login page.
    */
    const [loginMode, setLoginMode] = useState(0);

    const switch_mode = () => {
        loginMode === 0 ? setLoginMode(1) : setLoginMode(0);
        return;
    }

    const login = async() => {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        if (username === "" || password === "") {
            console.log("Empty username or password detected.")
            return;
        }
        const response = await get_access_token(username, password);
        if (response === 1) {
            console.log("login success");
        } else if (response === "Username or password incorrect.") {
            console.log("login failed");
        }
    };

    return (
        <div className='w-[70%] min-h-[60%] xl:min-h-[80%] bg-gradient-to-br from-gray-900 to-gray-700 font-bold rounded-lg flex flex-col xl:flex-row'>
            {/* Login page banner */}
            <div className="w-[100%] h-[30%] rounded-tl-lg xs:rounded-tr-lg sm:rounded-tr-lg lg:rounded-tr-lg
                            xl:w-[50%] xl:h-[100%] xl:rounded-tl-lg xl:rounded-bl-lg xl:rounded-tr-none
                            bg-gradient-to-br from-purple-700 to-green-700 bg-opacity-50 
                            font-bold flex items-center justify-center flex-col flex-row p-6">
                <span className="text-3xl
                                 text-transparent bg-clip-text bg-gradient-to-br from-gray-100 to-gray-200 drop-shadow-[0_5px_3px_rgba(200,0,200,0.8)]">
                    API Based <br /> GPT Chat Interface
                </span>
                <span className='text-sm p-4 xl:p-10 drop-shadow-[0_1px_1px_rgba(200,0,200,0.8)]'>
                   Using GPT on a pay-as-you-go basis!
                </span>
            </div>
            {/* Login & Sign Up form */}
            <div className='w-[100%] h-[70%] rounded-tl-lg xs:rounded-tr-lg sm:rounded-tr-lg lg:rounded-tr-lg
                xl:w-[50%] xl:h-[100%] xl:rounded-tl-lg xl:rounded-bl-lg xl:rounded-tr-none flex flex-col items-center justify-center'>
                {loginMode === 0 && 
                    <div className='w-[70%] flex flex-col items-center xl:w-[100%] p-4'>
                        <div className='pb-10 text-4xl xl:text-3xl'>Login page</div>
                        <div className="w-[80%] text-left text-md mb-2 pb-4">
                            <label htmlFor="login-username" className="block text-sm">Username</label>
                            <input type="text" name="login-username" id="login-username" className='w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1' />
                        </div>
                            
                        <div className="w-[80%] text-left text-md mb-2 pb-4">
                            <label htmlFor="login-password" className="block text-sm">Password</label>
                            <input type="password" name="login-password" id="login-password" className='w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1' />
                        </div>
                        <div className='text-sm'>
                            Not yet have an account? Sign in <span onClick={switch_mode} className='underline'>here</span>.
                        </div>
                        <button className='text-3xl xl:text-2xl pt-10 text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-500'
                            onClick={login}>
                                Login
                        </button>
                    </div>
                }
                {loginMode === 1 && 
                    <div className='w-[70%] flex flex-col items-center xl:w-[100%] p-4'>
                        <div className='pb-10 text-4xl xl:text-3xl'>Sign Up page</div>
                        <div className="w-[80%] text-left text-md mb-2 pb-4">
                            <label htmlFor="sign-up-username" className="block text-sm">Username</label>
                            <input type="text" name="sign-up-username" id="sign-up-username" className='w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1' />
                        </div>
                            
                        <div className="w-[80%] text-left text-md mb-2 pb-4">
                            <label htmlFor="sign-up-password" className="block text-sm">Password</label>
                            <input type="password" name="sign-up-password" id="sign-up-password" className='w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1' />
                        </div>

                        <div className="w-[80%] text-left text-md mb-2 pb-4">
                            <label htmlFor="sign-up-confirm-password" className="block text-sm">Password</label>
                            <input type="password" name="sign-up-confirm-password" id="sign-up-confirm-password" className='w-[100%] bg-transparent border-gray-200 border-2 rounded focus:outline-none pl-1' />
                        </div>
                        <div className='text-sm'>
                            Back to <span onClick={switch_mode} className='underline'>login</span>.
                        </div>
                        <button className='text-3xl xl:text-2xl pt-10 text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-500'>Sign Up</button>
                    </div>
                }
            </div>
            <button onClick={get_self_user}>get user</button>
            
        </div>
    )
}; 
export default LogIn;