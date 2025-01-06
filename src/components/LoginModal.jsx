import React, { useContext, useState } from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../ContextApi/UserContext';

const LoginModal = ({ isOpen, setLoginModalOpen }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const { login } = useContext(UserContext);

    const validateInput = () => {
        if (username.trim() === '') {
            setLoginError('Số điện thoại không được để trống');
            return false;
        }
        if (password.trim() === '') {
            setLoginError('Mật khẩu không được để trống');
            return false;
        }
        if (password.length < 8) {
            setLoginError('Mật khẩu phải có ít nhất 8 ký tự');
            return false;
        }
        return true;
    };

    const closeModal = () => {
        setLoginModalOpen(false); // Đóng modal khi người dùng nhấn đóng
        setLoginError(''); // Reset lỗi nếu có
    };

    const handleLogin = async (e) => {
        if (!validateInput()) return;
        e.preventDefault();
        try {
            const request = {
                sdt: username,
                password: password
            };
            const response = await axios.post('http://localhost:8080/identity/login', request);
            if (response.data.success === false) {
                console.log(response.data.success)
                setLoginError(response.data.message);
                return;
            }
            login(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
            setLoginModalOpen(false);
            setLoginError('');
        } catch (error) {
            console.log(error);
            setLoginError('Số điện thoại hoặc mật khẩu không hợp lệ');
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            className="bg-white rounded-lg p-10 max-w-sm w-full"
        >
            <div className="flex flex-col space-y-5">
                <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
                <input
                    type='text'
                    placeholder='Số điện thoại'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type='password'
                    placeholder='Mật khẩu'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded"
                />

                {loginError && <p className="text-red-500">{loginError}</p>}
                <div className="flex justify-center space-x-2 mt-4">
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Xác nhận
                    </button>
                </div>
                <div className='flex justify-center space-x-2'>
                    <p>Bạn chưa có tài khoản ? </p>
                    <Link to={'/signup'} className='text-blue-600 hover:text-blue-800'>Đăng ký</Link></div>
            </div>
        </ReactModal>
    );
};

export default LoginModal;