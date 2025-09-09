import axios from "axios";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Button } from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";

export default function ErrorPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getResult = async () => {
        try {
            const response = await axios.get(`/result/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: {
                    studentId: localStorage.getItem("userId"),
                },
            });
            setData(response?.data?.object || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getResult();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading
                    type="spinningBubbles"
                    color="#000"
                    height={100}
                    width={100}
                />
            </div>
        );
    }

    return (
        <div className="Error w-full min-h-screen p-6 bg-gray-100 pb-[200px]">
            <div className="flex items-center justify-between">
                <h1 className="text-center text-[30px] font-bold">Natijalar</h1>
                <Button
                    color="gray"
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                    className="bg-black text-white hover:bg-gray-800"
                >
                    Qayta boshlash
                </Button>
            </div>

            {data && data.length > 0 ? (
                <div className="flex flex-col gap-6 mt-6">
                    {data.map((i, index) => (
                        <NavLink to={`/result/${i?.resultId}`} >
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-xl p-5 w-full"
                            >
                                <h2 className="text-lg font-bold text-gray-800 mb-3">
                                    Test nomi: {i.testEntity?.name}
                                </h2>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <span className="font-semibold">To‘g‘ri javoblar:</span>{" "}
                                        {i.correctAnswerCount}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Noto‘g‘ri javoblar:</span>{" "}
                                        {i.wrongAnswerCount}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Umumiy savollar:</span>{" "}
                                        {i.testEntity?.testCount}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Yaratilgan sana:</span>{" "}
                                        {i.testEntity?.createdAt.split("T")[0]}
                                    </p>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            ) : (
                <div className="bg-white w-full mt-6 h-[200px] flex items-center justify-center rounded-lg shadow">
                    <h1 className="text-gray-600">Ma'lumot yo‘q</h1>
                </div>
            )}
        </div>
    );
}
