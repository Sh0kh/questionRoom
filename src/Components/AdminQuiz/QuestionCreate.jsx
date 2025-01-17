import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Input, Select, Option } from "@material-tailwind/react";
import axios from "axios";

export default function QuestionCreate() {
    const [questionOptions, setQuestionOptions] = useState([
        { text: "", correctAnswer: true },
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
    ]);
    const [selectedQuestionType, setSelectedQuestionType] = useState(null);
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const navigate = useNavigate();
    const { ID } = useParams();
    const [question, setQuestion] = useState('');
    const [file, setFile] = useState(null);
    const [fileId, setFileID] = useState()



    const [currentAnswer, setCurrentAnswer] = useState(questionOptions[0].text);

    useEffect(() => {
        // Ensure that the currentAnswer is always set to the first option's text
        setCurrentAnswer(questionOptions[0]?.text || '');
    }, [questionOptions]); // This will re-run when questionOptions change

    const questionTypes = [
        { value: 'IMAGE_BASED', label: 'Image-Based' },
        { value: 'LISTENING', label: 'Listening' },
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' }
    ];



    const handleAddInput = () => {
        setQuestionOptions([...questionOptions, { text: "", correctAnswer: false }]);
    };

    const handleRemoveInput = (index) => {
        const updatedOptions = questionOptions.filter((_, i) => i !== index);
        setQuestionOptions(updatedOptions);
    };

    const handleInputChange = (e, index) => {
        const updatedOptions = [...questionOptions];
        updatedOptions[index].text = e.target.value;
        setQuestionOptions(updatedOptions);
    };

    const handleCheckboxChange = (index) => {
        const updatedOptions = questionOptions.map((option, i) => {
            if (i === index) {
                setCurrentAnswer(option.text);
                return { ...option, correctAnswer: true };
            } else {
                return { ...option, correctAnswer: false };
            }
        });
        setQuestionOptions(updatedOptions);
    };

    const handleAudioChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudio(URL.createObjectURL(file));
            const uploadedImageId = await uploadFile(file); // Загружаем файл
            setFile(uploadedImageId); // Сохраняем ID для использования в CreateQuestion
        }
    };


    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImage(URL.createObjectURL(selectedFile)); // Для предпросмотра
            const uploadedImageId = await uploadFile(selectedFile); // Загружаем файл
            setFileID(uploadedImageId); // Сохраняем ID для использования в CreateQuestion
        }
    };


    const triggerImageFileInput = () => {
        document.getElementById('image-upload-input').click();
    };

    const triggerAudioFileInput = () => {
        document.getElementById('audio-upload-input').click();
    };

    const uploadFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`/file/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    category: 'quiz',
                    userId: localStorage.getItem('userId'),
                },
            });

            console.log(response)
            return response?.data?.object.id;
            // setFileID(uploadedFileId); // Обновляем состояние
            // return uploadedFileId;
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to upload the file.",
                icon: "error",
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
            return null;
        }
    };


    const CreateQuiz = async () => {
        try {
            const newData = {
                question: question, // Текст вопроса
                quizType: selectedQuestionType, // Тип вопроса
                option: questionOptions.map(option => option.text), // Опции для вопроса
                correctAnswer: currentAnswer, // Верный ответ (можно передавать только название правильного варианта)
                imageId: fileId || null,
                moduleId: Number(ID),
                audioId: file || null,
                createdBy: localStorage.getItem('userId')
            }
            const response = await axios.post(`/quiz/create`, newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            navigate(-1)
            Swal.fire({
                title: 'Muvaffaqiyatli!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error.',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        }
    }

    return (
        <div className="w-full h-screen bg-gray-100 p-6 md:p-10 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Savol yaratish</h2>
                    <Button
                        onClick={() => navigate(-1)}
                        color="gray"
                        variant="filled"
                        className="px-4 py-2"
                    >
                        Back
                    </Button>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Savol turi</label>
                    <Select
                        label="Savol turi"
                        value={selectedQuestionType}
                        onChange={(e) => setSelectedQuestionType(e)}
                        className="w-full"
                    >
                        {questionTypes.map((type) => (
                            <Option key={type.value} value={type.value}>
                                {type.label}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Savol</label>
                    <Input
                        type="text"
                        label="Savol..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Variantlar</label>
                    {questionOptions.map((option, index) => (
                        <div key={index} className="flex items-center mb-4">
                            <Input
                                type="text"
                                label={`Variant ${index + 1}`}
                                value={option.text}
                                onChange={(e) => handleInputChange(e, index)}
                                className="mr-2 w-full"
                            />
                            <Button
                                onClick={() => handleRemoveInput(index)}
                                color="red"
                                variant="filled"
                                className="px-4 py-2"
                            >
                                -
                            </Button>
                            <input
                                type="checkbox"
                                checked={option.correctAnswer}
                                onChange={() => handleCheckboxChange(index)}
                                className="ml-2"
                            />
                        </div>
                    ))}
                    <Button
                        onClick={handleAddInput}
                        color="green"
                        variant="filled"
                        className="w-full px-4 py-2"
                    >
                        Variant qoshish
                    </Button>
                </div>

                {selectedQuestionType === 'IMAGE_BASED' && (
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Upload Image</label>
                        <Button
                            onClick={triggerImageFileInput}
                            color="blue"
                            variant="filled"
                            className="px-4 py-2"
                        >
                            Rasm
                        </Button>
                        <input
                            id="image-upload-input"
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {image && (
                            <div className="mt-4">
                                <p className="text-sm">Image Preview:</p>
                                <img src={image} alt="Image Preview" className="w-full h-auto" />
                            </div>
                        )}
                    </div>
                )}

                {selectedQuestionType === 'LISTENING' && (
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Upload Audio</label>
                        <Button
                            onClick={triggerAudioFileInput}
                            color="blue"
                            variant="filled"
                            className="px-4 py-2"
                        >
                            Audio
                        </Button>
                        <input
                            id="audio-upload-input"
                            type="file"
                            onChange={handleAudioChange}
                            accept="audio/*"
                            className="hidden"
                        />
                        {audio && (
                            <div className="mt-4">
                                <p className="text-sm">Audio Preview:</p>
                                <audio controls>
                                    <source src={audio} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </div>
                )}

                <Button
                    onClick={CreateQuiz}
                    color="green"
                    variant="filled"
                    className="w-full mt-4"
                >
                    Yaratish
                </Button>
            </div>
        </div>
    );
}
