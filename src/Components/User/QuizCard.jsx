import { Input, Radio } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import CONFIG from "../../utils/Config";

export default function QuizCard({ quizData, onScoreUpdate }) {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [openEndedAnswers, setOpenEndedAnswers] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(quizData.length);
    const [disabledInputs, setDisabledInputs] = useState({});

    useEffect(() => {
        const answeredCount = Object.keys(selectedOptions).length + Object.keys(openEndedAnswers).length;
        const unansweredCount = quizData.length - answeredCount;
        setIncorrectAnswers(unansweredCount + (quizData.length - correctAnswers - unansweredCount));

        onScoreUpdate(correctAnswers, incorrectAnswers);
    }, [selectedOptions, openEndedAnswers, correctAnswers, onScoreUpdate]);

    const handleRadioChange = (event, questionId, correctAnswer) => {
        const selectedValue = event.target.value;

        setSelectedOptions((prevSelectedOptions) => {
            const updatedOptions = { ...prevSelectedOptions, [questionId]: selectedValue };
            updateCorrectAnswersCount(updatedOptions, openEndedAnswers);
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

        updateCorrectAnswersCount(selectedOptions, {
            ...openEndedAnswers,
            [`${questionId}_checked`]: isCorrect
        });
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

        updateCorrectAnswersCount(selectedOptions, newOpenEndedAnswers);
    };

    const updateCorrectAnswersCount = (radioAnswers, openAnswers) => {
        let newCorrect = 0;

        quizData.forEach((q) => {
            if (q.quizType === 'OPEN_ENDED') {
                if (openAnswers[`${q.id}_checked`]) {
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
            {quizData?.map((i, index) => (
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
    );
}