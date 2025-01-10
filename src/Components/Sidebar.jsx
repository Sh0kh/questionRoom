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
                {/* This is logo */}
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
                        Kurs
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"></path></svg>
                        </div>
                        Talabalar
                    </div>
                </NavLink>
                <NavLink to={'/admin/quiz'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${quiz ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 15q.425 0 .738-.312t.312-.738t-.312-.737T14 12.9t-.737.313t-.313.737t.313.738T14 15m-.75-3.2h1.5q0-.725.15-1.062t.7-.888q.75-.75 1-1.212t.25-1.088q0-1.125-.788-1.837T14 5q-1.025 0-1.787.575T11.15 7.1l1.35.55q.225-.625.613-.937T14 6.4q.6 0 .975.338t.375.912q0 .35-.2.663t-.7.787q-.825.725-1.012 1.138T13.25 11.8M8 18q-.825 0-1.412-.587T6 16V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V6h2v14h14v2z"></path></svg>
                        </div>
                        Savolar
                    </div>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
