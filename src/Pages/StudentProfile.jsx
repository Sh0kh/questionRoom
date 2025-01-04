import axios from "axios"
import { useEffect, useState } from "react"
import ReactLoading from 'react-loading';
import { useLocation, useParams } from "react-router-dom"

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
            <div className="w-full bg-[white] p-[20px] rounded-[10px] mb-[30px]">
                <h1 className="text-[25px]">
                    {firstName} {lastName}
                </h1>
            </div>
            {data && data?.length > 0 ? (
                <div className="flex items-center gap-[30px] flex-wrap">
                    {data?.map((i, index) => (
                        <div key={index} className="cursor-pointer w-full max-w-[350px] bg-white shadow-lg p-6 rounded-2xl mb-6 border border-gray-200">
                            <h1 className="text-lg font-bold text-gray-800 mb-4">{`Kurs: ${i.courseName}`}</h1>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">Modul:</span> {i.moduleName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">Talaba ID:</span> {i.entity.studentId}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">To'g'ri javoblar:</span> {i.entity.correctAnswer}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">Noto'g'ri javoblar:</span> {i.entity.wrongAnswer}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">Yaratilgan sana:</span>{" "}
                                    {i.entity.createdAt.split("T")[0]}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">To'g'ri javoblar foizi:</span>{" "}
                                    {Math.round((i.entity.correctAnswer / (i.entity.correctAnswer + i.entity.wrongAnswer)) * 100)}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[400px] rounded-[30px] bg-[white] flex items-center justify-center">
                    <h1>
                        Ma'lumot yoq
                    </h1>
                </div>
            )}
        </div>
    )
}