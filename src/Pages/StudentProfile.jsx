import axios from "axios"
import { useEffect, useState } from "react"
import ReactLoading from 'react-loading';
import { NavLink, useLocation, useParams } from "react-router-dom"

export default function StudentProfile() {

    const { id } = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const firstName = queryParams.get("firstName");
    const lastName = queryParams.get("lastName");

    const getSudent = async () => {
        try {
            const response = await axios.get(`/result/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    studentId: id
                }
            })
            setData(response?.data?.object)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSudent()
    }, [])

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            <div className="w-full bg-[white] shadow-md p-[20px] rounded-[10px] mb-[30px]">
                <h1 className="text-[25px]">
                    {firstName} {lastName}
                </h1>
            </div>
            {data && data.length > 0 ? (
                <div className="flex flex-col gap-6 mt-6">
                    {data.map((i, index) => (
                        <NavLink to={`/admin/result/detail/${i?.resultId}`} >
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
    )
}