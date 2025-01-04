import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from 'react-loading';
import CreateStudent from "../Components/AdminStudent/CreateStudent";
import DeleteStudent from "../Components/AdminStudent/DeleteStudent";
import { Button, Input, Select, Option } from '@material-tailwind/react';
import EditStudent from "../Components/AdminStudent/EditStudent";
import { NavLink, useNavigate } from "react-router-dom";


export default function AdminStudent() {
    const [createModal, setCreateModal] = useState(false);
    const [firstName, setFirstName] = useState('')
    const [deleteCourse, setDeleteCourse] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [itemsData, setItemsData] = useState(null)
    const navigate = useNavigate()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState(null)
    const [email, setEmail] = useState('')
    const [school, setSchool] = useState('')
    const [sinif, setSinif] = useState('')

    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 20
    });



    const getStudent = async (page = 0) => {
        try {
            const response = await axios.get(`/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    phoneNumber: phoneNumber,
                    accountType: 'STUDENT',
                    firstName: firstName,
                    page: page,
                    size: pagination.pageSize,
                    gender: gender,
                    email:email,
                    school:school,
                    group:sinif
                }
            });

            const responseData = response?.data?.object;
            setData(responseData.content);
            setPagination({
                currentPage: responseData.number,
                totalPages: responseData.totalPages,
                totalElements: responseData.totalElements,
                pageSize: responseData.size
            });
        } catch (error) {
            console.log(error);
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        } finally {
            setLoading(false)
        }
    };




    useEffect(() => {
        getStudent();
    }, []);

    const handlePageChange = (page) => {
        if (page >= 0 && page < pagination.totalPages) {
            getStudent(page);
        }
    };


    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }


    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-200">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-[20px]">
                    <h1 className="text-2xl font-semibold text-gray-800">Barcha talabalar</h1>
                    <button
                        onClick={() => setCreateModal(true)}
                        className="bg-[#272C4B] text-white py-2 px-6 rounded-md text-sm font-medium transition-all hover:bg-[#272c4be3]"
                    >
                        Talaba yaratish
                    </button>
                </div>
                <div className="flex items-start gap-[10px]">
                    <div className="w-full search__wrapper">
                        <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            label="Ism"
                            color="gray"  // Changed to gray for a neutral look
                            type="text"
                            required
                            className="border-black"  // Black border color
                        />
                        <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            label="Familiya"
                            color="gray"  // Changed to gray for a neutral look
                            type="text"
                            required
                            className="border-black"  // Black border color
                        />
                        <Input
                            value={phoneNumber}
                            onChange={(e) => {
                                const input = e.target.value;

                                // Удаляем любые символы, кроме цифр
                                const numericValue = input.replace(/\D/g, "");

                                // Префикс +998 не должен быть удалён
                                let formattedValue = "+998";

                                // Добавляем цифры после +998, но не более 9 символов
                                if (numericValue.startsWith("998")) {
                                    formattedValue += numericValue.slice(3, 12); // Убираем "998" из начала
                                } else {
                                    formattedValue += numericValue.slice(0, 9); // Просто добавляем оставшиеся цифры
                                }

                                setPhoneNumber(formattedValue);
                            }}
                            label="Telefon raqam"
                            color="gray"
                            type="text" // Используем text, чтобы разрешить ввод "+"
                            required
                            className="border-black"
                            maxLength={13} // Ограничиваем длину ввода до 13 символов
                        />
                        <Select
                            className="bg-[white]"
                            label="Jinsi"
                            onChange={(value) => setGender(value)}
                        >
                            <Option key="male" value="ERKAK">
                                Erkkak
                            </Option>
                            <Option key="female" value="AYOL">
                                Ayol
                            </Option>
                        </Select>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                            color="gray"  // Changed to gray for a neutral look
                            type="text"
                            required
                            className="border-black"  // Black border color
                        />
                        <Input
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            label="Maktab"
                            color="gray"  // Changed to gray for a neutral look
                            type="text"
                            required
                            className="border-black"  // Black border color
                        />
                        <Input
                            value={sinif}
                            onChange={(e) => setSinif(e.target.value)}
                            label="Sinif"
                            color="gray"  // Changed to gray for a neutral look
                            type="text"
                            required
                            className="border-black"  // Black border color
                        />
                    </div>
                    <Button className="w-[200px]" onClick={() => getStudent(pagination.currentPage)}>
                        Izlash
                    </Button>
                </div>
                {data && data?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Ism</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Tug`ilgan kuni</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Telefon</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Test</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Sozlama</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((course) => (
                                    <tr key={course.id} className="border-t border-t-[2px] cursor-pointer hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <NavLink
                                                className="underline"
                                                to={`/admin/student/${course?.id}?firstName=${course.firstName}&lastName=${course.lastName}`}
                                            >
                                                {course.firstName} {course.lastName}
                                            </NavLink>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course?.dateBirth}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course?.username}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {course?.courseId === null ? (
                                                <svg className="text-[20px] text-[green]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"></path></svg>
                                            ) : (
                                                <svg className="text-[red]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m13.5.5l-13 13m0-13l13 13"></path></svg>
                                            )}

                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <button
                                                onClick={() => { setEditModal(true); setItemsData(course) }}
                                                className="text-blue-600 text-[25px] hover:text-blue-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => { setDeleteCourse(true); setItemsData(course?.id) }}
                                                className="text-red-600 ml-3 text-[25px] hover:text-red-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <h1>
                            Ma'lumot yoq
                        </h1>
                    </div>
                )}


                {/* Pagination Section */}
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${pagination.currentPage === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            disabled={pagination.currentPage === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="flex items-center">
                            <div className="w-16 text-center px-2 py-1 border border-gray-300 rounded-md text-sm">
                                {pagination.currentPage + 1} / {pagination.totalPages}
                            </div>
                        </div>

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${pagination.currentPage === pagination.totalPages - 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            disabled={pagination.currentPage === pagination.totalPages - 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <CreateStudent refresh={getStudent} isOpen={createModal} onClose={() => setCreateModal(false)} />
            <DeleteStudent refresh={getStudent} data={itemsData} isOpen={deleteCourse} onClose={() => setDeleteCourse(false)} />
            <EditStudent data={itemsData} refresh={getStudent} isOpen={editModal} onClose={() => setEditModal(false)} />
        </div>
    );
}