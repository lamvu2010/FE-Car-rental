import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import NotificationError from '../components/NotificationError';
import Notification from '../components/Notification';
import { IoIosPhotos, IoIosCloseCircle } from 'react-icons/io';
import axios from 'axios';

const UpdateCar = () => {
    const navigate = useNavigate();
    const { idxe } = useParams();

    const [licensePlate, setLicensePlate] = useState('');
    const [interiorColor, setInteriorColor] = useState('');
    const [exteriorColor, setExteriorColor] = useState('');
    const [description, setDescription] = useState('');
    const [rentalPrice, setRentalPrice] = useState('');
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState(0);
    const [registration, setRegistration] = useState('');
    const [isOpenNotificationError, setOpenNotificationError] = useState(false);
    const [isOpenNotification, setOpenNotification] = useState(false);
    const [message, setMessage] = useState('');

    // Over-limit and additional fees
    const [overLimitDistanceFee, setOverLimitDistanceFee] = useState('');
    const [overtimeFee, setOvertimeFee] = useState('');
    const [cleaningFee, setCleaningFee] = useState('');
    const [deodorizingFee, setDeodorizingFee] = useState('');

    // Limits
    const [dailyDistanceLimit, setDailyDistanceLimit] = useState('');
    const [hourlyFeeLimit, setHourlyFeeLimit] = useState('');

    const base64ToFile = (base64String, index) => {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], `image_${index}.jpg`, { type: mime });
    };

    const fetchData = async () => {
        try {
            const informationCar = await axios.get(`http://localhost:8080/xe/${idxe}`);
            if (informationCar.data.success) {
                const car = informationCar.data.data;
                setLicensePlate(car.biensoxe);
                setInteriorColor(car.maunoithat);
                setExteriorColor(car.maungoaithat);
                setRegistration(car.dangkiem);
                setDescription(car.thongtinmota);
                setRentalPrice(car.giahientai);
                setStatus(car.trangthai);
                setOverLimitDistanceFee(car.phivuotgioihan);
                setOvertimeFee(car.phiquagio)
                setCleaningFee(car.phivesinh)
                setDeodorizingFee(car.phikhumui)
                setDailyDistanceLimit(car.kmgioihan)
                setHourlyFeeLimit(car.gioihanphitheogio)
            }

            const imagesResponse = await axios.get(`http://localhost:8080/image/${idxe}/xe`);
            if (imagesResponse.data.success) {
                const listSrc = imagesResponse.data.data.map(item => `data:image/jpeg;base64,${item.src}`);
                setImages(listSrc);
            }
        } catch (error) {
            setOpenNotificationError(true);
            setMessage('Có lỗi xảy ra khi tải dữ liệu.');
        }
    };

    const saveCarImage = async () => {
        const formData = new FormData();

        for (const [index, image] of images.entries()) {
            if (typeof image === "string" && image.startsWith("data:image")) {
                const file = base64ToFile(image, index);
                formData.append(`images`, file);
            } else if (image instanceof File) {
                formData.append(`images`, image);
            }
        }

        formData.append('id', idxe);
        formData.append('loai', 'xe');

        try {
            const response = await axios.post("http://localhost:8080/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setOpenNotification(true);
                setMessage('Hình ảnh đã được lưu thành công.');
            } else {
                setOpenNotificationError(true);
                setMessage('Lưu hình ảnh không thành công.');
            }
        } catch (error) {
            console.error("Error saving car data:", error);
            setOpenNotificationError(true);
            setMessage('Có lỗi xảy ra khi lưu hình ảnh.');
        }
    };

    const handleClickSubmit = async () => {
        if (interiorColor.trim() === '') {
            setOpenNotificationError(true);
            setMessage('Màu nội thất không được để trống');
            return;
        }
        if (exteriorColor.trim() === '') {
            setOpenNotificationError(true);
            setMessage('Màu ngoại thất không được để trống');
            return;
        }
        if (interiorColor.trim() === '') {
            setOpenNotificationError(true);
            setMessage('Màu nội thất không được để trống');
            return;
        }
        if (rentalPrice === null) {
            setOpenNotificationError(true);
            setMessage('Giá thuê không được để trống');
            return;
        }
        try {
            const request = {
                idxe: idxe,
                dangkiem: registration,
                biensoxe: licensePlate,
                trangthai: status,
                maunoithat: interiorColor,
                maungoaithat: exteriorColor,
                thongtinmota: description,
                giahientai: rentalPrice,
                phivuotgioihan: overLimitDistanceFee,
                phiquagio: overtimeFee,
                phivesinh: cleaningFee,
                phikhumui: deodorizingFee,
                kmgioihan: dailyDistanceLimit,
                gioihanphitheogio: hourlyFeeLimit
            }
            console.log(request);
            const updateResult = await axios.put('http://localhost:8080/xe', request);

            if (updateResult.data.success === true) {
                await saveCarImage();
                setOpenNotification(true);
                setMessage('Cập nhật thành công');
            }
        } catch (error) {
            console.error("Error saving car data:", error);
            setOpenNotificationError(true);
            setMessage(`Có lỗi xảy ra khi lưu hình ảnh: ${error.message}`);
        }
    }
    useEffect(() => {
        fetchData();
    }, [idxe]);

    const closeModal = () => {
        setOpenNotificationError(false);
        setOpenNotification(false);
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

        if (selectedFiles.length > validFiles.length) {
            const invalidFileNames = selectedFiles.filter(file => !file.type.startsWith('image/')).map(file => file.name).join(', ');
            setOpenNotificationError(true);
            setMessage(`Các file không hợp lệ: ${invalidFileNames}`);
        }

        setImages(prevImages => [...prevImages, ...validFiles]);
    };

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleClickBack = () => {
        navigate('/xe');
    }
    return (
        <>
            <div className='flex flex-col space-y-10 p-10 bg-slate-100'>
                <div className='flex justify-center items-center mt-10' >
                    <button onClick={handleClickBack} className='bg-slate-400 p-3 rounded-lg'>Quay lại</button>
                    <div className='flex-grow'>
                        <h1 className='text-center text-2xl font-bold'>Sửa thông tin xe</h1>
                    </div>
                </div >
                <div className='grid grid-cols-12'>
                    <div className='col-span-2'></div >
                    <div className='col-span-8 flex-col space-y-10 bg-white p-5'>
                        <div className='space-y-10'>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Biển số xe</label>
                                <p className='text-red-500'>Lưu ý: Biển số không thể thay đổi sau khi đăng ký.</p>
                                <input
                                    type='text'
                                    className='border border-1 p-2 w-1/2 rounded'
                                    placeholder='Ví dụ: 60F3-12345'
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                    readOnly
                                />
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Thông tin cơ bản</label>
                                <p className='text-red-500'>Lưu ý: Các thông tin cơ bản không thể thay đổi sau khi đăng ký.</p>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Màu nội thất</label>
                                        <input
                                            className='p-2 border border-1 rounded'
                                            type='text'
                                            placeholder='Ví dụ: Đỏ'
                                            value={interiorColor}
                                            onChange={(e) => setInteriorColor(e.target.value)}
                                        />
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Màu ngoại thất</label>
                                        <input
                                            className='p-2 border border-1 rounded'
                                            type='text'
                                            placeholder='Ví dụ: Trắng'
                                            value={exteriorColor}
                                            onChange={(e) => setExteriorColor(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Kiểm định</label>
                                <div>
                                    <input
                                        value={registration}
                                        onChange={(e) => setRegistration(e.target.value)}
                                        type="date"
                                        className="appearance-none border border-gray-300 rounded-lg p-3 w-1/2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Mô tả</label>
                                <textarea
                                    className='border border-1 p-2'
                                    rows='5'
                                    placeholder='Nhập thông tin mô tả'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Giá thuê</label>
                                <div className='flex items-center space-x-3'>
                                    <input
                                        className='p-2 border border-1 rounded w-1/2'
                                        placeholder='Ví dụ: 1234'
                                        value={rentalPrice}
                                        onChange={(e) => setRentalPrice(e.target.value)}
                                    />
                                    <p className='text-xl'>K/ ngày</p>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Phụ phí phát sinh</label>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Phí vượt giới hạn km</label>
                                        <div className='flex items-center space-x-3'>
                                            <input
                                                className='p-2 border border-1 rounded'
                                                value={overLimitDistanceFee}
                                                onChange={(e) => setOverLimitDistanceFee(e.target.value)}
                                            /> <p>K</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Phí quá giờ</label>
                                        <div className='flex items-center space-x-3'>
                                            <input
                                                className='p-2 border border-1 rounded'
                                                value={overtimeFee}
                                                onChange={(e) => setOvertimeFee(e.target.value)}
                                            /> <p>K</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Phí vệ sinh</label>
                                        <div className='flex items-center space-x-3'>
                                            <input
                                                className='p-2 border border-1 rounded'
                                                value={cleaningFee}
                                                onChange={(e) => setCleaningFee(e.target.value)}
                                            /> <p>K</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Phí khử mùi</label>
                                        <div className='flex items-center space-x-3'>
                                            <input
                                                className='p-2 border border-1 rounded'
                                                value={deodorizingFee}
                                                onChange={(e) => setDeodorizingFee(e.target.value)}
                                            /> <p>K</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Số km giới hạn/ngày</label>
                                        <div className='flex items-center space-x-3'>
                                            <input
                                                className='p-2 border border-1 rounded'
                                                value={dailyDistanceLimit}
                                                onChange={(e) => setDailyDistanceLimit(e.target.value)}
                                            />
                                            <p>km</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Số giờ giới hạn tính phí theo giờ</label>
                                        <div className='flex items-center space-x-3'>
                                            <input
                                                className='p-2 border border-1 rounded'
                                                value={hourlyFeeLimit}
                                                onChange={(e) => setHourlyFeeLimit(e.target.value)}
                                            />
                                            <p>giờ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Trạng thái</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className='p-2 w-1/2 border border-1 rounded'>
                                    <option value={0}>Đang rảnh</option>
                                    <option value={1}>Đang bận</option>
                                    <option value={2}>Đang được thuê</option>
                                </select>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Hình ảnh</label>
                                <div className="relative">
                                    <input
                                        type='file'
                                        multiple
                                        onChange={handleImageChange}
                                        className="border border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring focus:ring-blue-300 transition duration-150"
                                    />
                                    <div className="absolute left-2 top-2 flex items-center">
                                        <IoIosPhotos size={24} className="text-gray-400" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {images.length > 0 && images.map((item, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={typeof (item) === 'string' ? item : URL.createObjectURL(item)}
                                                alt={`Hình ảnh xe ${index + 1}`}
                                                className="w-full h-40 object-contain rounded-lg shadow-md transition-transform duration-200 transform group-hover:scale-105"
                                            />
                                            {/* Nút xóa */}
                                            <IoIosCloseCircle
                                                onClick={() => handleRemoveImage(index)}
                                                size={30}
                                                className='absolute top-2 right-2 text-red-600 hover:cursor-pointer hover:text-red-800 transition-colors duration-200'
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <button onClick={handleClickSubmit} className='p-2 bg-green-300 rounded'>Cập nhật</button>
                        </div>
                    </div>
                    <div className='col-span-2'></div>
                </div>
            </div>
            <NotificationError isOpen={isOpenNotificationError} closeModal={closeModal} message={message} />
            <Notification isOpen={isOpenNotification} closeModal={closeModal} message={message} />
        </>
    )
}

export default UpdateCar