import { Button, Input, Select, Option } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';



export default function EditStudent({ isOpen, onClose, data, refresh }) {
    const [courseId, setCourseId] = useState('')
    const [courseData, setCourseData] = useState([])
    const [dataBirth, setDataBirth] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState()

    console.log(data)


    useEffect(() => {
        if (data) {
            setCourseId(data?.courseId || '')
            setDataBirth(data?.dataBirth || '')
            setFirstName(data?.firstName || "")
            setLastName(data?.lastName || '')
            setPhoneNumber(data?.phoneNumber || '')
        }
    }, [data])

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

    const EditStudent = async () => {
        try {
            const newData = {
                id:data?.id,
                accountType: 'STUDENT',
                courseId: courseId,
                creatorId: localStorage.getItem('userId'),
                dateBirth: dataBirth,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                password: password
            }
            const response = await axios.put(`users/edit`, newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            refresh()
            onClose()
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
        setCourseId(value);
    };


    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose} >
            <div className={`Modal2Content ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()} >
                <div className='p-[10px] pb-[30px]'>
                    <div className='flex items-center justify-between pr-[10px] pb-[15px]'>
                        <h1 className="text-[#272C4B] text-[22px]">
                            Edit Student
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
                                label="First name"
                                color="gray"  // Changed to gray for a neutral look
                                type="text"
                                required
                                className="border-black"  // Black border color
                            />
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                label="Last name"
                                color="gray"  // Changed to gray for a neutral look
                                type="text"
                                required
                                className="border-black"  // Black border color
                            />
                        </div>
                        <div className='mt-[20px]'>
                            <Select className="bg-[white]" label="Choose a course" onChange={handleSelectChange}>
                                {Array.isArray(courseData) && courseData.map(course => (
                                    <Option key={course.id} value={course.id}>
                                        {course.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className='mt-[20px]'>
                            <Input
                                value={dataBirth}
                                onChange={(e) => setDataBirth(e.target.value)}
                                label="Date birth"
                                color="gray"  // Changed to gray for a neutral look
                                type="date"
                                required
                                className="border-black"  // Black border color
                            />
                        </div>
                        <div className='mt-[20px]'>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                label="Phone number"
                                color="gray"  // Changed to gray for a neutral look
                                type="number"
                                required
                                className="border-black"  // Black border color
                            />
                        </div>
                        <div className='mt-[20px]'>
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                color="gray"  // Changed to gray for a neutral look
                                type="text"
                                required
                                className="border-black"  // Black border color
                            />
                        </div>
                        <Button
                            onClick={EditStudent}
                            fullWidth
                            color="gray"  // Changed to gray for a neutral button
                            className="bg-[#272C4B] mt-[20px] text-white hover:bg-gray-800"
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}