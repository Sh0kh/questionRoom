import { Button, Input, Select, Option } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


export default function CreateModule({ refresh, isOpen, onClose }) {
    const [courseId, setCourseId] = useState(null)
    const [courseData, setCourseData] = useState([])
    const [name, setName] = useState('')
    const [time, setTime] = useState('')

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


    const createModule = async () => {
        try {
            const newData = {
                name: name,
                courseId: courseId,
                testTimeMinute: time
            }

            await axios.post(`/module/create`, newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            onClose()
            setName('')
            setTime('')
            setCourseId(null)
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

    const handleSelectChange = (value) => {
        setCourseId(value)
    };

    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose} >
            <div className={`Modal2Content ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()} >
                <div className='p-[10px] pb-[30px]'>
                    <div className='flex items-center justify-between pr-[10px] pb-[15px]'>
                        <h1 className="text-[#272C4B] text-[22px]">
                            Modul yaratish
                        </h1>
                        <button onClick={onClose}>
                            <svg className='text-[#5E5C5A] text-[13px]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="Modul nomi"
                            color="gray"  // Changed to gray for a neutral look
                            type="text"
                            required
                            className="border-black"  // Black border color
                        />
                        <div className='mt-[20px]'>
                            <Select className="bg-[white]" label="Kursni tanlang" onChange={handleSelectChange}>
                                {Array.isArray(courseData) && courseData.map(course => (
                                    <Option key={course.id} value={course.id}>
                                        {course.name}
                                    </Option>
                                ))}
                            </Select>

                        </div>
                        <div className='mt-[20px]'>
                            <Input
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                label="Test vaqti"
                                color="gray"  // Changed to gray for a neutral look
                                type="number"
                                required
                                className="border-black"  // Black border color
                            />
                        </div>
                        <Button
                            onClick={createModule}
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