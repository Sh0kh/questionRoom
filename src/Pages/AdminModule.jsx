import React, { useEffect, useState } from "react";
import CreateModule from "../Components/AdminModule/CreateModule";
import DeleteModule from "../Components/AdminModule/DeleteModule";
import EditModule from "../Components/AdminModule/EditModule";
import axios from "axios";
import ReactLoading from 'react-loading';


export default function AdminModule() {
    const [createModal, setCreateModal] = useState(false);
    const [deleteCourse, setDeleteCourse] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [itemsData, setItemsData ] = useState(null)
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10
    });

    const getModule = async (page = 0) => {
        try {
            const response = await axios.get(`/module/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    page: page,
                    size: pagination.pageSize
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
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getModule();
    }, []);

    const handlePageChange = (page) => {
        if (page >= 0 && page < pagination.totalPages) {
            getModule(page);
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
        <div className="w-full h-screen bg-gray-100 p-6 md:p-10">
            <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-200">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-[50px]">
                    <h1 className="text-2xl font-semibold text-gray-800">All Module</h1>
                    <button
                        onClick={() => setCreateModal(true)}
                        className="bg-[#272C4B] text-white py-2 px-6 rounded-md text-sm font-medium transition-all hover:bg-[#272c4be3]"
                    >
                        + Add New Module
                    </button>
                </div>

                {data && data?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Module Name</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Time Minutes</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Start Date</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((course) => (
                                    <tr key={course.id} className="border-t border-t-[2px] cursor-pointer hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{course.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course?.testTimeMinute}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course?.createdAt?.split('T')[0]}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <button
                                                onClick={() => {setEditModal(true); setItemsData(course)}}
                                                className="text-blue-600 text-[25px] hover:text-blue-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => {setDeleteCourse(true); setItemsData(course?.id)}}
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
                            Empty Data
                        </h1>
                    </div>
                )}


                {/* Pagination Section */}
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Showing {data.length} of {pagination.totalElements} entries
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
                                {pagination.currentPage + 1} of {pagination.totalPages}
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

            <CreateModule refresh={getModule} isOpen={createModal} onClose={() => setCreateModal(false)} />
            <DeleteModule refresh={getModule} data={itemsData} isOpen={deleteCourse} onClose={() => setDeleteCourse(false)} />
            <EditModule data={itemsData} refresh={getModule} isOpen={editModal} onClose={() => setEditModal(false)} />
        </div>
    );
}