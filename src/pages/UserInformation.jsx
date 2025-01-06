import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { MdOutlineEdit } from "react-icons/md";
import { UserContext } from '../ContextApi/UserContext';
import axios from 'axios';
import ReactModal from 'react-modal';
import Notification from '../components/Notification';

const UserInformation = () => {
    const [isOpen, openModal] = useState(false);
    const [modalState, setModalState] = useState('');
    const [error, setError] = useState('');
    const [reload, setReload] = useState(false);
    const [imgGPLX, setImgGPLX] = useState('');

    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [message, setMessage] = useState('');

    const closeNotification = () => {
        setNotificationOpen(false);
        setMessage('');
    }
    const openNotification = (message, duration = 2000) => {
        setNotificationOpen(true);
        setMessage(message);
        setTimeout(() => {
            setNotificationOpen(false);
            setMessage('');
        }, duration)
    }

    const closeModal = () => {
        openModal(false);
    };

    const { user, setUser } = useContext(UserContext);

    const [gplx, setGplx] = useState('');
    const [soGplx, setSoGplx] = useState('');
    const [hovaten, setHoVaTen] = useState('');
    const [ngaysinh, setNgaysinh] = useState('');
    const [file, setFile] = useState(null);

    const fetchGPLX = async () => {
        try {
            const sdt = user.khachhang.sodienthoai;
            const request = {
                sodienthoai: sdt
            }
            const response = await axios.post('http://localhost:8080/identity/gplx', request)
            if (response.data.success) {
                const result = response.data.data
                setGplx(result);
                const res = await axios.get(`http://localhost:8080/image/a/${result.idgiaypheplaixe}/gplx`);
                const imageSrc = `data:image/jpeg;base64,${res.data.data.src}`
                setImgGPLX(imageSrc);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchImageGPLX = async () => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    const handleClickUpdateGPLX = () => {
        openModal(true);
        if (gplx) {
            setModalState('update');
        } else {
            setModalState('add');
        }
    };

    const handleSubmit = async () => {
        if (soGplx.trim() === '') {
            setError('Số giấy phép lái xe không được để trống');
            return;
        }
        if (hovaten.trim() === '') {
            setError('Họ và tên trong giấy phép lái xe không được để trống');
            return;
        }
        if (ngaysinh.trim() === '') {
            setError('Ngày sinh trong giấy phép lái xe không được để trống');
            return;
        }
        if (file === null) {
            setError('Hình ảnh mặt trước giấy phép lái xe không được để trống');
            return;
        }
        try {
            const request = {
                sodienthoai: user.khachhang.sodienthoai,
                hovaten: hovaten,
                sogplx: soGplx,
                ngaysinh: ngaysinh
            }
            const response = await axios.post('http://localhost:8080/identity/add-gplx', request);
            if (response.data.success === false) {
                setError('Thêm thông tin thất bại.')
                return;
            }
            const formData = new FormData();
            formData.append('images', file);
            formData.append('id', response.data.data.idgiaypheplaixe);
            formData.append('loai', 'gplx');
            const res2 = await axios.post('http://localhost:8080/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res2.data.success === false) {
                setError('Thêm hình ảnh thất bại');
                return;
            }
            closeModal();
            openNotification('Cập nhật giấy phép lái xe thành công');
            setReload(prev => !prev);
            setUser((user) => ({ ...user, gplx: true }))
            console.log('User sau set:', user);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Vui lòng chọn một tệp hình ảnh hợp lệ (jpg, png, v.v.)');
            setFile(null);
        }
    };

    useEffect(() => {
        fetchGPLX();
        fetchImageGPLX();
    }, [reload]);

    return (
        <>
            <Header />
            <div className="grid grid-cols-3 bg-gray-100 min-h-screen p-14 gap-6">
                {/* Sidebar */}
                <div className="col-span-1 rounded-lg p-4 flex flex-col space-y-5">
                    <h2 className="text-3xl font-semibold">Xin chào bạn!</h2>
                    <hr />
                    <p className="text-xl cursor-pointer hover:font-semibold">Tài khoản của tôi</p>
                    <p className="text-xl cursor-pointer hover:font-semibold">Địa chỉ của tôi</p>
                    <p className="text-xl cursor-pointer hover:font-semibold">Đổi mật khẩu</p>
                </div>

                {/* Main Content */}
                <div className="col-span-2 rounded-lg space-y-14">
                    {/* Thông tin tài khoản */}
                    <div className="border bg-white p-5 rounded-lg space-y-10">
                        <h1 className="text-2xl font-semibold mb-4 text-left">Thông tin tài khoản</h1>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Avatar và tên người dùng */}
                            <div className="col-span-1 flex flex-col items-center space-y-5">
                                <img
                                    src='/image/avatar-trang-4.jpg'
                                    alt="Avatar"
                                    className="w-36 h-36 rounded-full shadow-lg mb-2"
                                />
                                <p className="text-lg font-medium">{user.khachhang.hovaten}</p>
                            </div>
                            {/* Thông tin chi tiết */}
                            <div className="col-span-2 space-y-4">
                                <div className="flex justify-between items-center">
                                    <p>Ngày sinh</p>
                                    <div className="flex items-center">
                                        {user.khachhang.ngaysinh} <MdOutlineEdit className="ml-2" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Số điện thoại</p>
                                    <div className="flex items-center space-x-3">
                                        {user.khachhang.sodienthoai} <MdOutlineEdit className="ml-2" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Email</p>
                                    <div className="flex items-center space-x-3">
                                        {user.khachhang.email} <MdOutlineEdit className="ml-2" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Facebook</p>
                                    <div className="flex items-center space-x-3">
                                        Chưa liên kết <MdOutlineEdit className="ml-2" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Google</p>
                                    <div className="flex items-center space-x-3">
                                        Chưa liên kết <MdOutlineEdit className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Giấy phép lái xe */}
                    <div className="border bg-white p-5 rounded-lg space-y-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-2xl font-semibold text-left">Giấy phép lái xe</p>
                                <p className="text-sm text-red-500">
                                    {gplx ? "Đã xác thực" : "Chưa xác thực, vui lòng chỉnh sửa để xác thực"}
                                </p>
                                <p className='text-sm'>Vui lòng chọn giấy phép lái xe có hiệu lực lớn nhất.</p>
                            </div>
                            <button onClick={handleClickUpdateGPLX} className="border border-black rounded p-2">
                                Chỉnh sửa
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center justify-center">
                                <img
                                    src={imgGPLX}
                                    alt="Giấy phép lái xe"
                                    className="w-full h-48 rounded-lg shadow-md object-contain"
                                />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Thông tin chung</h2>
                                <div className="flex justify-between items-center">
                                    <p>Số GPLX:</p>
                                    <div>{gplx ? gplx.sogplx : "Chưa có"}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Họ và tên:</p>
                                    <div>{gplx ? gplx.hovaten : "Chưa có"}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Ngày sinh:</p>
                                    <div>{gplx ? gplx.ngaysinh : "Chưa có"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Modal thêm hoặc cập nhật GPLX */}
            <ReactModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                className="bg-white rounded-lg p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col space-y-2">
                    <div className='flex flex-col items-center'>
                        <h1 className="text-2xl font-semibold">{modalState === 'add' ? "Thêm GPLX" : "Cập nhật GPLX"}</h1>
                        <p className="text-sm text-gray-600 text-center">
                            Để thuận tiện cho việc giao nhận xe và xác thực, thông tin giấy phép lái xe và thông tin người dùng khi nhận xe phải là một.
                        </p></div>


                    {/* Số GPLX */}
                    <div className='flex justify-left space-x-4'>
                        <div className="w-full space-y-3">
                            <label htmlFor="gplx" className="block text-sm font-medium text-gray-700">Số GPLX</label>
                            <input
                                id="gplx"
                                type="text"
                                placeholder=""
                                value={soGplx}
                                onChange={(e) => setSoGplx(e.target.value)}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="hovaten" className="block text-sm font-medium text-gray-700">Họ và tên trong GPLX</label>
                            <input
                                id="hovaten"
                                type="text"
                                placeholder=""
                                value={hovaten}
                                onChange={(e) => setHoVaTen(e.target.value)}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="ngaysinh" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                            <input
                                id="ngaysinh"
                                type="date"
                                placeholder=""
                                value={ngaysinh}
                                onChange={(e) => setNgaysinh(e.target.value)}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <label htmlFor="hinhanh" className="block text-sm font-medium text-gray-700">GPLX mặt trước</label>
                            <input
                                id="hinhanh"
                                type="file"
                                onChange={handleFileChange}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                            {error && <p className='text-sm text-red-500'>{error}</p>}
                        </div>
                        <div className="w-full">
                            <div className="mt-4">
                                <img
                                    src={file && URL.createObjectURL(file)}
                                    alt="Mặt trước GPLX"
                                    className="w-full h-64 rounded-lg object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center space-x-4 mt-6">
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
                            Cập nhật
                        </button>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none">
                            Hủy
                        </button>
                    </div>
                </div>
            </ReactModal>
            <Notification isOpen={isNotificationOpen} closeModal={closeNotification} message={message} />
        </>
    );
};

export default UserInformation;
