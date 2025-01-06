import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyOtp() {

    useEffect(() => {
        document.title = "Xác thực OTP";
    }, []);
    const location = useLocation();
    const { phone } = location.state || {};
    const [otp, setOtp] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    const navigate = useNavigate()

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const request = {
            sodienthoai: phone,
            otp: otp,
        };

        try {
            const res = await axios.post("http://localhost:8080/identity/verify", request);
            if (res.data.success) {
                alert(res.data.message + " Vui lòng đăng nhập!");
                navigate('/home');
            } else {
                alert(res.data.message || "Xác thực OTP không thành công. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            alert("Đã xảy ra lỗi khi xác thực OTP. Vui lòng thử lại sau!");
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        try {
            const res = await axios.post("http://localhost:8080/identity/resend", { sodienthoai: phone });
            if (res.data.success) {
                alert("Mã OTP mới đã được gửi!");
                setResendCooldown(30); // 30 giây chờ
                const interval = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev <= 1) clearInterval(interval);
                        return prev - 1;
                    });
                }, 1000);
            } else {
                alert(res.data.message || "Gửi lại mã OTP thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error('Error during OTP resend:', error);
            alert("Đã xảy ra lỗi khi gửi lại OTP. Vui lòng thử lại sau!");
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Xác thực OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="otp">
                            Mã OTP
                        </label>
                        <input
                            type="text"
                            name="otp"
                            id="otp"
                            value={otp}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Mã OTP"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Xác thực
                        </button>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0}
                            className={`text-blue-500 hover:underline ${resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại mã OTP'}
                        </button>
                    </div>
                </form>
                {phone && (
                    <p className="mt-4 text-center text-gray-600">
                        Mã OTP đã được gửi đến số điện thoại: {phone}
                    </p>
                )}
            </div>
        </div>
    );
}

export default VerifyOtp;