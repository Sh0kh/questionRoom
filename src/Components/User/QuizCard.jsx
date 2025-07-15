import { Input, Radio, Textarea } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from "axios";
import CONFIG from "../../utils/Config";
import { useNavigate } from "react-router-dom";

export default function QuizCard({ quizData, onScoreUpdate }) {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [openEndedAnswers, setOpenEndedAnswers] = useState({});
    const [aiAnswers, setAiAnswers] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(quizData.length);
    const [disabledInputs, setDisabledInputs] = useState({});
    const [aiLoading, setAiLoading] = useState({});
    const [shuffledQuizData, setShuffledQuizData] = useState([]);
    const navigate = useNavigate();

    // Функция для перемешивания массива
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Перемешиваем вопросы и варианты ответов при первом рендере
    useEffect(() => {
        if (quizData) {
            const shuffled = quizData.map(question => {
                if (question.quizType !== 'OPEN_ENDED' && question.quizType !== 'AI' && question.option) {
                    return {
                        ...question,
                        option: shuffleArray(question.option)
                    };
                }
                return question;
            });
            setShuffledQuizData(shuffleArray(shuffled));
        }
    }, [quizData]);

    useEffect(() => {
        const answeredCount = Object.keys(selectedOptions).length + Object.keys(openEndedAnswers).length + Object.keys(aiAnswers).length;
        const unansweredCount = shuffledQuizData.length - answeredCount;
        setIncorrectAnswers(unansweredCount + (shuffledQuizData.length - correctAnswers - unansweredCount));

        onScoreUpdate(correctAnswers, incorrectAnswers);
    }, [selectedOptions, openEndedAnswers, aiAnswers, correctAnswers, onScoreUpdate, shuffledQuizData]);

    const handleRadioChange = (event, questionId, correctAnswer) => {
        const selectedValue = event.target.value;

        setSelectedOptions((prevSelectedOptions) => {
            const updatedOptions = { ...prevSelectedOptions, [questionId]: selectedValue };
            updateCorrectAnswersCount(updatedOptions, openEndedAnswers, aiAnswers);
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

    const handleAiInput = (questionId, value) => {
        if (!disabledInputs[questionId]) {
            setAiAnswers(prev => ({
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

        updateCorrectAnswersCount(selectedOptions, {
            ...openEndedAnswers,
            [`${questionId}_checked`]: isCorrect
        }, aiAnswers);
    };

    const checkAiAnswer = async (questionId) => {
        const userAnswer = aiAnswers[questionId] || "";
        if (!userAnswer.trim()) return;

        setAiLoading(prev => ({ ...prev, [questionId]: true }));

        try {
            const studentId = localStorage.getItem('userId');

            // Первый запрос: проверка ответа
            const response = await axios.get(
                '/result/ai/checkUserStudentAnswer',
                {
                    params: {
                        answer: userAnswer,
                        quizId: questionId,
                        studentId: studentId
                    }
                }
            );

            const result = response.data;

            // Вспомогательная функция для парсинга полей из object
            const extractField = (text, label) => {
                const regex = new RegExp(`${label}:\\s*([^\\n]+)`, 'i');
                const match = text.match(regex);
                return match ? match[1].trim() : '';
            };

            let CEFRLevel = '';
            let coherence = '';
            let grammarAccuracy = '';
            let sentenceComplexity = '';
            let vocabularyRichness = '';

            if (result.object) {
                CEFRLevel = (() => {
                    const match = result.object.match(/Umumiy daraja[:\s]*(.*)/i);
                    return match ? match[1].trim() : '';
                })();
                coherence = extractField(result.object, "Fikr oqimi");
                grammarAccuracy = extractField(result.object, "Grammatik to'g'rilik");
                sentenceComplexity = extractField(result.object, "Sintaksis");
                vocabularyRichness = extractField(result.object, "Lug'at boyligi");
            }

            await axios.post('/result/ai/create', null, {
                params: {
                    CEFRLevel: CEFRLevel || result.CEFRLevel || 3,
                    coherence: coherence || result.coherence || '',
                    grammarAccuracy: grammarAccuracy || result.grammarAccuracy || '',
                    id: result.id || questionId,
                    quizId: questionId,
                    sentenceComplexity: sentenceComplexity || result.sentenceComplexity || '',
                    studentId: studentId,
                    vocabularyRichness: vocabularyRichness || result.vocabularyRichness || ''
                }
            });

            // После успешного сохранения AI-результата — закрыть тест и перейти на страницу результата
            await axios.post('/result/close', {}, {
                params: { studentId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            localStorage.removeItem('courseId');
            navigate('/result');

            const isCorrect = result.isCorrect || result.score > 0.5;

            setAiAnswers(prev => ({
                ...prev,
                [`${questionId}_checked`]: isCorrect,
                [`${questionId}_result`]: result
            }));

            setDisabledInputs(prev => ({
                ...prev,
                [questionId]: true
            }));

            updateCorrectAnswersCount(selectedOptions, openEndedAnswers, {
                ...aiAnswers,
                [`${questionId}_checked`]: isCorrect
            });

        } catch (error) {
            console.error('Ошибка при проверке AI ответа:', error);
        } finally {
            setAiLoading(prev => ({ ...prev, [questionId]: false }));
        }
    };

    const clearOpenEndedAnswer = (questionId) => {
        const newOpenEndedAnswers = { ...openEndedAnswers };
        delete newOpenEndedAnswers[questionId];
        delete newOpenEndedAnswers[`${questionId}_checked`];
        setOpenEndedAnswers(newOpenEndedAnswers);

        setDisabledInputs(prev => ({
            ...prev,
            [questionId]: false
        }));

        updateCorrectAnswersCount(selectedOptions, newOpenEndedAnswers, aiAnswers);
    };

    const clearAiAnswer = (questionId) => {
        const newAiAnswers = { ...aiAnswers };
        delete newAiAnswers[questionId];
        delete newAiAnswers[`${questionId}_checked`];
        delete newAiAnswers[`${questionId}_result`];
        setAiAnswers(newAiAnswers);

        setDisabledInputs(prev => ({
            ...prev,
            [questionId]: false
        }));

        updateCorrectAnswersCount(selectedOptions, openEndedAnswers, newAiAnswers);
    };

    const updateCorrectAnswersCount = (radioAnswers, openAnswers, aiAnswersData) => {
        let newCorrect = 0;

        shuffledQuizData.forEach((q) => {
            if (q.quizType === 'OPEN_ENDED') {
                if (openAnswers[`${q.id}_checked`]) {
                    newCorrect++;
                }
            } else if (q.quizType === 'AI') {
                if (aiAnswersData[`${q.id}_checked`]) {
                    newCorrect++;
                }
            } else {
                if (radioAnswers[q.id] === q.correctAnswer) {
                    newCorrect++;
                }
            }
        });

        setCorrectAnswers(newCorrect);
    };

    return (
        <div className="max-w-[1480px] mx-auto">
            {shuffledQuizData?.map((i, index) => (
                <div key={i.id} className="bg-white mt-6 p-6 rounded-lg shadow-lg shadow-gray-200">
                    <h1 className="font-bold text-xl mb-4">Savol №{index + 1}</h1>
                    <h2 className="text-lg mb-6">{i?.question}</h2>

                    {i?.imageId && (
                        <div className="flex items-center justify-center">
                            <img className="w-[600px] mx-auto" src={CONFIG.API_URL + i.imageId} alt="Question" />
                        </div>
                    )}

                    {i?.audioId && (
                        <div className="flex items-center justify-center">
                            <audio controls className="w-[600px] mx-auto">
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
                                    className={`w-full ${openEndedAnswers[`${i.id}_checked`] ? 'border-green-500' : ''
                                        }`}
                                />
                            </div>
                            <button
                                onClick={() => clearOpenEndedAnswer(i.id)}
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"></path></svg>
                            </button>
                        </div>
                    )}

                    {i?.quizType === 'AI' && (
                        <div className="flex flex-col gap-[10px]">
                            <div className="w-full">
                                <Textarea
                                    label="Javobingizni yozing..."
                                    value={aiAnswers[i.id] || ''}
                                    onChange={(e) => handleAiInput(i.id, e.target.value)}
                                    disabled={disabledInputs[i.id]}
                                    rows={6}
                                    className={`w-full ${aiAnswers[`${i.id}_checked`] ? 'border-green-500' : ''
                                        }`}
                                />
                            </div>
                            <div className="flex items-center gap-[10px]">

                                <button
                                    onClick={() => checkAiAnswer(i.id)}
                                    disabled={disabledInputs[i.id] || aiLoading[i.id] || !aiAnswers[i.id]?.trim()}
                                    className="px-[20px] py-[10px] rounded-lg bg-blue-500 text-white font-medium 
                                             transition-all duration-300 hover:bg-blue-600 active:bg-blue-700 
                                             shadow-md hover:shadow-lg focus:outline-none focus:ring-2 
                                             focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 
                                             disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {aiLoading[i.id] ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Tekshirilmoqda...
                                        </>
                                    ) : (
                                        'Tekshirish'
                                    )}
                                </button>
                            </div>
                            {aiAnswers[`${i.id}_result`] && (
                                <div className={`mt-2 p-3 rounded-lg ${aiAnswers[`${i.id}_checked`] ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                                    }`}>
                                    <p className={`font-medium ${aiAnswers[`${i.id}_checked`] ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                        {aiAnswers[`${i.id}_checked`] ? 'To\'g\'ri javob!' : 'Noto\'g\'ri javob!'}
                                    </p>
                                    {aiAnswers[`${i.id}_result`].feedback && (
                                        <p className="mt-1 text-gray-700">
                                            {aiAnswers[`${i.id}_result`].feedback}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {i?.quizType !== 'OPEN_ENDED' && i?.quizType !== 'AI' && (
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
    );
}