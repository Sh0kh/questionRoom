import axios from "axios"
import { useEffect, useState } from "react"
import ReactLoading from 'react-loading';
import { useLocation, useParams } from "react-router-dom"

export default function StudentProfile() {

    const { id } = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [aiData, setAiData] = useState([])
    const [aiLoading, setAiLoading] = useState(true)
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

    const getAiResults = async () => {
        try {
            const response = await axios.get(`/result/ai/getAllByStudent`, {
                params: {
                    studentId: id
                }
            });
            setAiData(response?.data?.object || []);
        } catch (error) {
            setAiData([]);
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        getSudent()
        getAiResults()
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

            {/* AI natijalari blok */}
            <div className="mt-[40px]">
                <h2 className="text-center text-[24px] font-bold mb-4">AI natijalari</h2>
                {aiLoading ? (
                    <div className="flex items-center justify-center">
                        <ReactLoading type="spinningBubbles" color="#000" height={60} width={60} />
                    </div>
                ) : aiData && aiData.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {aiData.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4">
                                <div className="mb-2 text-gray-700">
                                    <span className="font-semibold">Quiz ID:</span> {item.quizId}
                                </div>
                                <div className="mb-2 text-gray-700">
                                    <span className="font-semibold">CEFR Level:</span> {item.cefrlevel}
                                </div>
                                {item.vocabularyRichness && (
                                    <div className="mb-2 text-gray-700">
                                        <span className="font-semibold">Lug'at boyligi:</span> {item.vocabularyRichness}
                                    </div>
                                )}
                                {item.sentenceComplexity && (
                                    <div className="mb-2 text-gray-700">
                                        <span className="font-semibold">Sintaksis:</span> {item.sentenceComplexity}
                                    </div>
                                )}
                                {item.grammarAccuracy && (
                                    <div className="mb-2 text-gray-700">
                                        <span className="font-semibold">Grammatik to'g'rilik:</span> {item.grammarAccuracy}
                                    </div>
                                )}
                                {item.coherence && (
                                    <div className="mb-2 text-gray-700">
                                        <span className="font-semibold">Fikr oqimi:</span> {item.coherence}
                                    </div>
                                )}
                                <div className="mb-2 text-gray-700">
                                    <span className="font-semibold">Yaratilgan sana:</span> {item.createdAt.split("T")[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                        AI natijalari yo'q
                    </div>
                )}
            </div>
        </div>
    )
}