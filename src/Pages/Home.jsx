import axios from "axios";
import Header from "../Components/User/Header";
import WarningModal from "../Components/WarningModal";
import { useEffect, useState } from "react";
import QuizCard from "../Components/User/QuizCard";
import { NavLink, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import FinishModal from "../Components/FinishModal";

export default function Home() {
    const testId = localStorage.getItem("testId");
    const [startExam, setStartExam] = useState(false);
    const [hasShownModal, setHasShownModal] = useState(false);
    const [Test, setTest] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [openEndedAnswers, setOpenEndedAnswers] = useState({});
    const [shuffledQuizData, setShuffledQuizData] = useState([]);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);

    const getTest = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/test/get/by/id/for/test`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { id: testId },
            });

            const test = response?.data?.object;
            setTest(test);

            const seconds = (test?.testTime || 0) * 60;
            setTimeLeft(seconds);

            setTotalQuestions(Math.min(test?.quiz?.length || 0, 30));
            setIncorrectAnswers(Math.min(test?.quiz?.length || 0, 30));
        } catch (error) {
            console.log(error);
            if (error?.status === 401) {
                navigate("/login");
                localStorage.clear();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleScoreUpdate = (correct, incorrect) => {
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
    };

    const handleQuizDataUpdate = (selectedOpts, openEndedAns, shuffledData) => {
        setSelectedOptions(selectedOpts);
        setOpenEndedAnswers(openEndedAns);
        setShuffledQuizData(shuffledData);
    };

    useEffect(() => {
        if (startExam) {
            getTest();
        }
    }, [startExam]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleFinishTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, navigate]);

    const handleFinishTest = async () => {
        try {
            const studentId = localStorage.getItem('userId');

            // Подготавливаем данные для отправки
            const correctAnswerQuizIds = [];
            const wrongAnswerQuizIds = [];

            // Проверяем, ответил ли пользователь хотя бы на один вопрос
            const hasAnsweredAnyQuestion = Object.keys(selectedOptions).length > 0 ||
                Object.keys(openEndedAnswers).length > 0;

            // Если пользователь не ответил ни на один вопрос, помечаем все вопросы как неправильные
            if (!hasAnsweredAnyQuestion) {
                shuffledQuizData.forEach(question => {
                    wrongAnswerQuizIds.push({
                        quizId: question.id,
                        wrongAnswer: "No answer"
                    });
                });
            } else {
                // Обычная логика проверки ответов
                shuffledQuizData.forEach(question => {
                    if (question.quizType === 'OPEN_ENDED') {
                        const userAnswer = openEndedAnswers[question.id] || "";
                        const normalizedUserAnswer = userAnswer.toLowerCase().replace(/\s/g, "");
                        const normalizedCorrectAnswer = question.correctAnswer.toLowerCase().replace(/\s/g, "");

                        if (normalizedUserAnswer === normalizedCorrectAnswer) {
                            correctAnswerQuizIds.push(question.id);
                        } else {
                            wrongAnswerQuizIds.push({
                                quizId: question.id,
                                wrongAnswer: userAnswer || "No answer"
                            });
                        }
                    } else {
                        const userAnswer = selectedOptions[question.id];

                        if (userAnswer === question.correctAnswer) {
                            correctAnswerQuizIds.push(question.id);
                        } else {
                            wrongAnswerQuizIds.push({
                                quizId: question.id,
                                wrongAnswer: userAnswer || "No answer"
                            });
                        }
                    }
                });
            }

            const requestData = {
                correctAnswerCount: correctAnswerQuizIds.length,
                correctAnswerQuizIds: correctAnswerQuizIds,
                wrongAnswerCount: wrongAnswerQuizIds.length,
                wrongAnswerQuizIds: wrongAnswerQuizIds,
                studentId: parseInt(studentId),
                testId: parseInt(testId),
                isTelegram: Test?.isTelegram || false
            };

            // Отправляем результаты на сервер
            await axios.post('/result/create', requestData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            Swal.fire({
                title: "Test tugadi!",
                text: "Natijangiz saqlandi.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/result");
            });

        } catch (error) {
            console.error('Xatolik test natijalarini yuborishda:', error);
            Swal.fire({
                title: "Xatolik",
                text: "Natijalarni saqlashda xatolik yuz berdi.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    if (!hasShownModal) {
        return (
            <WarningModal
                startExam={() => {
                    setStartExam(true);
                    setHasShownModal(true);
                }}
            />
        );
    }

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

    if (Test === false) {
        return (
            <div className="h-screen w-full flex items-center justify-center p-[30px]">
                <div className="bg-white rounded-[20px] w-full flex items-center justify-center h-[500px]">
                    <div>
                        <h1 className="text-[25px]">Test tugatilgan</h1>
                        <NavLink
                            className="text-center mt-[22px] underline block"
                            to="/login"
                        >
                            Loginga qaytish
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-[50px] relative h-full bg-cover bg-center bg-no-repeat">
            <Header setOpenModal={setOpenModal} timeLeft={timeLeft} />
            <QuizCard
                quizData={Test?.quiz}
                onScoreUpdate={handleScoreUpdate}
                onQuizDataUpdate={handleQuizDataUpdate}
                testTime={Test?.testTime}
                correctAnswers={correctAnswers}
                incorrectAnswers={incorrectAnswers}
                totalQuestions={totalQuestions}
            />
            <FinishModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleFinishTest}
            />
        </div>
    );
}