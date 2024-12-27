import React, { useState } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Swal from 'sweetalert2';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const Login = async () => {
    try {

      const response = await axios.post(`/auth/login`, {}, {
        params: {
          login: login,
          password: password
        }
      })
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('courseId', response?.data?.object?.courseId)

      const role = response?.data?.object?.accountType
      if (response?.data?.code === 200) {
        localStorage.setItem('userId', response?.data?.object?.id)
        localStorage.setItem('role', response?.data?.object?.accountType === "ADMIN" ? 'DQWIJDWIOEFAD' : "FWENFDEWST")
        if (role === 'ADMIN') {
          navigate('/admin/course')
        } else {
          navigate('/')
        }

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
      } else {
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
    <div className="Login min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md p-6 border-[2px] border-[black] bg-white rounded-lg shadow-lg text-center">

        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <div className="space-y-4">
          <Input
            label="Telefon"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            color="gray"  // Changed to gray for a neutral look
            type="text"
            required
            className="border-black"  // Black border color
          />
          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color="gray"  // Changed to gray for a neutral look
            type="password"
            required
            className="border-black"  // Black border color
          />
          <Button
            fullWidth
            color="gray"  // Changed to gray for a neutral button
            onClick={Login}
            className="bg-black text-white hover:bg-gray-800"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
