import { Button, Input, Select, Option } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';



export default function CreateStudent({ isOpen, onClose, refresh }) {
    const [courseId, setCourseId] = useState('')
    const [courseData, setCourseData] = useState([])
    const [dataBirth, setDataBirth] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState()
    const [gender, setGender] = useState(null)
    const [Group, setGroup] = useState(null)
    const [school, setSchool] = useState('')
    const [email, setEmail] = useState('')


    const getCourse = async () => {
        try {
            const response = await axios.get(`/course/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const courses = Array.isArray(response?.data?.object) ? response.data.object : [];
            setCourseData(courses);
        } catch (error) {
            console.error(error);
            setCourseData([]); // Set to an empty array in case of an error
        }
    };

    useEffect(() => {
        if (isOpen) {
            getCourse()
        }
    }, [isOpen])

    const createStudent = async () => {
        try {
            const newData = {
                accountType: 'STUDENT',
                courseId: courseId,
                creatorId: localStorage.getItem('userId'),
                dateBirth: dataBirth,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                password: password,
                gender: gender,
                group: Group,
                email:email,
                school:school
            }
            const response = await axios.post(`users/admin`, newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            onClose()
            setLastName('')
            setFirstName('')
            setDataBirth('')
            setPassword('')
            setCourseId(''); // Сбрасываем выбранное значение
            setPhoneNumber('')
            refresh()
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


    useEffect(() => {
        if (!isOpen) {
            setCourseId(''); // Сбрасываем курс при закрытии модального окна
        }
    }, [isOpen]);

    const handleSelectChange = (value) => {
        setCourseId(value);
    };


    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose} >
            <div className={`Modal2Content ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()} >
                <div className='p-[10px] pb-[30px]'>
                    <div className='flex items-center justify-between pr-[10px] pb-[15px]'>
                        <h1 className="text-[#272C4B] text-[22px]">
                            Talaba yaratish
                        </h1>
                        <button onClick={onClose}>
                            <svg className='text-[#5E5C5A] text-[13px]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <div className='flex items-center justify-between gap-[10px]'>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                label="Ism"
                                color="gray"  // Changed to gray for a neutral look
                                type="text"
                                required
                                className="border-black"  // Black border color
                            />
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                label="Familiya"
                                color="gray"  // Changed to gray for a neutral look
                                type="text"
                                required
                                className="border-black"  // Black border color
                            />
                        </div>
                        <div className='mt-[20px]'>
                            <Select
                                className="bg-[white]" label="Kurs" onChange={handleSelectChange}>
                                {Array.isArray(courseData) && courseData.map(course => (
                                    <Option key={course.id} value={course.id}>
                                        {course.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className='flex items-center gap-[10px]'>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={dataBirth}
                                    onChange={(e) => setDataBirth(e.target.value)}
                                    label="Tug'ilgan sana"
                                    color="gray"  // Changed to gray for a neutral look
                                    type="date"
                                    required
                                    className="border-black"  // Black border color
                                />
                            </div>
                            <div className='mt-[20px] w-full'>

                                <Select
                                    className="bg-[white]"
                                    label="Jinsi"
                                    onChange={(value) => setGender(value)}
                                >
                                    <Option key="male" value="ERKAK">
                                        Erkkak
                                    </Option>
                                    <Option key="female" value="AYOL">
                                        Ayol
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <div className='flex items-center gap-[10px]'>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="Parol"
                                    color="gray"  // Changed to gray for a neutral look
                                    type="text"
                                    required
                                    className="border-black"  // Black border color
                                />
                            </div>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={Group}
                                    onChange={(e) => setGroup(e.target.value)}
                                    label="Sinif"
                                    color="gray"  // Changed to gray for a neutral look
                                    type="text"
                                    required
                                    className="border-black"  // Black border color
                                />
                            </div>
                        </div>
                        <div className='flex items-center gap-[10px]'>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                    label="Maktab"
                                    color="gray"  // Changed to gray for a neutral look
                                    type="text"
                                    required
                                    className="border-black"  // Black border color
                                />
                            </div>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    label="Email"
                                    color="gray"  // Changed to gray for a neutral look
                                    type="text"
                                    required
                                    className="border-black"  // Black border color
                                />
                            </div>
                        </div>
                        <div className='mt-[20px]'>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => {
                                    const input = e.target.value;

                                    // Удаляем любые символы, кроме цифр
                                    const numericValue = input.replace(/\D/g, "");

                                    // Префикс +998 не должен быть удалён
                                    let formattedValue = "+998";

                                    // Добавляем цифры после +998, но не более 9 символов
                                    if (numericValue.startsWith("998")) {
                                        formattedValue += numericValue.slice(3, 12); // Убираем "998" из начала
                                    } else {
                                        formattedValue += numericValue.slice(0, 9); // Просто добавляем оставшиеся цифры
                                    }

                                    setPhoneNumber(formattedValue);
                                }}
                                label="Telefon raqam"
                                color="gray"
                                type="text" // Используем text, чтобы разрешить ввод "+"
                                required
                                className="border-black"
                                maxLength={13} // Ограничиваем длину ввода до 13 символов
                            />

                        </div>

                        <Button
                            onClick={createStudent}
                            fullWidth
                            color="gray"  // Changed to gray for a neutral button
                            className="bg-[#272C4B] mt-[20px] text-white hover:bg-gray-800"
                        >
                            Yaratish
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}