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
          navigate('/home')
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
    <div className="Login min-h-screen flex items-center justify-center relative">
      <div className='absolute top-0 left-0 right-0 bottom-0 bg-[#0000006d] z-40'>

      </div>
      <div className="w-full max-w-md p-6 border-[2px] relative z-50 border-[black] bg-white rounded-lg shadow-lg text-center">

        <h2 className="text-2xl font-semibold text-center mb-6">Kirish</h2>

        <div className="space-y-4">
          <Input
            value={login}
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

              setLogin(formattedValue);
            }}
            label="Telefon raqam"
            color="gray"
            type="text" // Используем text, чтобы разрешить ввод "+"
            required
            className="border-black"
            maxLength={13} // Ограничиваем длину ввода до 13 символов
          />
          <Input
            label="Parol"
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
            kirish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
