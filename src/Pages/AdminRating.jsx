import React, { useEffect, useState } from "react";


// Import the Select component from Material Tailwind
import { Select, Option } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuizDelete from "../Components/AdminQuiz/QuizDelete";
import QuestionEdit from "../Components/AdminQuiz/QuestionEdit";

export default function AdminRating() {
    const navigate = useNavigate()
    // Fake course data
    const [createModal, setCreateModal] = useState(false)
    const [deleteCourse, setDeleteCourse] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [courseData, setCourseData] = useState([])
    const [moduleData, setModuleData] = useState([])
    const [rating, setRating] = useState([])
    const [moduleId, setModuleId] = useState(null)
    const [itemsData, setItemsData] = useState(null)
    const [EditData, setEditData] = useState(null)



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
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
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
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        }
    };
    const getRating = async (moduleID) => {
        setModuleId(moduleID)
        try {
            const response = await axios.get(`/result/get/rating`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    moduleId: moduleID
                }
            });
            console.log(response)
            const rat = Array.isArray(response?.data?.object) ? response.data.object : [];
            setRating(rat);
        } catch (error) {
            console.error(error);
            setRating([]); // Очистка модулей в случае ошибки
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        }
    };

    console.log(rating)


    useEffect(() => {
        getCourse()
    }, [])






    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            <div className="flex items-center justify-between gap-[30px] mb-[30px]">
                {/* Add Select dropdown here */}
                <Select className="bg-[white]" label="Kurs" onChange={(value) => GetModulesByCourse(value)}>
                    {Array.isArray(courseData) && courseData.map(course => (
                        <Option key={course.id} value={course.id}>
                            {course.name}
                        </Option>
                    ))}
                </Select>
                <Select className="bg-[white]" label="Modul" onChange={(value) => getRating(value)}>
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
                    <h1 className="text-2xl font-semibold text-gray-800">Reyting</h1>
                </div>

                {rating && rating?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">№</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Ism Familiya</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Urinishlar soni</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Natija %</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Savolar soni</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">To'g'ri javob</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Xato javob</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rating?.map((i, index) => (
                                    <tr key={index.id} className="border-t border-t-[2px] cursor-pointer text-center hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{index + 1}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i.studentName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i.attemptsCount}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i.correctPercent}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                            30
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                            {i?.correctAnswer}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                            {i?.wrongAnswer}
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
                {/* Table Section */}

            </div>
            <QuizDelete refresh={() => GetQuiz(moduleId)} data={itemsData} isOpen={deleteCourse} onClose={() => setDeleteCourse(false)} />
            <QuestionEdit data={EditData} isOpen={editModal} onClose={() => setEditModal(false)} />
            {/* <EditModule isOpen={editModal} onClose={() => setEditModal(false)} /> */}
        </div>
    );
}
