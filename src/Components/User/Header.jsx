import { useState, useEffect } from "react";
import FinishModal from "./FinishModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header({ currectAnswer, incorrectAnswer, data, moduleData, time, module }) {
    const [countdown, setCountdown] = useState(Number(time) * 60); // If time is in minutes, convert to seconds
    const [isTimeRunning, setIsTimeRunning] = useState(true); // Timer is running
    const [showFinishButton, setShowFinishButton] = useState(false); // "Finish" button
    const [finishModal, setFinishModal] = useState(false)

    const navigate = useNavigate()




    const CloseTest = async () => {
        try {
            await axios.post('/result/close', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    studentId: localStorage.getItem('userId')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        let timer;
        if (countdown > 0 && isTimeRunning) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        setIsTimeRunning(false);
                        setShowFinishButton(true); // Show finish button
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, [countdown, isTimeRunning]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`; // Format to "mm:ss"
    };

    useEffect(() => {
        if (time === undefined || time === null || countdown === 0) {
            navigate('/result')
            CloseTest()
            localStorage.removeItem('courseId')
        }
        setCountdown(Number(time) * 60);
    }, [time, countdown]);

    


    return (
        <>
            <div className="Header z-20 w-[97%] rounded-[10px] bg-[white] p-[20px] fixed shadow-lg shadow-gray-200 top-[10px] left-[20px]">
                <div className="flex items-center justify-between">
                    <h1 className="text-[20px]">
                        {data?.firstName} {data?.lastName}
                    </h1>
                    <h1 className="font- text-[22px]">
                        {formatTime(countdown)} {/* Display the countdown in "mm:ss" */}
                    </h1>
                    <div className="flex items-center gap-[20px]">
                        <button onClick={() => setFinishModal(true)} className="bg-[red] text-[white] px-[20px] py-[10px] rounded-[5px] border-[2px] border-[red] duration-500 hover:bg-transparent hover:text-[red]">
                            Tugatish
                        </button>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-[1480px] p-[20px] mt-[120px] rounded-[5px] bg-[white] shadow-lg shadow-gray-200">
                <div className="flex items-center gap-[10px]">
                    {Array.isArray(moduleData) &&
                        moduleData.map((i, index) => {
                            const isActive = module && (module.id === i.id); // Compare name or id
                            return (
                                <button
                                    key={index}
                                    className={`px-[20px] py-[10px] border-[2px] duration-500 rounded-[10px] border-blue-500
                                        ${isActive ? 'bg-transparent text-blue-500' : 'border-blue-500 text-[white] bg-blue-500'}`}
                                >
                                    {i?.name}
                                </button>
                            );
                        })}
                </div>
            </div>
            <FinishModal currectAnswer={currectAnswer} incorrectAnswer={incorrectAnswer} time={time} moduleId={module?.id} isOpen={finishModal} onClose={() => setFinishModal(false)} />
        </>
    );
}
