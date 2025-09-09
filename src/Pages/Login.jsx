import React, { useState, useEffect } from 'react';
import { Button, Input, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import WebApp from "@twa-dev/sdk";
import Swal from 'sweetalert2';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();

  // Берём chatId из Telegram WebApp SDK
  useEffect(() => {
    WebApp.ready();

    const data = WebApp.initDataUnsafe;
    const userIdValue = data?.user?.id || null;
    const chatIdValue = (data?.chat?.id ?? userIdValue) || null;

    setChatId(chatIdValue);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`/auth/login`, {}, {
        params: {
          login,
          password,
          chatId
        }
      });

      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('testId', response?.data?.object?.testId);
      const role = response?.data?.object?.accountType;

      if (response?.data?.code === 200) {
        localStorage.setItem('userId', response?.data?.object?.id);
        localStorage.setItem(
          'role',
          response?.data?.object?.accountType === 'ADMIN' ? 'DQWIJDWIOEFAD' : 'FWENFDEWST'
        );

        if (role === 'ADMIN') {
          navigate('/admin/course');
        } else {
          navigate('/home');
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
          text: response?.data?.message || 'Error.',
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
  };

  return (
    <div className="Login min-h-screen flex items-center justify-center relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#0000006d] z-40"></div>
      <div className="w-full max-w-md p-6 border-[2px] relative z-50 border-[black] bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-center mb-6">Kirish</h2>

        {/* {chatId && ( */}
        <Typography color="green" className="mb-4">
          Sizning Chat ID: <b>{chatId || 'Noma\'lum'}</b>
        </Typography>
        {/* )} */}

        <div className="space-y-4">
          <Input
            value={login}
            onChange={(e) => {
              const input = e.target.value;
              const numericValue = input.replace(/\D/g, '');
              let formattedValue = '+998';
              if (numericValue.startsWith('998')) {
                formattedValue += numericValue.slice(3, 12);
              } else {
                formattedValue += numericValue.slice(0, 9);
              }
              setLogin(formattedValue);
            }}
            label="Telefon raqam"
            color="gray"
            type="text"
            required
            className="border-black"
            maxLength={13}
          />
          <Input
            label="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color="gray"
            type="password"
            required
            className="border-black"
          />
          <Button
            fullWidth
            color="gray"
            onClick={handleLogin}
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
