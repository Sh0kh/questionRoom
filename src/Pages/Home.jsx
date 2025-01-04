import axios from "axios";
import Header from "../Components/User/Header";
import WarningModal from "../Components/WarningModal";
import { useEffect, useState } from "react";
import QuizCard from "../Components/User/QuizCard";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import ReactLoading from 'react-loading';



export default function Home() {

    const userId = localStorage.getItem('userId')
    const courseId = localStorage.getItem('courseId')
    const [userData, setUserData] = useState()
    const [courseData, setCourseData] = useState('')
    const [quizData, setQuizData] = useState([])
    const [time, setTime] = useState(null)
    const moduleId = useSelector((state) => state.counter.moduleId); // Получаем moduleId из Redux
    const count = useSelector((state) => state.counter.value); // Получаем значение счетчика из Redux
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)



    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);

    const handleScoreUpdate = (correct, incorrect) => {
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
    };




    const getStudent = async () => {
        try {
            const response = await axios.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            setUserData(response?.data?.object)
        } catch (error) {
            console.log(error)
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        }
    }

    const getModule = async () => {
        try {
            const response = await axios.get(`/module/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    courseId: courseId
                }
            })
            setCourseData(response?.data?.object)
            setTime(response?.data?.object[moduleId]?.testTimeMinute)
        } catch (error) {
            console.log(error)
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
            setCourseData(false)
        } finally {
            setLoading(false)
        }
    }

    const getQuestion = async () => {
        try {
            const response = await axios.get(`/quiz/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    quizModuleId: courseData[moduleId]?.id
                }
            })

            setQuizData(response?.data?.object)
        } catch (error) {
            console.log(error)
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        }
    }

    useEffect(() => {
        getStudent()
        getModule()

        // Add event listener for page unload (refresh or navigate away)
        const handleBeforeUnload = (event) => {
            const message = "Are you sure you want to leave? Your progress might not be saved.";
            event.returnValue = message; // Standard for most browsers
            return message; // Some browsers might require this
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [moduleId]);

    useEffect(() => {
        // Now getQuestion is called only after receiving courseData
        if (courseData?.length > 0) {
            getQuestion();
        }
    }, [courseData, moduleId]); // Dependency on courseData

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    if (courseData === false) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-[30px]">
                <div className="bg-[white] rounded-[20px] w-[100%] flex items-center justify-center h-[500px]">
                    <div>
                        <h1 className="text-[25px]">
                            Test tugatilgan
                        </h1>
                        <NavLink className={'text-center mt-[22px] underline block'} to={'/login'}>
                            Loginga qaytish
                        </NavLink>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-[50px] relative h-[100%] bg-cover bg-center bg-no-repeat" >
            <WarningModal />
            <Header currectAnswer={correctAnswers} incorrectAnswer={incorrectAnswers} data={userData} moduleData={courseData} time={time} module={courseData[moduleId]} />
            <QuizCard onScoreUpdate={handleScoreUpdate} quizData={quizData} />
        </div>
    );
}
