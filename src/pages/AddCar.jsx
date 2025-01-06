import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NotificationError from '../components/NotificationError';
import Notification from '../components/Notification';
import { IoIosPhotos, IoIosCloseCircle } from 'react-icons/io';


const AddCar = () => {



    const navigate = useNavigate();

    const [isOpenNotificationError, setOpenNotificationError] = useState(false);
    const [isOpenNotification, setOpenNotification] = useState(false);
    const [message, setMessage] = useState('');
    const closeModal = () => {
        setOpenNotificationError(false);
        setOpenNotification(false);
    }

    // Khai báo các useState cho từng trường
    const [licensePlate, setLicensePlate] = useState(''); //Biển số xe
    const [carBrand, setCarBrand] = useState(''); //Hãng xe
    const [carModel, setCarModel] = useState(''); //Mẫu xe
    const [seatCount, setSeatCount] = useState(2); //Số ghế ngồi
    const [selectedYear, setSelectedYear] = useState(2024); //Năm sản xuất
    const [carStyle, setCarStyle] = useState(''); //Kiểu dáng
    const [origin, setOrigin] = useState(''); //Xuất xứ
    const [interiorColor, setInteriorColor] = useState(''); //Màu nội thất
    const [exteriorColor, setExteriorColor] = useState(''); //Màu ngoại thất
    const [transmission, setTransmission] = useState('Số tự động'); //Truyền động
    const [fuelType, setFuelType] = useState(''); //Nhiên liệu
    const [engineSize, setEngineSize] = useState(''); //Dung tích động cơ
    const [driveType, setDriveType] = useState(''); //Dẫn động
    const [description, setDescription] = useState(''); //Mô tả
    const [rentalPrice, setRentalPrice] = useState(''); //Giá thuê
    const [images, setImages] = useState([]); //Hình ảnh
    const [status, setStatus] = useState('cothethue');
    const [listCarBrand, setListCarBrand] = useState([]);
    const [listCarModel, setListCarModel] = useState([]);
    const [registration, setRegistration] = useState('');

    // Over-limit and additional fees
    const [overLimitDistanceFee, setOverLimitDistanceFee] = useState(5);
    const [overtimeFee, setOvertimeFee] = useState(50);
    const [cleaningFee, setCleaningFee] = useState(100);
    const [deodorizingFee, setDeodorizingFee] = useState(400);

    // Limits
    const [dailyDistanceLimit, setDailyDistanceLimit] = useState(300);
    const [hourlyFeeLimit, setHourlyFeeLimit] = useState(5);


    // Tạo danh sách năm
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 10; i++) {
        years.push(currentYear - i);
    }

    const handleClickBack = () => {
        navigate(-1);
    }


    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const validFiles = [];
        const invalidFiles = [];

        selectedFiles.forEach(file => {
            // Kiểm tra xem type có bắt đầu bằng 'image/' hay không
            if (file.type.startsWith('image/')) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        // Nếu có file không phải là ảnh, thông báo cho người dùng
        if (invalidFiles.length > 0) {
            const invalidFileNames = invalidFiles.map(file => file.name).join(', ');
            openNotificationError(`Các file không hợp lệ: ${invalidFileNames}`);
        }

        // Cập nhật danh sách ảnh
        setImages(prevImages => [...prevImages, ...validFiles]);
    };

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    }

    const handleChangeCarBrand = (e) => {
        setCarBrand(e.target.value);
        fetchListCarModel(e.target.value);
    }

    const openNotification = (message) => {
        setOpenNotification(true);
        setMessage(message);
    }
    const openNotificationError = (message) => {
        setOpenNotificationError(true);
        setMessage(message);
    }
    // kiem tra input thong tin co ban
    const handleCheckInformation = () => {
        if (licensePlate.trim() === '') {
            openNotificationError('Biển số không được để trống.')
            return;
        }
        if (carBrand === '') {
            openNotificationError('Hãng xe chưa được chọn.');
            return;
        }
        if (carModel === '') {
            openNotificationError('Dòng xe chưa được chọn.');
            return;
        }
        if (carStyle === '') {
            openNotificationError('Kiểu dáng chưa được chọn.');
            return;
        }
        if (origin === '') {
            openNotificationError('Xuất xứ xe chưa được chọn.');
            return;
        }
        if (interiorColor.trim() === '') {
            openNotificationError('Màu nội thất không được để trống.')
            return;
        }
        if (exteriorColor.trim() === '') {
            openNotificationError('Màu ngoại thất không được để trống.')
            return;
        }
        openNotification('Thông tin cơ bản của xe hợp lệ, vui lòng hoàn thành các thông tin tiếp theo.');
        return;
    }
    // kiem tra input thong so ki thuat va gia
    const handleCheckInformation2 = () => {
        if (registration === '') {
            openNotificationError('Ngày hết hạn đăng kiểm chưa được chọn.')
            return;
        }
        if (fuelType === '') {
            openNotificationError('Loại nhiên liệu của xe chưa được chọn.')
            return;
        }
        if (engineSize.trim() === '') {
            openNotificationError('Dung tích động cơ xe không được để trống.')
            return;
        }
        if (driveType === '') {
            openNotificationError('Loại dẫn động của xe chưa được chọn.')
            return;
        }
        if (rentalPrice.trim() === '') {
            openNotificationError('Vui lòng nhập giá thuê.')
            return;
        }
        if (overLimitDistanceFee === '') {
            openNotificationError('Vui lòng nhập phí vượt quá giới hạn.')
            return;
        }
        if (overtimeFee === '') {
            openNotificationError('Vui lòng nhập phí vượt quá thời gian')
            return;
        }
        if (cleaningFee === '') {
            openNotificationError('Vui lòng nhập phí vệ sinh')
            return;
        }
        if (deodorizingFee === '') {
            openNotificationError('Vui lòng nhập phí khử mùi')
            return;
        }
        if (dailyDistanceLimit === '') {
            openNotificationError('Vui lòng nhập số km giời hạn trên ngày')
            return;
        }
        if (hourlyFeeLimit === '') {
            openNotificationError('Vui lòng nhập thời gian giới hạn tính phí theo giờ')
            return;
        }
        if (images.length < 3) {
            openNotificationError('Vui lòng chọn ít nhất 3 hình ảnh thông tin xe.')
            return;
        }
    }
    const handleClickSubmit = async () => {
        if (licensePlate.trim() === '') {
            openNotificationError('Biển số không được để trống.')
            return;
        }
        if (carBrand === '') {
            openNotificationError('Hãng xe chưa được chọn.');
            return;
        }
        if (carModel === '') {
            openNotificationError('Dòng xe chưa được chọn.');
            return;
        }
        if (carStyle === '') {
            openNotificationError('Kiểu dáng chưa được chọn.');
            return;
        }
        if (origin === '') {
            openNotificationError('Xuất xứ xe chưa được chọn.');
            return;
        }
        if (interiorColor.trim() === '') {
            openNotificationError('Màu nội thất không được để trống.')
            return;
        }
        if (exteriorColor.trim() === '') {
            openNotificationError('Màu ngoại thất không được để trống.')
            return;
        }
        handleCheckInformation2();
        try {
            const request = {
                namsanxuat: selectedYear,
                sochongoi: seatCount,
                dangkiem: registration,
                biensoxe: licensePlate,
                iddongxe: carModel,
                trangthai: status,
                xuatxu: origin,
                kieudang: carStyle,
                hopso: transmission,
                nhienlieu: fuelType,
                dongco: engineSize,
                maunoithat: interiorColor,
                maungoaithat: exteriorColor,
                dandong: driveType,
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
            const response = await axios.post('http://localhost:8080/xe', request)
            if (response.data.success === false) {
                openNotificationError('Lỗi khi thêm xe.');
                return;
            }
            const formData = new FormData();
            images.forEach((image) => {
                formData.append('images', image);
            });
            formData.append('id', response.data.data.idxe);
            formData.append('loai', 'xe');
            const response2 = await axios.post('http://localhost:8080/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            )
            if (response2.data.success === false) {
                openNotificationError('Thêm hình ảnh thất bại.');
                return;
            }
            openNotification('Thêm xe và hình ảnh thành công.');
            navigate(-1);
        } catch (error) {
            openNotificationError(error.response.data.message);
        }
    }

    const fetchListCarBrand = async () => {
        try {
            const response = await axios.get('http://localhost:8080/hangxe');
            setListCarBrand(response.data.data);
        } catch (error) {
            openNotificationError(error.response.data.message);
        }
    }

    const fetchListCarModel = async (idhangxe) => {
        if (idhangxe === '') {
            setCarModel('');
            setListCarModel([]);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8080/dongxe/${idhangxe}`);
            setListCarModel(response.data.data);
        } catch (error) {
            openNotificationError(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchListCarBrand();
    }, [])

    return (
        <>
            <div className='flex flex-col space-y-10 p-10 bg-slate-100'>
                <div className='flex justify-center items-center mt-10' >
                    <button onClick={handleClickBack} className='bg-slate-400 p-3 rounded-lg'>Quay lại</button>
                    <div className='flex-grow'>
                        <h1 className='text-center text-2xl font-bold'>Đăng ký xe</h1>
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
                                />
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Thông tin cơ bản</label>
                                <p className='text-red-500'>Lưu ý: Các thông tin cơ bản không thể thay đổi sau khi đăng ký.</p>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Hãng xe</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={carBrand}
                                            onChange={handleChangeCarBrand}
                                        >
                                            <option value=''>Chọn hãng xe</option>
                                            {listCarBrand.map(item => (
                                                <option key={item.idhangxe} value={item.idhangxe}>{item.tenhangxe}</option>
                                            )
                                            )}
                                        </select>
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Dòng xe</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={carModel}
                                            onChange={(e) => setCarModel(e.target.value)}
                                        >
                                            <option>Chọn dòng xe</option>
                                            {listCarModel && listCarModel.map(item => (
                                                <option key={item.iddongxe} value={item.iddongxe}> {item.tendongxe}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Số ghế</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={seatCount}
                                            onChange={(e) => setSeatCount(e.target.value)}
                                        >
                                            <option>2</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>7</option>
                                            <option>9</option>
                                            <option>16</option>
                                            <option>30</option>
                                            <option>45</option>
                                        </select>
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Năm sản xuất</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Kiểu dáng</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={carStyle}
                                            onChange={(e) => setCarStyle(e.target.value)}
                                        >
                                            <option value=''>Chọn kiểu dáng</option>
                                            <option>SUV</option>
                                            <option>Sedan</option>
                                            <option>Hatchback</option>
                                            <option>Crossover</option>
                                            <option>Coupe</option>
                                            <option>MPV</option>
                                        </select>
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Xuất xứ</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                        >
                                            <option value=''>Chọn xuất xứ</option>
                                            <option>Lắp ráp trong nước</option>
                                            <option>Nhập khẩu</option>
                                        </select>
                                    </div>
                                </div>
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
                                <div className='flex justify-center'>
                                    <button onClick={handleCheckInformation} className='p-2 bg-green-400 rounded mt-5 '>Kiểm tra thông tin cơ bản</button>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Kiểm định</label>
                                <div>
                                    <input
                                        onChange={(e) => setRegistration(e.target.value)}
                                        type="date"
                                        className="appearance-none border border-gray-300 rounded-lg p-3 w-1/2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Thông số kỹ thuật</label>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Truyền động</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={transmission}
                                            onChange={(e) => setTransmission(e.target.value)}
                                        >
                                            <option>Số tự động</option>
                                            <option>Số sàn</option>
                                        </select>
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Nhiên liệu</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={fuelType}
                                            onChange={(e) => setFuelType(e.target.value)}
                                        >
                                            <option value=''>Chọn loại nhiên liệu</option>
                                            <option>Xăng</option>
                                            <option>Dầu diesel</option>
                                            <option>Điện</option>
                                            <option>Xăng và Điện</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-20'>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Động cơ</label>
                                        <input
                                            className='p-2 border border-1 rounded'
                                            value={engineSize}
                                            onChange={(e) => setEngineSize(e.target.value)}
                                            placeholder="Ví dụ: 1.5L"
                                        />
                                    </div>
                                    <div className='flex flex-col space-y-3'>
                                        <label>Dẫn động</label>
                                        <select
                                            className='p-2 border border-1 rounded'
                                            value={driveType}
                                            onChange={(e) => setDriveType(e.target.value)}
                                        >
                                            <option value=''>Chọn loại dẫn động</option>
                                            <option>FWD - Cầu trước</option>
                                            <option>RWD - Cầu sau</option>
                                            <option>AWD - Cầu trước và cầu sau</option>
                                        </select>
                                    </div>
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
                                    <p className=''>K/ ngày</p>
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
                                    <option value={"cothethue"}>Có thể thuê</option>
                                    <option value={"dangduocthue"}>Đang được thuê</option>
                                </select>
                            </div>
                            <div className='flex flex-col space-y-3'>
                                <label className='font-semibold text-xl'>Hình ảnh</label>
                                <div className="relative">
                                    <input
                                        type='file'
                                        multiple
                                        accept='image/*'
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
                                                src={URL.createObjectURL(item)}
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
                            <button onClick={handleClickSubmit} className='p-2 bg-green-300 rounded'>Đăng ký</button>
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

export default AddCar;