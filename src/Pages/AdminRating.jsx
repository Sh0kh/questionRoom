import React, { useEffect, useState } from "react";
import { Select, Option, Button, Input } from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import QuizDelete from "../Components/AdminQuiz/QuizDelete";
import QuestionEdit from "../Components/AdminQuiz/QuestionEdit";

export default function AdminRating() {
    const navigate = useNavigate();
    const [testData, setTestData] = useState([]);
    const [rating, setRating] = useState([]);

    const [testId, setTestId] = useState(null);
    const [itemsData, setItemsData] = useState(null);
    const [EditData, setEditData] = useState(null);

    // Диапазон дат (по умолчанию текущий месяц)
    const getMonthRange = () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            start: startDate.toISOString().split("T")[0], // YYYY-MM-DD
            end: endDate.toISOString().split("T")[0],
        };
    };

    const [start, setStart] = useState(getMonthRange().start);
    const [end, setEnd] = useState(getMonthRange().end);

    // Получить тесты
    const getAllTest = async () => {
        try {
            const response = await axios.get(`/test/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTestData(response?.data?.object || []);
        } catch (error) {
            console.log(error);
        }
    };

    // Получить рейтинг
    const getRating = async () => {
        try {
            const response = await axios.get(`/result/get/rating`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                params: {
                    start: new Date(start).getTime(),
                    end: new Date(end).getTime(),
                    testId,
                },
            });
            const rat = Array.isArray(response?.data?.object)
                ? response.data.object
                : [];
            setRating(rat);
        } catch (error) {
            console.error(error);
            setRating([]);
            if (error?.status === 401) {
                navigate("/login");
                localStorage.clear();
            }
        }
    };

    useEffect(() => {
        getAllTest();
    }, []);

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            {/* Фильтры */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Выбор теста */}
                <Select
                    className="bg-white"
                    label="Test tanlash"
                    onChange={(value) => setTestId(value)}
                >
                    {testData?.map((test) => (
                        <Option key={test.id} value={test.id}>
                            {test.name}
                        </Option>
                    ))}
                </Select>

                {/* Дата start */}
                <Input
                    type="date"
                    label="Boshlanish sanasi"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="bg-white"
                />

                {/* Дата end */}
                <Input
                    type="date"
                    label="Tugash sanasi"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="bg-white"
                />

                {/* Кнопка */}
                <Button
                    color="blue"
                    onClick={getRating}
                    disabled={!testId}
                >
                    Filterlash
                </Button>
            </div>

            {/* Таблица */}
            <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Reyting</h1>
                </div>

                {rating?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">№</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Ism Familiya</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Tel</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Urinishlar soni</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Natija %</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Savollar soni</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">To'g'ri javob</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Xato javob</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rating?.map((i, index) => (
                                    <tr
                                        key={i.studentId}
                                        className="border-t border-t-[2px] cursor-pointer text-center hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{index + 1}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                            <NavLink
                                                className="underline"
                                                to={`/admin/student/${i?.studentId}?firstName=${i.studentName}`}
                                            >
                                                {i.studentName}
                                            </NavLink>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i.studentPhone}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i.attemptsCount}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i.correctPercent}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">30</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i?.correctAnswer}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-center">{i?.wrongAnswer}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <h1>Ma'lumot yo'q</h1>
                    </div>
                )}
            </div>

            {/* Модалки */}
            <QuizDelete
                refresh={() => { }}
                data={itemsData}
                isOpen={false}
                onClose={() => { }}
            />
            <QuestionEdit data={EditData} isOpen={false} onClose={() => { }} />
        </div>
    );
}
