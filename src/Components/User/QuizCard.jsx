import { Radio } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import CONFIG from "../../utils/Config";

export default function QuizCard({ quizData, onScoreUpdate }) {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(quizData.length); // Изначально все ошибки

    useEffect(() => {
        // Обновляем неправильные ответы как количество неотвеченных + неправильных
        const unansweredCount = quizData.length - Object.keys(selectedOptions).length;
        setIncorrectAnswers(unansweredCount + (quizData.length - correctAnswers - unansweredCount));

        onScoreUpdate(correctAnswers, incorrectAnswers);
    }, [selectedOptions, correctAnswers, onScoreUpdate]);

    const handleRadioChange = (event, questionId, correctAnswer) => {
        const selectedValue = event.target.value;

        setSelectedOptions((prevSelectedOptions) => {
            const updatedOptions = { ...prevSelectedOptions, [questionId]: selectedValue };

            let newCorrect = 0;

            quizData.forEach((q) => {
                if (updatedOptions[q.id] === q.correctAnswer) {
                    newCorrect++;
                }
            });

            setCorrectAnswers(newCorrect);
            return updatedOptions;
        });
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
