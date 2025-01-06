import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [formData, setFormData] = useState({
        sodienthoai: "",
        hovaten: "",
        ngaysinh: "",
        email: "",
        matkhau: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Thiết lập ReCAPTCHA


    // Xử lý đăng ký và gửi OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Đăng ký thông tin người dùng trên server
            const res = await axios.post("http://localhost:8080/identity/register", formData);
            if (res.data.success) {
                // Đăng ký thành công -> Gửi OTP
                setLoading(false);
                navigate("/verify-otp", { state: { phone: formData.sodienthoai } });
            } else {
                alert(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex justify-between bg-gray-100">
            <div className="flex flex-col w-screen">
                <div className="p-5">
                    <button
                        onClick={handleBack}
                        className="bg-neutral-400 p-3 rounded font-semibold text-white hover:bg-neutral-600"
                    >
                        Trở về
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center h-full w-full space-y-6 ">
                    <h1 className="text-7xl content-center">Xin chào</h1>
                    <p className="text-xl">Vui lòng nhập đầy đủ thông tin để đăng ký</p>
                </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full h-screen">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <div id="recaptcha-container"></div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="sodienthoai"
                            >
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="sodienthoai"
                                id="sodienthoai"
                                pattern="[0-9]{10}"
                                value={formData.sodienthoai}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Số điện thoại"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="hovaten">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="hovaten"
                                id="hovaten"
                                value={formData.hovaten}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Họ và tên"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="ngaysinh">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                name="ngaysinh"
                                id="ngaysinh"
                                value={formData.ngaysinh}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="matkhau">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="matkhau"
                                id="matkhau"
                                value={formData.matkhau}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Mật khẩu"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
