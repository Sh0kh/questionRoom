import React, { useEffect, useState } from "react";
import CreateStudent from "../Components/AdminStudent/CreateStudent";
import DeleteStudent from "../Components/AdminStudent/DeleteStudent";

// Import the Select component from Material Tailwind
import { Select, Option } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuizDelete from "../Components/AdminQuiz/QuizDelete";

export default function AdminQuiz() {
    const navigate = useNavigate()
    // Fake course data
    const [createModal, setCreateModal] = useState(false)
    const [deleteCourse, setDeleteCourse] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [courseData, setCourseData] = useState([])
    const [moduleData, setModuleData] = useState([])
    const [quize, setQuize] = useState([])
    const [moduleId, setModuleId] = useState(null)
    const [itemsData, setItemsData] = useState(null)
    

    const getCourse = async () => {
        try {
            const response = await axios.get(`/course/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const courses = Array.isArray(response?.data?.object) ? response.data.object : [];
            setCourseData(courses);
        } catch (error) {
            console.error(error);
            setCourseData([]); // Set to an empty array in case of an error
        }
    };

    const GetModulesByCourse = async (courseId) => {
        try {
            const response = await axios.get(`/module/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    courseId: courseId
                }
            });
            const modules = Array.isArray(response?.data?.object) ? response.data.object : [];
            setModuleData(modules); // Обновляем только модули
        } catch (error) {
            console.error(error);
            setModuleData([]); // Очистка модулей в случае ошибки
        }
    };
    const GetQuiz = async (moduleID) => {
        setModuleId(moduleID)
        try {
            const response = await axios.get(`/quiz/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    quizModuleId: moduleID
                }
            });
            const quiz = Array.isArray(response?.data?.object) ? response.data.object : [];
            setQuize(quiz); // Обновляем только модули
        } catch (error) {
            console.error(error);
            setQuize([]); // Очистка модулей в случае ошибки
        }
    };


    useEffect(() => {
        getCourse()
    }, [])




    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            <div className="flex items-center justify-between gap-[30px] mb-[30px]">
                {/* Add Select dropdown here */}
                <Select className="bg-[white]" label="Choose a course" onChange={(value) => GetModulesByCourse(value)}>
                    {Array.isArray(courseData) && courseData.map(course => (
                        <Option key={course.id} value={course.id}>
                            {course.name}
                        </Option>
                    ))}
                </Select>
                <Select className="bg-[white]" label="Choose a module" onChange={(value) => GetQuiz(value)}>
                    {Array.isArray(moduleData) && moduleData.map(module => (
                        <Option key={module.id} value={module.id}>
                            {module.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-200">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-[50px]">
                    <h1 className="text-2xl font-semibold text-gray-800">All Quiz</h1>
                    {moduleId !== null && (
                        <button onClick={() => navigate(`/admin/quiz/create/${moduleId}`)} className="bg-[#272C4B] text-white py-2 px-6 rounded-md text-sm font-medium transition-all hover:bg-[#272c4be3]">
                            + Add New Quiz
                        </button>
                    )}
                </div>

                {quize && quize?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Quiestion</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Question type</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quize?.map((course) => (
                                    <tr key={course.id} className="border-t border-t-[2px] cursor-pointer hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{course.question}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{course.quizType}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <button onClick={() => { setEditModal(true); }} className="text-blue-600 text-[25px] hover:text-blue-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path>
                                                </svg>
                                            </button>
                                            <button onClick={() => { setDeleteCourse(true); setItemsData(course?.id) }} className="text-red-600 ml-3 text-[25px] hover:text-red-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
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

                {/* Table Section */}

            </div>
            <QuizDelete refresh={()=>GetQuiz(moduleId)} data={itemsData} isOpen={deleteCourse} onClose={() => setDeleteCourse(false)} />
            {/* <EditModule isOpen={editModal} onClose={() => setEditModal(false)} /> */}
        </div>
    );
}
