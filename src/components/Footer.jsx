import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {

    const navigate = useNavigate();
    const handleClickPrivacy = () => {
        navigate('/privacy');
    }

    const handleClickInforSecurity = () => {
        navigate('/personalinfo');
    }
    return (
        <>
            <hr className="mb-5 border-gray-300" />
            <footer className="py-8 px-5">
                <div className="container mx-auto flex justify-between space-x-8">
                    {/* Company Info */}
                    <div className="flex flex-col space-y-5">
                        <h1 className="text-2xl font-semibold">Car-rental</h1>
                        <div className="flex flex-col space-y-1">
                            <p className="">1900 1900</p>
                            <p className="">Tổng đài hỗ trợ: 7AM - 10PM</p>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <p className="">contact@gmail.com</p>
                            <p className="">Gửi mail cho chúng tôi</p>
                        </div>
                    </div>
                    {/* Policies */}
                    <div className="flex flex-col space-y-5">
                        <h1 className="text-lg font-semibold">Chính sách</h1>
                        <p onClick={handleClickPrivacy} className=" text-gray-600 cursor-pointer">Chính sách và quy định</p>
                        <p onClick={handleClickInforSecurity} className=" text-gray-600 cursor-pointer">Bảo mật thông tin</p>
                        <p className=" text-gray-600 cursor-pointer">Giải quyết tranh chấp</p>
                    </div>
                    {/* Learn More */}
                    <div className="flex flex-col space-y-5">
                        <h1 className="text-lg font-semibold">Tìm hiểu thêm</h1>
                        <p className=" text-gray-600 cursor-pointer">Hướng dẫn chung</p>
                        <p className=" text-gray-600 cursor-pointer">Hướng dẫn đặt xe</p>
                        <p className=" text-gray-600 cursor-pointer">Hướng dẫn thanh toán</p>
                        <p className=" text-gray-600 cursor-pointer">Hỏi và trả lời</p>
                    </div>

                    {/* About */}
                    <div className="flex flex-col space-y-5">
                        <h1 className="text-lg font-semibold">Về Car-rental</h1>
                        <p className=" text-gray-600 cursor-pointer">Thông tin về chúng tôi</p>
                    </div>
                </div>
            </footer>
        </>

    );
}
export default Footer