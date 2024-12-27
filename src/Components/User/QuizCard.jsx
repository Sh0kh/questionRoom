import { Radio } from "@material-tailwind/react";
import axios from "axios";
import CONFIG from "../../utils/Config";
import { useState, useEffect } from "react";

export default function QuizCard({ quizData, onScoreUpdate }) {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);

    useEffect(() => {
        // Передаем значения в отцовский компонент при изменении
        onScoreUpdate(correctAnswers, incorrectAnswers);
    }, [correctAnswers, incorrectAnswers, onScoreUpdate]);

    const handleRadioChange = (event, questionId, correctAnswer) => {
        const selectedValue = event.target.value;

        if (selectedOptions[questionId] !== selectedValue) {
            if (selectedValue === correctAnswer) {
                setCorrectAnswers((prev) => prev + 1);
                if (selectedOptions[questionId] && selectedOptions[questionId] !== correctAnswer) {
                    setIncorrectAnswers((prev) => prev - 1);
                }
            } else {
                setIncorrectAnswers((prev) => Math.min(prev + 1, quizData.length - correctAnswers));
                if (selectedOptions[questionId] === correctAnswer) {
                    setCorrectAnswers((prev) => prev - 1);
                }
            }

            setSelectedOptions((prevSelectedOptions) => ({
                ...prevSelectedOptions,
                [questionId]: selectedValue,
            }));
        }
    };



    return (
        <div className="max-w-[1480px] mx-auto">
            {quizData?.map((i, index) => (
                <div key={i.id} className="bg-white mt-6 p-6 rounded-lg shadow-lg shadow-gray-200">
                    <h1 className="font-bold text-xl mb-4">
                        Question №{index + 1}
                    </h1>
                    <h2 className="text-lg mb-6">
                        {i?.question}
                    </h2>
                    {i?.imageId !== null && (
                        <div className="flex items-center justify-center">
                            <img className="w-[600px] mx-a" src={CONFIG.API_URL + i?.imageId} />
                        </div>
                    )}
                    {i?.audioId !== null && (
                        <div className="flex items-center justify-center">
                            <audio controls className="w-[600px] mx-auto">
                                <source src={CONFIG.API_URL + i?.audioId} type="audio/mpeg" />
                            </audio>
                        </div>
                    )}

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
                </div>
            ))}
        </div>
    );
}
