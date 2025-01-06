import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { IoIosPhotos, IoIosCloseCircle } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns'
import { ReturnRecordContext } from '../ContextApi/ReturnRecordContext';
import NotificationError from '../components/NotificationError';

const AddreturnRecord = () => {

    const { returnRecord, danhmuc, setReturnRecord, setDanhmuc, setThongtinthanhtoan, setContact, setDeliveryRecord } = useContext(ReturnRecordContext);

    const { idhopdong } = useParams();
    const [currentKm, setCurrentKm] = useState('');
    const [fuelPercentage, setFuelPercentage] = useState('');
    const [fuelLiters, setFuelLiters] = useState('');
    const [returnLocation, setReturnLocation] = useState('97 Man Thiện');
    const [receiver, setReceiver] = useState('');
    const [receiveTime, setReceiveTime] = useState('');
    const [receiveDate, setReceiveDate] = useState(new Date());
    const [timeOptionsReceive, setTimeOptionsReceive] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesDelivery, setImagesDelivery] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [error, setError] = useState('');
    const [isOpenNotificationError, openNotificationError] = useState(false);

    const [deliveryRecordData, setDeliveryRecordData] = useState(null);

    const [checklist, setChecklist] = useState([
        { item: 'Kiểm tra phí vượt quá giới hạn km', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra phí quá giờ', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra phí vệ sinh', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra phí khử mùi', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra ngoại thất', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra nội thất', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra lốp xe', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra đèn xe', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra phụ kiện xe', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra phạt nguội', pass: true, note: '', cost: '' },
        { item: 'Kiểm tra khác', pass: true, note: '', cost: '' }
    ]);

    const getDatetime = (date, time) => {
        const dateObject = new Date(date); // Đối tượng Date
        const timeString = time; // Chuỗi thời gian

        // Phân tích chuỗi thời gian
        const [hours, minutes] = timeString.split(':').map(Number);

        // Tạo một bản sao của đối tượng Date để giữ nguyên dữ liệu gốc
        const dateTimeObject = new Date(dateObject);

        // Gán giờ và phút vào đối tượng DateTime
        dateTimeObject.setHours(hours);
        dateTimeObject.setMinutes(minutes);
        dateTimeObject.setSeconds(0); // Đặt giây thành 0 nếu cần

        console.log(dateTimeObject);
        return dateTimeObject;
    }

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setIsCarouselOpen(true);
    };

    const handleCloseCarousel = () => {
        setIsCarouselOpen(false);
    };
    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy');
    }


    const generateTimeOptions = (start, end) => {
        const times = [];
        for (let hour = start; hour < end; hour++) {
            const hourString = String(hour).padStart(2, '0');
            times.push(`${hourString}:00`);
        }
        return times;
    };

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = [];
        const invalidFiles = [];

        selectedFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            const invalidFileNames = invalidFiles.map(file => file.name).join(', ');
            alert(`Các file không hợp lệ: ${invalidFileNames}`);
        }

        setImages(prevImages => [...prevImages, ...validFiles]);
    };

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleChecklistChange = (index, field, value) => {
        setChecklist((prevChecklist) => {
            // Cập nhật giá trị checklist
            const updatedChecklist = prevChecklist.map((item, i) => {
                if (i === index) {
                    const newValue = field === 'pass' ? value === 'true' : value;
                    const updatedItem = { ...item, [field]: newValue };

                    // Kiểm tra các mục phí vệ sinh và phí khử mùi
                    if (field === 'pass') {
                        if (item.item === 'Kiểm tra phí vệ sinh') {
                            updatedItem.cost = newValue ? '' : (contactData.phivesinh ? contactData.phivesinh / 1000 : 0);
                        }
                        if (item.item === 'Kiểm tra phí khử mùi') {
                            updatedItem.cost = newValue ? '' : (contactData.phikhumui ? contactData.phikhumui / 1000 : 0);
                        }
                    }

                    return updatedItem;
                }
                return item;
            });

            return updatedChecklist;
        });
    };


    const fetchDeliveryRecord = async () => {
        try {
            const contactResponse = await axios.get(`http://localhost:8080/hopdong/detail/${idhopdong}`)
            if (contactResponse.data.success) {
                setContactData(contactResponse.data.data)
                const result = contactResponse.data.data
            }
            const deliveryRecordResponse = await axios.get(`http://localhost:8080/hopdong/bienbangiao/${idhopdong}`)
            if (deliveryRecordResponse.data.success) {
                const result = deliveryRecordResponse.data.data;
                setDeliveryRecordData(result);
                setFuelPercentage(result.phantramxang)
                setFuelLiters(result.xangtheolit)
                setReceiver(result.nguoigiaoxe)
                const imagesDeliveryResponse = await axios.get(`http://localhost:8080/image/${result.idbienbangiao}/bienbangiao`);
                const listImages = imagesDeliveryResponse.data.data
                const listSrc = listImages.map(item => {
                    return `data:image/jpeg;base64,${item.src}`
                })
                setImagesDelivery(listSrc)
            }
        } catch (error) {
            console.error('Error fetching delivery record:', error);
        }
    }

    useEffect(() => {
        if (danhmuc) {
            setChecklist(danhmuc)
        }
        fetchDeliveryRecord();
        if (returnRecord && returnRecord.datetime) {
            setCurrentKm(returnRecord.currentKm)
            setFuelPercentage(returnRecord.fuelPercentage)
            setFuelLiters(returnRecord.fuelLiters)
            setReturnLocation(returnRecord.returnLocation)
            setReceiver(returnRecord.receiver)
            setImages(returnRecord.images)
            const datetime = new Date(returnRecord.datetime); // Đảm bảo datetime là một đối tượng Date
            setReceiveDate(datetime); // Set thẳng datetime vào DatePicker
            setReceiveTime(
                `${datetime.getHours().toString().padStart(2, '0')}:${datetime.getMinutes().toString().padStart(2, '0')}`
            ); // Định dạng HH:mm cho select
        }
        onChangeTimeReturn();


    }, []);

    useEffect(() => {
        const timeOptions = generateTimeOptions(7, 17)
        setTimeOptionsReceive(timeOptions);
        const now = new Date();
        const currentHour = `${now.getHours().toString().padStart(2, '0')}:00`
        if (!timeOptions.includes(currentHour)) {
            const closestTime = timeOptions.find((time) => time >= currentHour) || timeOptions[0];
            setReceiveTime(closestTime);
        } else {
            setReceiveTime(currentHour); // Nếu thời gian hiện tại hợp lệ, sử dụng nó
        }
    }, [])
    const handleSubmit = async () => {

        if (!currentKm || isNaN(currentKm) || currentKm < 0) {
            openNotificationError(true);
            setError('Số km hiện tại không hợp lệ hoặc bị bỏ trống.');
            return;
        }

        if (!returnLocation.trim()) {
            openNotificationError(true);
            setError('Địa điểm trả không được bỏ trống.');
            return;
        }

        if (!receiver.trim()) {
            openNotificationError(true);
            setError('Người nhận không được bỏ trống.');
            return;
        }

        if (!receiveTime.trim()) {
            openNotificationError(true);
            setError('Thời gian nhận không được bỏ trống.');
            return;
        }

        if (!receiveDate) {
            openNotificationError(true);
            setError('Ngày nhận không được bỏ trống.');
            return;
        }

        const failedItems = checklist?.filter(item => item.pass === false).map(item => ({
            ...item,
            cost: (item.cost || 0) * 1000,
            pass: item.pass ? "Đạt" : "Không đạt"
        })) || [];
        const datetime = getDatetime(receiveDate, receiveTime);

        const bienbannhan = {
            idhopdong: idhopdong,
            ngaynhan: datetime,
            sokmhientai: currentKm,
            phantramxang: fuelPercentage,
            xangtheolit: fuelLiters,
            nguoinhanxe: receiver,
            diadiemnhan: returnLocation,
            danhmuc: failedItems
        };

        console.log(bienbannhan);
        try {
            // Xử lý thêm biên bản nhận
            const savedRecord = await axios.post('http://localhost:8080/hopdong/bienbannhan/add', bienbannhan);
            if (!savedRecord.data.success) {
                openNotificationError(true);
                setMessage('Lỗi khi thêm biên bản nhận, vui lòng thử lại.');
                return;
            }

            console.log("Thêm biên bản nhận thành công");
            const result = savedRecord.data.data;

            // Xử lý thêm hình ảnh
            const formData = new FormData();
            images.forEach((image) => {
                formData.append('images', image);
            });
            formData.append('id', result.idbienbannhan);
            formData.append('loai', 'bienbannhan');

            const responseImage = await axios.post('http://localhost:8080/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!responseImage.data.success) {
                openNotificationError(true);
                setMessage('Thêm hình ảnh thất bại');
                return;
            }

            navigate(-1);
        } catch (error) {
            console.error('Error occurred:', error);
            openNotificationError(true);
            setError('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };


    const handleClickBack = () => {
        navigate(-1);
    };

    const onChangeCurrentKm = (e) => {
        setCurrentKm(e.target.value)
        const kmhientai = e.target.value
        if (kmhientai > deliveryRecordData.sokmhientai + contactData.sokmgioihanchuyendi) {
            const sokmvuotquagioihan = kmhientai - (deliveryRecordData.sokmhientai + contactData.sokmgioihanchuyendi)
            setChecklist((prevChecklist) =>
                prevChecklist.map((item) => {
                    if (item.item === 'Kiểm tra phí vượt quá giới hạn km') {
                        return {
                            ...item,
                            cost: (contactData.phutroiquangduong * sokmvuotquagioihan / 1000) || 0,
                            pass: false
                        };
                    }
                    return item;
                })
            );
        }
        if (kmhientai <= deliveryRecordData.sokmhientai + contactData.sokmgioihanchuyendi) {
            setChecklist((prevChecklist) =>
                prevChecklist.map((item) => {
                    if (item.item === 'Kiểm tra phí vượt quá giới hạn km') {
                        return {
                            ...item,
                            cost: '',
                            pass: true
                        };
                    }
                    return item;
                })
            );
        }
    }

    const onChangeTimeReturn = () => {
        const thoigianketthuc = new Date(contactData?.thoigianketthuc); // Thời gian kết thúc thuê xe
        const thoigiannhanxe = getDatetime(receiveDate, receiveTime); // Thời gian trả xe thực tế

        if (thoigiannhanxe > thoigianketthuc) {
            // Tính số phút quá giờ
            const overTimeHours = Math.ceil((thoigiannhanxe - thoigianketthuc) / (1000 * 60 * 60));
            const overTimeCost = (contactData.phutroithoigian * overTimeHours) / 1000; // Phí quá giờ

            setChecklist((prevChecklist) =>
                prevChecklist.map((item) => {
                    if (item.item === 'Kiểm tra phí quá giờ') {
                        return {
                            ...item,
                            cost: overTimeCost, // Làm tròn 2 chữ số sau dấu thập phân
                            pass: false, // Đánh dấu không đạt vì có phí quá giờ
                        };
                    }
                    return item;
                })
            );
        } else {
            // Nếu không quá giờ, đặt lại trạng thái pass và xoá phí
            setChecklist((prevChecklist) =>
                prevChecklist.map((item) => {
                    if (item.item === 'Kiểm tra phí quá giờ') {
                        return {
                            ...item,
                            cost: '',
                            pass: true,
                        };
                    }
                    return item;
                })
            );
        }
    };

    useEffect(() => {
        onChangeTimeReturn();
    }, [receiveDate, receiveTime])


    return (
        <div className='flex flex-col bg-slate-100 p-10 min-h-screen'>
            <div className='flex justify-center items-center mt-10'>
                <button onClick={handleClickBack} className='bg-slate-400 p-3 rounded-lg text-white hover:bg-slate-500'>Quay lại</button>
                <div className='flex-grow'>
                    <h1 className='text-center text-2xl font-semibold'>Thêm biên bản nhận xe</h1>
                </div>
            </div>
            <div className='grid grid-cols-12 mt-10 text-sm gap-2'>
                <div className='col-span-6 rounded-lg shadow-lg bg-white'>
                    {deliveryRecordData && contactData ? (
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
                                <h2 className="text-base font-semibold text-gray-700 ">Xe thuê</h2>
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
                                <h2 className=" text-base font-semibold text-gray-700">Nội dung biên bản giao xe</h2>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <p><strong className='font-medium text-gray-600'>Người giao xe:</strong> {deliveryRecordData.nguoigiaoxe}</p>
                                    <p><strong className='font-medium text-gray-600'>Ngày giao:</strong> {new Date(deliveryRecordData.ngaygiao).toLocaleString()}</p>
                                    <p><strong className='font-medium text-gray-600'>Địa điểm giao:</strong> {deliveryRecordData.diadiemgiao}</p>
                                    <p><strong className='font-medium text-gray-600'>Số KM lúc giao:</strong> {deliveryRecordData.sokmhientai.toLocaleString()} km</p>
                                    <p><strong className='font-medium text-gray-600'>Phần trăm xăng:</strong> {deliveryRecordData.phantramxang}%</p>
                                    <p><strong className='font-medium text-gray-600'>Số lít xăng:</strong> {deliveryRecordData.xangtheolit} L</p>
                                    <p><strong className='font-medium text-gray-600'>Tình trạng xe:</strong> {deliveryRecordData.tinhtrangxe}</p>
                                    <p><strong className='font-medium text-gray-600'>Phụ kiện kèm theo:</strong> {deliveryRecordData.phukienkemtheo}</p>
                                </div>
                            </div>
                            <div className='flex-col space-y-2'>

                            </div>
                            <div className='mt-6'>
                                <h3 className='text-lg font-semibold'>Hình Ảnh Biên Bản Giao</h3>
                                <div className='grid grid-cols-3 gap-4 mt-4'>
                                    {imagesDelivery.map((src, index) => (
                                        <img
                                            key={index}
                                            src={src}
                                            alt={`Hình ảnh giao xe ${index + 1}`}
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
                <div className='col-span-6 flex-col bg-white p-8 rounded-lg shadow-lg'>
                    <p className='text-red-600 italic'>Thời điểm nhận xe được tính khi xe có mặt tại nơi nhận xe.</p>
                    <div className='grid grid-cols-2 gap-6 mt-5'>
                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Số km nhận xe</label>
                            <input
                                value={currentKm}
                                onChange={(e) => onChangeCurrentKm(e)}
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Nhập số km hiện tại'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-medium mb-2'>Phần trăm xăng</label>
                            <select
                                value={fuelPercentage}
                                onChange={(e) => setFuelPercentage(e.target.value)}
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            >
                                <option value="">Chọn % xăng</option>
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

                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-medium mb-2'>Số lít xăng</label>
                            <input
                                value={fuelLiters}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(value) && Number(value) >= 0 && value.length <= 3) {
                                        setFuelLiters(value);
                                    }
                                }}
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Nhập số lít xăng'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Địa điểm nhận</label>
                            <input
                                type='text'
                                value={returnLocation}
                                onChange={(e) => setReturnLocation(e.target.value)}
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Nhập địa điểm'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Người lập biên bản nhận xe</label>
                            <input
                                type='text'
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Nhập tên người nhận xe'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-gray-700 font-medium mb-2'><span className='text-red-600'>* </span>Thời gian nhận xe</label>
                            <div className="flex">
                                <DatePicker
                                    selected={receiveDate}
                                    onChange={(date) => setReceiveDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholderText="Chọn ngày kết thúc"
                                    aria-label="Chọn ngày nhận"
                                />

                                <select
                                    value={receiveTime}
                                    onChange={(e) => setReceiveTime(e.target.value)}
                                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Chọn thời gian nhận"
                                >
                                    {timeOptionsReceive.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>



                    {/* <div className='flex flex-col mt-2'>
                        <label className='text-gray-700 font-medium mb-2'>Tình trạng xe</label>
                        <textarea
                            rows='4'
                            value={carCondition}
                            onChange={(e) => setCarCondition(e.target.value)}
                            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Mô tả tình trạng xe'
                        ></textarea>
                    </div> */}

                    {/* <div className='flex flex-col mt-2'>
                        <label className='text-gray-700 font-medium mb-2'>Phụ kiện kèm theo</label>
                        <textarea
                            rows='4'
                            value={accessories}
                            onChange={(e) => setAccessories(e.target.value)}
                            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Nhập danh sách phụ kiện kèm theo'
                        ></textarea>
                    </div> */}

                    <div className='flex flex-col space-y-3 mt-5'>
                        <p className='text-red-600 text-sm italic'>Vui lòng thêm hình ảnh xe có tình trạng khác với khi giao xe.</p>
                        <div className="mt-10">
                            <h3 className="text-lg font-bold mb-4">Hình ảnh xe</h3>
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
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Upload Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                        >
                                            <IoIosCloseCircle size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h3 className="text-lg font-bold mb-2">Checklist Kiểm Tra</h3>
                        <p className='text-red-600 italic text-sm mb-2'>Thông tin kiểm tra sẽ được căn cứ và lập hoá đơn thanh toán cho khách thuê, vui lòng điền thông tin chi tiết cho từng mục kiểm tra.</p>
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Hạng mục</th>
                                    <th className="border border-gray-300 px-4 py-2">Đạt</th>
                                    <th className="border border-gray-300 px-4 py-2">Ghi chú</th>
                                    <th className="border border-gray-300 px-4 py-2">Chi phí</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklist.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 px-4 py-2">{item.item}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <select
                                                value={item.pass}
                                                onChange={(e) => handleChecklistChange(index, 'pass', e.target.value)}
                                                className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="true">Đạt</option>
                                                <option value="false">Không đạt</option>
                                            </select>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <input
                                                type="text"
                                                value={item.note}
                                                onChange={(e) => handleChecklistChange(index, 'note', e.target.value)}
                                                className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 ">
                                            <div className='flex items-center space-x-1 justify-start'>
                                                <input
                                                    type="text"
                                                    value={item.cost}
                                                    onChange={(e) => handleChecklistChange(index, 'cost', e.target.value)}
                                                    className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <p>k</p></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex justify-center mt-5'>
                        <button
                            onClick={handleSubmit}
                            className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600'
                        >
                            Lưu biên bản
                        </button>
                    </div>
                </div>
            </div>
            {isCarouselOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center z-50">
                    <button
                        onClick={handleCloseCarousel}
                        className="absolute top-5 right-5 text-white text-3xl"
                    >
                        <IoIosCloseCircle />
                    </button>
                    <img
                        src={imagesDelivery[selectedImageIndex]}
                        alt={`Hình ảnh ${selectedImageIndex + 1}`}
                        className="max-w-[90%] max-h-[90%]"
                    />
                    <button
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : imagesDelivery.length - 1))}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => setSelectedImageIndex((prev) => (prev < imagesDelivery.length - 1 ? prev + 1 : 0))}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                    >
                        &gt;
                    </button>
                </div>
            )}
            <NotificationError isOpen={isOpenNotificationError} closeModal={() => {
                openNotificationError(false)
                setError('')
            }} message={error} />
        </div>
    );
};

export default AddreturnRecord;
