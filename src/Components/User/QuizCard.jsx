import { Input, Radio } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import CONFIG from "../../utils/Config";

export default function QuizCard({ quizData, onScoreUpdate, onQuizDataUpdate, testTime, correctAnswers, incorrectAnswers, totalQuestions }) {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [openEndedAnswers, setOpenEndedAnswers] = useState({});
    const [disabledInputs, setDisabledInputs] = useState({});
    const [shuffledQuizData, setShuffledQuizData] = useState([]);

    // Функция для перемешивания массива
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Функция для выбора случайных вопросов
    const getRandomQuestions = (questions, count) => {
        if (questions.length <= count) return shuffleArray([...questions]);
        const shuffled = shuffleArray([...questions]);
        return shuffled.slice(0, count);
    };

    // Перемешиваем вопросы и варианты ответов при первом рендере
    useEffect(() => {
        if (quizData) {
            // Выбираем 30 случайных вопросов (или меньше, если вопросов меньше 30)
            const randomQuestions = getRandomQuestions(quizData, 30);

            // Перемешиваем варианты ответов для каждого вопроса
            const processedQuestions = randomQuestions.map(question => {
                if (question.quizType !== 'OPEN_ENDED' && question.option) {
                    return {
                        ...question,
                        option: shuffleArray(question.option)
                    };
                }
                return question;
            });

            setShuffledQuizData(processedQuestions);
            onQuizDataUpdate(selectedOptions, openEndedAnswers, processedQuestions);
        }
    }, [quizData]);

    useEffect(() => {
        onScoreUpdate(correctAnswers, incorrectAnswers);
        onQuizDataUpdate(selectedOptions, openEndedAnswers, shuffledQuizData);
    }, [correctAnswers, incorrectAnswers, selectedOptions, openEndedAnswers]);

    const handleRadioChange = (event, questionId, correctAnswer) => {
        const selectedValue = event.target.value;
        const isCorrect = selectedValue === correctAnswer;

        setSelectedOptions((prevSelectedOptions) => {
            const updatedOptions = { ...prevSelectedOptions, [questionId]: selectedValue };

            if (isCorrect) {
                onScoreUpdate(correctAnswers + 1, incorrectAnswers - 1);
            } else if (prevSelectedOptions[questionId] === correctAnswer) {
                onScoreUpdate(correctAnswers - 1, incorrectAnswers + 1);
            } else {
                onScoreUpdate(correctAnswers, incorrectAnswers);
            }

            return updatedOptions;
        });
    };

    const handleOpenEndedInput = (questionId, value) => {
        if (!disabledInputs[questionId]) {
            setOpenEndedAnswers(prev => ({
                ...prev,
                [questionId]: value
            }));
        }
    };

    const checkOpenEndedAnswer = (questionId, correctAnswer) => {
        const userAnswer = openEndedAnswers[questionId] || "";
        const normalizedUserAnswer = userAnswer.toLowerCase().replace(/\s/g, "");
        const normalizedCorrectAnswer = correctAnswer.toLowerCase().replace(/\s/g, "");
        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        setOpenEndedAnswers(prev => ({
            ...prev,
            [`${questionId}_checked`]: isCorrect
        }));

        setDisabledInputs(prev => ({
            ...prev,
            [questionId]: true
        }));

        if (isCorrect) {
            onScoreUpdate(correctAnswers + 1, incorrectAnswers - 1);
        }
    };

    const clearOpenEndedAnswer = (questionId, correctAnswer) => {
        const newOpenEndedAnswers = { ...openEndedAnswers };
        const wasCorrect = newOpenEndedAnswers[`${questionId}_checked`];
        delete newOpenEndedAnswers[questionId];
        delete newOpenEndedAnswers[`${questionId}_checked`];
        setOpenEndedAnswers(newOpenEndedAnswers);

        setDisabledInputs(prev => ({
            ...prev,
            [questionId]: false
        }));

        if (wasCorrect) {
            onScoreUpdate(correctAnswers - 1, incorrectAnswers + 1);
        }
    };

    return (
        <div>
            <div className="max-w-[1480px] mx-auto mt-[100px]">
                {shuffledQuizData?.map((i, index) => (
                    <div key={i.id} className="bg-white mt-6 p-6 rounded-lg shadow-lg shadow-gray-200">
                        <h1 className="font-bold text-xl mb-4">Savol №{index + 1}</h1>
                        <h2 className="text-lg mb-6">{i?.question}</h2>

                        {i?.imageId && (
                            <div className="flex items-center justify-start">
                                <img className="w-[600px] " src={CONFIG.API_URL + i.imageId} alt="Question" />
                            </div>
                        )}

                        {i?.audioId && (
                            <div className="flex items-center justify-start">
                                <audio controls className="w-[600px]">
                                    <source src={CONFIG.API_URL + i.audioId} type="audio/mpeg" />
                                </audio>
                            </div>
                        )}

                        {i?.quizType === 'OPEN_ENDED' && (
                            <div className="flex items-center gap-[10px]">
                                <div className="w-[400px]">
                                    <Input
                                        type="text"
                                        label="Javob"
                                        value={openEndedAnswers[i.id] || ''}
                                        onChange={(e) => handleOpenEndedInput(i.id, e.target.value)}
                                        disabled={disabledInputs[i.id]}
                                        className={`w-full ${openEndedAnswers[`${i.id}_checked`] ? 'border-green-500' : ''}`}
                                    />
                                </div>
                                <button
                                    onClick={() => clearOpenEndedAnswer(i.id, i.correctAnswer)}
                                    className="px-[20px] py-[10px] rounded-lg bg-red-500 text-white font-medium 
                                             transition-all duration-300 hover:bg-red-600 active:bg-red-700 
                                             shadow-md hover:shadow-lg focus:outline-none focus:ring-2 
                                             focus:ring-red-400 focus:ring-opacity-50"
                                >
                                    X
                                </button>
                                <button
                                    onClick={() => checkOpenEndedAnswer(i.id, i.correctAnswer)}
                                    disabled={disabledInputs[i.id]}
                                    className="px-[20px] py-[10px] rounded-lg bg-green-500 text-white font-medium 
                                             transition-all duration-300 hover:bg-green-600 active:bg-green-700 
                                             shadow-md hover:shadow-lg focus:outline-none focus:ring-2 
                                             focus:ring-green-400 text-[20px] focus:ring-opacity-50 disabled:opacity-50 
                                             disabled:cursor-not-allowed"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"></path>
                                    </svg>
                                </button>
                            </div>
                        )}

                        {i?.quizType !== 'OPEN_ENDED' && (
                            <div className="flex flex-col gap-4">
                                {i?.option?.map((opt, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-3">
                                        <Radio
                                            id={`option-${optIndex}-${index}`}
                                            name={`question-${index}`}
                                            value={opt}
                                            checked={selectedOptions[i.id] === opt}
                                            onChange={(event) => handleRadioChange(event, i.id, i.correctAnswer)}
                                            color="lightBlue"
                                            className="text-lightBlue-500 hover:text-blue-700 focus:ring-blue-500"
                                        />
                                        <label htmlFor={`option-${optIndex}-${index}`} className="text-gray-700 text-lg">
                                            {opt}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}