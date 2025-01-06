import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosPhotos, IoIosCloseCircle } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../components/Notification';
import NotificationError from '../components/NotificationError';
import Select from "react-select";
import { format } from 'date-fns'

const AddBienBanGiao = () => {


    const { idhopdong } = useParams();
    const [currentKm, setCurrentKm] = useState('');
    const [carCondition, setCarCondition] = useState('');
    const [fuelPercentage, setFuelPercentage] = useState(10);
    const [fuelLiters, setFuelLiters] = useState(0);
    const [deliveryLocation, setDeliveryLocation] = useState('97 Man Thiện');
    const [deliverer, setDeliverer] = useState('');
    const [accessories, setAccessories] = useState('');
    const [images, setImages] = useState([]);
    const [contactData, setContactData] = useState(null);
    const [imagesCar, setImagesCar] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);

    const [isOpenNotification, openNotification] = useState(false);
    const [isOpenNotificationError, openNotificationError] = useState(false);
    const [message, setMessage] = useState('');

    const listAccessories = ['Bộ sạc dự phòng',
        'Thảm lót sàn',
        'Dây an toàn',
        'Kính chắn gió',
        'Ghế trẻ em',
        'Camera hành trình',
        'Đệm tựa đầu và lưng ghế',
        'Hộp y tế khẩn cấp',
        'Giá kẹp điện thoại'
    ]

    const options = [
        { value: "Không xước", label: "Không xước" },
        { value: "Lốp mòn nhẹ", label: "Lốp mòn nhẹ" },
        { value: "Gương chiếu hậu nguyên vẹn", label: "Gương chiếu hậu nguyên vẹn" },
        { value: "Hệ thống đèn hoạt động tốt", label: "Hệ thống đèn hoạt động tốt" },
    ];

    const navigate = useNavigate();

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setIsCarouselOpen(true);
    };
    const handleCloseCarousel = () => {
        setIsCarouselOpen(false);
    };
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
    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy');
    }

    const fetchContactData = async () => {
        try {
            const contactResponse = await axios.get(`http://localhost:8080/hopdong/detail/${idhopdong}`)
            if (contactResponse.data.success) {
                const result = contactResponse.data.data;
                setContactData(result);
                const imgsCar = await axios.get(`http://localhost:8080/image/${result.idxe}/xe`)
                const listImages = imgsCar.data.data
                const listSrc = listImages.map(item => {
                    return `data:image/jpeg;base64,${item.src}`
                })
                setImagesCar(listSrc)
            }

        } catch (error) {
            console.error('Error fetching delivery record:', error);
        }
    }

    useEffect(() => {
        fetchContactData();
    }, [])

    const handleSubmit = async () => {
        if (!currentKm || isNaN(currentKm) || currentKm <= 0) {
            openNotificationError(true)
            setMessage('Vui lòng nhập số km hiện tại hợp lệ!');
            return;
        }

        if (!fuelPercentage || isNaN(fuelPercentage) || fuelPercentage < 0 || fuelPercentage > 100) {
            openNotificationError(true);
            setMessage('Vui lòng nhập phần trăm xăng hợp lệ (0 - 100)!');
            return;
        }

        if (!fuelLiters || isNaN(fuelLiters) || fuelLiters < 0) {
            openNotificationError(true);
            setMessage('Vui lòng nhập số lít xăng hợp lệ!');
            return;
        }

        if (!deliveryLocation || deliveryLocation.trim() === '') {
            openNotificationError(true);
            setMessage('Vui lòng nhập địa điểm giao xe!');
            return;
        }

        if (!deliverer || deliverer.trim() === '') {
            openNotificationError(true);
            setMessage('Vui lòng nhập tên người giao xe!');
            return;
        }

        if (!idhopdong || idhopdong.trim() === '') {
            openNotificationError(true);
            setMessage('Vui lòng nhập ID hợp đồng!');
            return;
        }

        if (images.length < 5) {
            openNotificationError(true);
            setMessage('Vui lòng chọn ít nhất 5 hình ảnh chụp thông tin xe hiện tại.');
            return;
        }

        const formattedAccessories = accessories.join(', ');

        const deliveryData = {
            sokmhientai: currentKm,
            tinhtrangxe: carCondition,
            phantramxang: fuelPercentage,
            xangtheolit: fuelLiters,
            diadiemgiao: deliveryLocation,
            nguoigiaoxe: deliverer,
            phukienkemtheo: formattedAccessories,
            idhopdong: idhopdong
        };
        console.log('Biên bản giao xe:', deliveryData);
        // Thực hiện lưu dữ liệu lên server tại đây

        try {
            const responseRecord = await axios.post('http://localhost:8080/hopdong/bienbangiao/add', deliveryData)
            if (responseRecord.data.success === false) {
                openNotificationError(true);
                setMessage('Lỗi khi thêm biên bản giao, vui lòng thử lại.')
                return;
            }
            if (images && images.length > 0) {
                const formData = new FormData();
                images.forEach((image) => {
                    formData.append('images', image);
                });
                formData.append('id', responseRecord.data.data.idbienbangiao);
                formData.append('loai', 'bienbangiao');
                const responseImage = await axios.post('http://localhost:8080/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                )
                if (responseImage.data.success === false) {
                    openNotificationError('Thêm hình ảnh thất bại.');
                    return;
                }
            }

            openNotification(true);
            setMessage('Thêm biên bản giao thành công.')
            navigate(-1);
        } catch (error) {
            openNotificationError(true)
            setMessage(error.response.data.message)
            return
        }
    };

    const handleClickBack = () => {
        navigate(-1);
    }

    return (
        <>
            <div className='flex flex-col bg-slate-100 p-10 min-h-screen'>
                <div className='flex justify-center items-center mt-10'>
                    <button onClick={handleClickBack} className='bg-slate-400 p-3 rounded-lg text-white hover:bg-slate-500'>Quay lại</button>
                    <div className='flex-grow'>
                        <h1 className='text-center text-2xl font-semibold'>Thêm biên bản giao xe</h1>
                    </div>
                </div>

                <div className='grid grid-cols-12 mt-10 text-sm gap-2'>
                    <div className='col-span-6 rounded-lg shadow-lg bg-white'>
                        {contactData ? (
                            <div className='p-8'>
                                <div className='flex-col space-y-4'>
                                    <h2 className=" text-base font-semibold text-gray-700">Khách thuê</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <p><span className="font-medium text-gray-600">Họ và tên:</span> {contactData.hovaten}</p>
                                        <p><span className="font-medium text-gray-600">Ngày sinh:</span> {formatDate(contactData.ngaysinh)}</p>
                                        <p><span className="font-medium text-gray-600">Số điện thoại:</span> {contactData.sodienthoai}</p>
                                        <p><span className="font-medium text-gray-600">Email:</span> {contactData.email}</p>
                                        <p><span className="font-medium text-gray-600">CCCD:</span> {contactData.cccd}</p>
                                    </div>
                                    <h2 className=" text-base font-semibold text-gray-700">Xe thuê</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <p><span className="font-medium text-gray-600">Tên xe:</span> {contactData.tenhangxe} {contactData.tendongxe}</p>
                                        <p><span className="font-medium text-gray-600">Biển số xe:</span> {contactData.biensoxe}</p>
                                        <p><span className="font-medium text-gray-600">Màu nội thất:</span> {contactData.maunoithat}</p>
                                        <p><span className="font-medium text-gray-600">Màu ngoại thất:</span> {contactData.maungoaithat}</p>
                                        <p><span className="font-medium text-gray-600">Năm sản xuất:</span> {formatDate(contactData.namsanxuat)}</p>
                                        <p><span className="font-medium text-gray-600">Kiểu dáng:</span> {contactData.kieudang}</p>
                                    </div>
                                    <h2 className=" text-base font-semibold text-gray-700">Nội dung thuê</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <p><span className="font-medium text-gray-600">Bắt đầu thuê:</span> {contactData.thoigianbatdau ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianbatdau)) : 'Không có thòi gian bắt đầu'}</p>
                                        <p><span className="font-medium text-gray-600">Kết thúc thuê:</span> {contactData.thoigianketthuc ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianketthuc)) : 'Không có thời gian kết thúc'}</p>
                                        <p><span className="font-medium text-gray-600">Số ngày thuê:</span> {contactData.songaythue} ngày</p>
                                        <p><span className="font-medium text-gray-600">Giá thuê một ngày:</span> {contactData.giathuemotngay.toLocaleString()} VND</p>
                                        <p><span className="font-medium text-gray-600">Số giờ thuê:</span> {contactData.sogiothue} giờ</p>
                                        <p><span className="font-medium text-gray-600">Phụ trội thời gian theo giờ:</span> {contactData.phutroithoigian.toLocaleString()} VND</p>
                                        <p><span className="font-medium text-gray-600">Số km giới hạn một ngày:</span> {contactData.sokmgioihan} km</p>
                                        <p><span className="font-medium text-gray-600">Phụ trội quãng đường:</span> {contactData.phutroiquangduong.toLocaleString()} VND/km</p>
                                        <p><span className="font-medium text-gray-600">Phí vệ sinh:</span> {contactData.phivesinh.toLocaleString()} VND</p>
                                        <p><span className="font-medium text-gray-600">Phí khử mùi:</span> {contactData.phikhumui.toLocaleString()} VND</p>
                                        <p><span className="font-medium text-gray-600">Tiền đặt cọc:</span> {contactData.tiendatcoc.toLocaleString()} VND</p>
                                        <p><span className="font-medium text-gray-600">Giá thuê tổng:</span> {contactData.giathuetong.toLocaleString()} VND</p>
                                    </div>


                                </div>
                                <div className='mt-6'>
                                    <div className='grid grid-cols-3 gap-4 mt-4'>
                                        {imagesCar.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`Hình ảnh  xe ${index + 1}`}
                                                className='w-full h-40 object-cover rounded-lg shadow-md cursor-pointer'
                                                onClick={() => handleImageClick(index)}
                                            />
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <p>Đang tải dữ liệu...</p>
                        )}
                    </div>
                    <div className='col-span-6 flex-col space-y-10 bg-white p-8 rounded-lg shadow-lg'>
                        {/* Grid 2 cột cho các trường ngắn */}
                        <p className='text-red-600 italic'>Thời điểm bàn giao xe được tính khi nhân viên hoàn tất nhập thông tin giao xe. </p>
                        <div className='grid grid-cols-2 gap-6'>
                            {/* Số km hiện tại */}
                            <div className='flex flex-col'>
                                <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Số km hiện tại</label>
                                <input
                                    value={currentKm}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (!isNaN(value) && Number(value) || value === '') {
                                            setCurrentKm(e.target.value)
                                        }
                                    }}
                                    className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập số km hiện tại'
                                />
                            </div>

                            {/* Phần trăm xăng */}
                            <div className='flex flex-col'>
                                <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Phần trăm xăng</label>
                                <select
                                    type='number'
                                    value={fuelPercentage}
                                    onChange={(e) => setFuelPercentage(e.target.value)}
                                    className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập % xăng (0-100%)'
                                >
                                    <option value={10}>10%</option>
                                    <option value={20}>20%</option>
                                    <option value={30}>30%</option>
                                    <option value={40}>40%</option>
                                    <option value={50}>50%</option>
                                    <option value={60}>60%</option>
                                    <option value={70}>70%</option>
                                    <option value={80}>80%</option>
                                    <option value={90}>90%</option>
                                    <option value={100}>100%</option>
                                </select>
                            </div>

                            {/* Xăng theo lít */}
                            <div className='flex flex-col'>
                                <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Xăng theo lít</label>
                                <input
                                    value={fuelLiters}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Chỉ cho phép giá trị là số, không âm, và có tối đa 3 ký tự
                                        if (!isNaN(value) && Number(value) >= 0 && value.length <= 3) {
                                            setFuelLiters(value);
                                        }
                                    }}
                                    className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập số lít xăng'
                                />
                            </div>

                            {/* Địa điểm giao */}
                            <div className='flex flex-col'>
                                <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Địa điểm giao</label>
                                <input
                                    type='text'
                                    value={deliveryLocation}
                                    onChange={(e) => setDeliveryLocation(e.target.value)}
                                    className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập địa điểm'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Người giao xe</label>
                                <input
                                    type='text'
                                    value={deliverer}
                                    onChange={(e) => setDeliverer(e.target.value)}
                                    className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập tên người giao xe'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Hình ảnh xe lúc giao</label>
                                <div className="flex items-center space-x-4">
                                    <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                        <IoIosPhotos className="inline mr-2" />
                                        Thêm ảnh
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-gray-500">Tối đa 10 ảnh.</p>
                                </div>
                            </div>
                        </div>
                        <p className='text-red-600 text-sm italic'>Để đảm bảo tính minh bạch trong quá trình giao nhận xe, yêu cầu nhân viên thêm đầy đủ hình ảnh thể hiện tình trạng xe hiện tại.</p>
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



                        {/* Tình trạng xe */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2"><span className='text-red-600'>* </span>Tình trạng xe</label>
                            <Select
                                isMulti
                                options={options}
                                onChange={(selectedOptions) =>
                                    setCarCondition(selectedOptions.map((option) => option.value).join(", "))
                                }
                                className="mb-2"
                                placeholder="Chọn tình trạng xe"
                            />
                            <textarea
                                rows="4"
                                value={carCondition}
                                onChange={(e) => setCarCondition(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Thêm thông tin khác nếu cần..."
                            ></textarea>
                        </div>

                        {/* Phụ kiện kèm theo */}
                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Phụ kiện kèm theo</label>

                            {/* Danh sách phụ kiện gợi ý */}
                            <div className='flex flex-wrap gap-2 mb-4'>
                                {listAccessories.map((item) => (
                                    <div key={item} className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            id={item}
                                            value={item}
                                            checked={accessories.includes(item)}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setAccessories((prev) =>
                                                    e.target.checked
                                                        ? [...prev, value]
                                                        : prev.filter((acc) => acc !== value)
                                                );
                                            }}
                                            className='mr-2'
                                        />
                                        <label htmlFor={item} className='text-gray-600'>{item}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Nhập thủ công phụ kiện */}
                            <textarea
                                rows='4'
                                value={accessories && accessories.filter((acc) => !listAccessories.includes(acc)).join(', ')}
                                onChange={(e) => {
                                    const customAccessories = e.target.value.split(',').map((item) => item.trim());
                                    setAccessories((prev) => [
                                        ...prev.filter((acc) => listAccessories.includes(acc)),
                                        ...customAccessories.filter((item) => item !== ''),
                                    ]);
                                }}
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Nhập thêm phụ kiện khác, cách nhau bởi dấu phẩy'
                            ></textarea>
                        </div>

                        {/* Hình ảnh xe lúc giao */}


                        {/* Nút lưu */}
                        <div className='flex justify-center'>
                            <button
                                onClick={handleSubmit}
                                className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600'
                            >
                                Lưu biên bản
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Notification
                isOpen={isOpenNotification}
                closeModal={() => {
                    openNotification(false)
                    setMessage('')
                }}
                message={message} />
            <NotificationError
                isOpen={isOpenNotificationError}
                closeModal={() => {
                    openNotificationError(false)
                    setMessage('')
                }}
                message={message} />
            {isCarouselOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center z-50">
                    <button
                        onClick={handleCloseCarousel}
                        className="absolute top-5 right-5 text-white text-3xl"
                    >
                        <IoIosCloseCircle />
                    </button>
                    <img
                        src={imagesCar[selectedImageIndex]}
                        alt={`Hình ảnh ${selectedImageIndex + 1}`}
                        className="max-w-[90%] max-h-[90%]"
                    />
                    <button
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : imagesCar.length - 1))}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => setSelectedImageIndex((prev) => (prev < imagesCar.length - 1 ? prev + 1 : 0))}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </>
    );
};

export default AddBienBanGiao;
