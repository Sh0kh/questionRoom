import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../img/logo.png';

const Sidebar = () => {
    const location = useLocation();

    const Category = location.pathname === '/admin/module';
    const Menu = location.pathname === '/admin/course';
    const Bg = location.pathname === '/admin/student';
    const quiz = location.pathname === '/admin/quiz';

    return (
        <div
            className="fixed flex h-[95%] top-[17px] left-[15px] border-r-[2px]  w-full max-w-[15rem] flex-col bg-[white] rounded-[30px] bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/10 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <div className="p-4 mb-2 flex items-center justify-center">
                <img className="w-[80px]" src={logo} alt="logo" />
            </div>
            <div className="w-full bg-[white] h-[1px]"></div>
            <nav className="flex flex-col gap-1 p-2 font-sans text-base font-normal text-black text-[22px]">
                <NavLink to={'/admin/course'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Menu ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 2h2v20H3zm16 0H6v20h13c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m-1 10H9v-2h9zm0-4H9V6h9z"></path>
                            </svg>
                        </div>
                        Course
                    </div>
                </NavLink>
                <NavLink to={'/admin/module'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Category ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1m10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1M4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1m13 0c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4"
                                ></path>
                            </svg>
                        </div>
                        Modul
                    </div>
                </NavLink>
                <NavLink to={'/admin/student'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Bg ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.129 4.012a1.5 1.5 0 0 1-.141 2.117l-16 14a1.5 1.5 0 0 1-1.976-2.258l16-14a1.5 1.5 0 0 1 2.117.141m0 6.375a1.5 1.5 0 0 1-.141 2.117l-8.715 7.625a1.5 1.5 0 0 1-1.975-2.258l8.714-7.625a1.5 1.5 0 0 1 2.117.141m0 5.875a1.5 1.5 0 0 1-.03 2.01l-.111.107l-2 1.75a1.5 1.5 0 0 1-2.086-2.151l.11-.107l2-1.75a1.5 1.5 0 0 1 2.117.141m-7.286-12.25a1.5 1.5 0 0 1-.14 2.117l-8.715 7.625a1.5 1.5 0 0 1-1.976-2.258l8.715-7.625a1.5 1.5 0 0 1 2.116.141m-6.286 0a1.5 1.5 0 0 1-.03 2.01l-.11.107l-2.43 2.125a1.5 1.5 0 0 1-2.085-2.151l.11-.107l2.429-2.125a1.5 1.5 0 0 1 2.116.141"
                                ></path>
                            </svg>
                        </div>
                        Student
                    </div>
                </NavLink>
                <NavLink to={'/admin/quiz'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${quiz ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.129 4.012a1.5 1.5 0 0 1-.141 2.117l-16 14a1.5 1.5 0 0 1-1.976-2.258l16-14a1.5 1.5 0 0 1 2.117.141m0 6.375a1.5 1.5 0 0 1-.141 2.117l-8.715 7.625a1.5 1.5 0 0 1-1.975-2.258l8.714-7.625a1.5 1.5 0 0 1 2.117.141m0 5.875a1.5 1.5 0 0 1-.03 2.01l-.111.107l-2 1.75a1.5 1.5 0 0 1-2.086-2.151l.11-.107l2-1.75a1.5 1.5 0 0 1 2.117.141m-7.286-12.25a1.5 1.5 0 0 1-.14 2.117l-8.715 7.625a1.5 1.5 0 0 1-1.976-2.258l8.715-7.625a1.5 1.5 0 0 1 2.116.141m-6.286 0a1.5 1.5 0 0 1-.03 2.01l-.11.107l-2.43 2.125a1.5 1.5 0 0 1-2.085-2.151l.11-.107l2.429-2.125a1.5 1.5 0 0 1 2.116.141"
                                ></path>
                            </svg>
                        </div>
                        Quiz
                    </div>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
