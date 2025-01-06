import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import ReactModal from 'react-modal'
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { PiSeatLight } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { LuFuel } from "react-icons/lu";
import { LiaSuperpowers } from "react-icons/lia";
import { CiCreditCard2, CiSettings } from "react-icons/ci";
import { IoCarSportOutline, IoEarth } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, setDay } from 'date-fns';
import { UserContext } from '../ContextApi/UserContext';
import LoginModal from './LoginModal';
import Notification from './Notification';
import { Link } from 'react-router-dom';


const InformationCar = ({ isOpen, closeModal, idxe }) => {

    const { user } = useContext(UserContext);
    const [showCarousel, setShowCarousel] = useState(false);
    const [carData, setCarData] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);

    const [imagesData, setImageData] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);


    const now = new Date();
    const currentHour = now.getHours();

    // Thiết lập thời gian nhận xe


    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [minDate, setMinDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [rentalPrice, setRentalPrice] = useState(0);
    const [insurancePrice, setInsurancePrice] = useState(0);
    const [pricePerHours, setPricePerHours] = useState(70000);
    const [hours, setHours] = useState();
    const [totalDay, setTotalDay] = useState(1);
    const [totalPrice, setTotalPrice] = useState(rentalPrice + insurancePrice);
    const [finalPrice, setFinalPrice] = useState(totalPrice); // Thành tiền

    const [overLimitDistanceFee, setOverLimitDistanceFee] = useState(5);
    const [overtimeFee, setOvertimeFee] = useState(50);
    const [cleaningFee, setCleaningFee] = useState(100);
    const [deodorizingFee, setDeodorizingFee] = useState(400);

    // Limits
    const [dailyDistanceLimit, setDailyDistanceLimit] = useState(300);
    const [hourlyFeeLimit, setHourlyFeeLimit] = useState(5);

    const [isOpenLogin, setLoginModalOpen] = useState(false);
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [message, setMessage] = useState('');

    const [isAgreed, setIsAgreed] = useState(false);

    const [error, setError] = useState('');

    const calculateRentalDuration = (startDate, startTime, endDate, endTime) => {

        console.log("Start Date:", startDate);
        console.log("Start Time:", startTime);
        console.log("End Date:", endDate);
        console.log("End Time:", endTime);

        if (!startTime || !endTime || !startDate || !endDate) {
            return { days: 0, hours: 0 };
        }
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        // Tạo đối tượng Date cho ngày giờ nhận và trả xe
        const startDateTime = new Date(startDate);
        startDateTime.setHours(startHour, startMinute, 0, 0);

        const endDateTime = new Date(endDate);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        // Tính khoảng cách thời gian bằng mili giây
        const durationMs = endDateTime - startDateTime;

        // Chuyển đổi sang số ngày và giờ
        const days = Math.floor(durationMs / (24 * 60 * 60 * 1000));
        const hours = Math.floor((durationMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

        return { days, hours };
    };

    const updateTotalPrice = (days, hours) => {
        // Calculate cost based on total days and hourly rate if applicable
        const baseRentalCost = rentalPrice * days + (hours > hourlyFeeLimit ? rentalPrice : pricePerHours * hours);
        const newTotal = baseRentalCost + insurancePrice;
        setTotalPrice(newTotal);
        setFinalPrice(newTotal);
    };

    const generateTimeOptions = (start, end) => {
        const times = [];
        for (let hour = start; hour < end; hour++) {
            const hourString = String(hour).padStart(2, '0');
            times.push(`${hourString}:00`);
        }
        return times;
    };
    const [timeOptionsStart, setTimeOptionsStart] = useState([]);
    const [timeOptionsEnd, setTimeOptionsEnd] = useState([]);

    useEffect(() => {
        // Calculate the rental duration every time dates or times change
        const { days, hours } = calculateRentalDuration(startDate, startTime, endDate, endTime);
        setHours(hours);
        setTotalDay(days);
        if (hours > hourlyFeeLimit) {
            setHours(0);
            setTotalDay(days + 1);
        }
        // Count any remaining hours as an extra day
        updateTotalPrice(days, hours);
    }, [startDate, startTime, endDate, endTime]);

    useEffect(() => {
        // Recalculate total price whenever rentalPrice or insurancePrice changes
        updateTotalPrice(totalDay, hours);
    }, [rentalPrice, insurancePrice, totalDay, hours]);

    useEffect(() => {
        const today = new Date();
        const isToday = startDate.toDateString() === today.toDateString();


        const nextDay = new Date(startDate);
        nextDay.setDate(startDate.getDate() + 1);
        setEndDate(nextDay);

        if (isToday && currentHour < 12 && currentHour >= 7) {
            setTimeOptionsStart(generateTimeOptions(currentHour + 2, 17));
            setStartTime(`${currentHour + 2}:00`)
            setEndTime('7:00')
        }
        if (isToday && currentHour < 12 && currentHour < 7) {
            setTimeOptionsStart(generateTimeOptions(7, 17));
            setStartTime('7:00')
            setEndTime('7:00')
        }
        if (isToday && currentHour >= 12) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setMinDate(tomorrow);
            setStartDate(tomorrow);
            setTimeOptionsStart(generateTimeOptions(7, 17));
            setStartTime('7:00')
            setEndTime('7:00')
        }

        if (startDate > today) {
            setTimeOptionsStart(generateTimeOptions(7, 17));
            setStartTime('7:00')
            setEndTime('7:00')
        }
        setTimeOptionsEnd(generateTimeOptions(7, 17));
    }, [startDate]);


    const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
    const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesData.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? imagesData.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
            fetchImages();
        }
    }, [isOpen])

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/xe/${idxe}`);
            if (response.data.success === true) {
                const car = response.data.data;
                setCarData(car);
                setRentalPrice(car.giahientai * 1000)
                setPricePerHours(car.phiquagio * 1000)
                setOverLimitDistanceFee(car.phivuotgioihan * 1000)
                setOvertimeFee(car.phiquagio * 1000)
                setCleaningFee(car.phivesinh * 1000)
                setDeodorizingFee(car.phikhumui * 1000)
                setDailyDistanceLimit(car.kmgioihan)
                setHourlyFeeLimit(car.gioihanphitheogio)
            }
        } catch (error) {
            console.log(error.response.data.data);
        }
    }

    const fetchImages = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/image/${idxe}/xe`)
            const listImages = response.data.data
            const listSrc = listImages.map(item => {
                return `data:image/jpeg;base64,${item.src}`
            })
            setImageData(listSrc)
        } catch (error) {
            console.log('Lỗi');
        }
    }

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

    const handleSubmitRent = async () => {
        if (!isAgreed) {
            setError("Vui lòng xác nhận rằng bạn đã đọc và đồng ý với các điều khoản.")
            return;
        }
        if (carData.trangthai != 'cothethue') {
            setError("Xe bạn vừa chọn có thể đã được thuê trước, vui lòng chọn xe khác.")
            return;
        }
        const thoigianbatdau = getDatetime(startDate, startTime);
        const thoigianketthuc = getDatetime(endDate, endTime);
        const requestContact = {
            idxe: carData.idxe,
            sodienthoai: user.khachhang.sodienthoai,
            thoigianbatdau: thoigianbatdau,
            thoigianketthuc: thoigianketthuc,
            giathuemotngay: rentalPrice,
            songaythue: totalDay,
            sogiothue: hours,
            phutroithoigian: overtimeFee,
            sokmgioihan: dailyDistanceLimit,
            phutroiquangduong: overLimitDistanceFee,
            gioihanphitheogio: hourlyFeeLimit,
            tiendatcoc: finalPrice * 0.3,
            giathuetong: finalPrice,
            ngaytao: new Date(),
            phivesinh: cleaningFee,
            phikhumui: deodorizingFee,
            sokmgioihanchuyendi: dailyDistanceLimit * totalDay
        }
        console.log(requestContact);
        try {
            const response = await axios.post('http://localhost:8080/hopdong/dang-ky', requestContact);
            if (response.data.success === true) {
                setShowConfirm(false);
                setIsOpenNotification(true);
                setMessage("Yêu cầu thuê xe đã được gửi, vui lòng kiểm tra thông báo thường xuyên để đặt cọc.")
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleClickRent = async () => {
        if (!user) {
            setLoginModalOpen(true);
            return;
        }
        if (!user.gplx) {
            setIsOpenNotification(true)
            setMessage("Vui lòng thêm thông tin giấy phép lái xe tại phần thông tin cá nhân trước khi thuê.")
            return;
        }
        if (carData.trangthai === 'dangduocthue') {
            setIsOpenNotification(true)
            setMessage("Xe bạn chọn vừa được người khác thuê, vui lòng chọn xe khác.")
            return;
        }
        setShowConfirm(true);
    }

    const [reviews, setReviews] = useState([]); // State để lưu danh sách đánh giá
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu không

    const pageSize = 5; // Số lượng đánh giá trên mỗi trang

    const fetchReviews = async (page = 1) => {

        try {
            const response = await axios.get('http://localhost:8080/xe/danhgia', {
                params: { idxe: idxe, page, pageSize },
            });
            if (response.data.success) {
                const newReviews = response.data.data; // Lấy danh sách đánh giá
                setReviews((prevReviews) => [...prevReviews, ...newReviews]); // Ghép thêm dữ liệu mới
                setHasMore(newReviews.length === pageSize); // Kiểm tra xem có thêm dữ liệu không
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đánh giá:', error);
        }
    };

    // Gọi hàm fetchReviews khi component được mở
    useEffect(() => {
        if (isOpen) {
            setReviews([]); // Xóa dữ liệu cũ khi mở lại modal
            setCurrentPage(1); // Reset trang về 1
            fetchReviews(1); // Gọi trang đầu tiên
        }
    }, [isOpen]);

    const loadMoreReviews = () => {
        if (hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchReviews(nextPage);
        }
    };
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className=' bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto '
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10'>
            <h1 className=' text-center text-2xl font-semibold'>
                Thông tin xe
            </h1>
            {/* Hình ảnh chính và phụ */}
            <div className='grid grid-cols-3 gap-6 p-4 h-auto'>
                {/* Hình chính */}
                <div className='col-span-2 h-full'>
                    {imagesData && (
                        <img
                            onClick={() => setShowCarousel(true)}
                            src={imagesData[0]}
                            alt='Hình chính'
                            className='w-full rounded-lg shadow-lg object-contain h-full border cursor-pointer'
                        />
                    )}
                </div>
                {/* Hình phụ */}
                <div className='col-span-1 h-full'>
                    <div className='grid grid-rows-2 gap-3'>
                        {imagesData.slice(1, 4).map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Hình phụ ${index + 1}`}
                                className=' h-full rounded-lg shadow-lg object-contain w-full border cursor-pointer'
                                onClick={() => setShowCarousel(true)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* Thông tin xe */}
            {carData && (
                <div className='grid grid-cols-12 mt-6 gap-8'>
                    <div className='col-span-8'>
                        <h1 className='font-semibold text-4xl'>{carData.tenhangxe} {carData.tendongxe} {new Date(carData.namsanxuat).getFullYear()}</h1>
                        <div className='mt-6'>
                            <div className='mt-6'>
                                <h2 className='text-xl font-semibold mb-4'>Đặc điểm</h2>
                                <div className="flex justify-between items-center  p-6 bg-white space-x-4">
                                    <div className='grid grid-rows-2 gap-4'>
                                        <div className="flex justify-start items-center space-x-4">
                                            <CiCreditCard2 size={40} className="text-blue-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Biển số xe</p>
                                                <p className="font-semibold text-gray-800">{carData.biensoxe}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <IoCarSportOutline size={40} className="text-red-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Kiểu dáng</p>
                                                <p className="font-semibold text-gray-800">{carData.kieudang}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-rows-2 gap-4'>
                                        <div className="flex items-center space-x-4">
                                            <IoEarth size={40} className="text-green-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Xuất xứ</p>
                                                <p className="font-semibold text-gray-800">{carData.xuatxu}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <CiSettings size={40} className="text-purple-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Dẫn động</p>
                                                <p className="font-semibold text-gray-800">{carData.dandong}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-rows-2 gap-4'>
                                        <div className="flex justify-start items-center space-x-4">
                                            <GiGearStickPattern size={40} className="text-yellow-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Truyền động</p>
                                                <p className="font-semibold text-gray-800">{carData.hopso}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <PiSeatLight size={40} className="text-indigo-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Số ghế</p>
                                                <p className="font-semibold text-gray-800">{carData.sochongoi}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-rows-2 gap-4'>
                                        <div className="flex items-center space-x-4">
                                            <LuFuel size={40} className="text-orange-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Nhiên liệu</p>
                                                <p className="font-semibold text-gray-800">{carData.nhienlieu}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <LiaSuperpowers size={40} className="text-pink-600" />
                                            <div className="grid">
                                                <p className="text-sm text-gray-500">Động cơ</p>
                                                <p className="font-semibold text-gray-800">{carData.dongco}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='border-gray-300' />
                            <div className='mt-6'>
                                <h2 className='font-semibold text-xl mt-6'>Thông tin mô tả</h2>
                                <div className='p-6'><p>{carData.thongtinmota}</p>
                                </div>
                            </div>
                            <div className='mt-6'>
                                <h2 className='font-semibold text-xl mt-6'>Vị trí nhận xe</h2>
                                <div className='p-6'>
                                    <p>Xe được giao cho khách thuê tại cơ sơ thuê xe với địa chỉ: 97 Man Thiện</p>
                                </div>
                            </div>
                            <hr className='border-gray-300' />
                            <div className='mt-6'>
                                <h2 className='font-semibold text-xl mt-6 mb-6 inline-flex items-center'>Giấy tờ thuê xe <GoQuestion className='ml-2' /></h2>
                                <div className='border p-6 border-gray-300 shadow-lg rounded-xl bg-white'>
                                    <p>GPLX (Đối chiếu) & CCCD (Đối chiếu VNeID)</p>
                                </div>
                            </div>
                            <div className='mt-6'>
                                <h2 className='font-semibold text-xl mt-6 mb-6 inline-flex items-center'>Tài sản thế chấp<GoQuestion className='ml-2' /></h2>
                                <div className='border p-6 border-gray-300 shadow-lg rounded-xl bg-white'>
                                    <p>15 triệu (tiền mặt/chuyển khoản cho chủ xe khi nhận xe) hoặc Xe máy (kèm cà vẹt gốc) giá trị 15 triệu</p>
                                </div>
                            </div>
                            <div className='mt-6'>
                                <h2 className='font-semibold text-xl mt-6 mb-6 inline-flex items-center'>Điều khoản</h2>
                                <div className='border p-6 border-gray-300 shadow-lg rounded-xl bg-white'>
                                    <ul className='list-disc list-inside text-gray-700 space-y-2 mb-6'>
                                        <p>Quy định khác:</p>
                                        <li>Sử dụng xe đúng mục đích</li>
                                        <li>Không sử dụng xe với mục đích phi pháp, trái pháp luật</li>
                                        <li>Không sử dụng xe để cầm cố, thế chấp</li>
                                        <li>Không hút thuốc, nhả kẹo cao su, xả rác trong xe</li>
                                        <li>Không chở hàng quốc cấm, dễ cháy nổ</li>
                                        <li>Không chở hoa quả, thực phẩm nặng mùi trong xe</li>
                                        <li>Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.</li>
                                        <p>Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời !</p>
                                    </ul>
                                </div>
                            </div>
                            <div className='mt-6'>
                                <h2 className='font-semibold text-xl mt-6 mb-6 inline-flex items-center'>Chính sách huỷ chuyến</h2>
                                <div className='border p-6 border-gray-300 shadow-lg rounded-xl bg-white'>
                                    <table class="w-full border border-black rounded-lg overflow-hidden">
                                        <thead>
                                            <tr class="">
                                                <th class="px-4 py-2 text-left">Thời điểm Huỷ Chuyến</th>
                                                <th class="px-4 py-2 text-left">Phí huỷ chuyến</th>
                                                <th class="px-4 py-2 text-left">Số tiền cọc trả</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="border-b border-gray-200">
                                                <td class="px-4 py-2">Trong vòng một giờ sau khi đặt cọc</td>
                                                <td class="px-4 py-2">0% Tiền cọc</td>
                                                <td class="px-4 py-2">100% Tiền cọc</td>
                                            </tr>
                                            <tr class="bg-gray-50 border-b border-gray-200">
                                                <td class="px-4 py-2">Hơn 7 ngày trước khởi hành</td>
                                                <td class="px-4 py-2">30% Tiền cọc</td>
                                                <td class="px-4 py-2">70% Tiền cọc</td>
                                            </tr>
                                            <tr class="border-b border-gray-200">
                                                <td class="px-4 py-2">7 ngày hoặc ít hơn trước chuyến đi</td>
                                                <td class="px-4 py-2">100% Tiền cọc</td>
                                                <td class="px-4 py-2">0% Tiền cọc</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h2 className="font-semibold text-2xl mt-6 mb-6 inline-flex items-center text-gray-800">
                                    <i className="fas fa-star text-yellow-500 mr-2"></i> Đánh giá
                                </h2>
                                <div className="border p-6 border-gray-300 shadow-lg rounded-xl bg-white">
                                    <div>

                                        <ul className="space-y-4">
                                            {reviews.map((review, index) => (
                                                <li
                                                    key={index}
                                                    className="p-4 border-b border-gray-200 last:border-none rounded-lg hover:bg-gray-50"
                                                >
                                                    <p className="text-gray-800">
                                                        <strong className="text-gray-900">{review.hovaten}</strong>: {review.noidungdanhgia}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Đánh giá:
                                                        <span className="text-yellow-500 font-bold ml-1">{review.sao}/5</span>
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                        {hasMore && (
                                            <div className="text-center mt-6">
                                                <button
                                                    onClick={loadMoreReviews}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                >
                                                    Xem thêm
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='col-span-4'>
                        <h2 className='text-xl font-semibold mb-4'>Thông tin đặt xe</h2>
                        <div className="flex justify-between space-x-4">
                            <div className="flex flex-col w-full bg-gray-50 rounded-lg p-4 shadow-md">
                                <label className="text-sm text-gray-600 font-medium">Ngày bắt đầu</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                    placeholderText="Chọn ngày bắt đầu"
                                    minDate={minDate}
                                />
                                <div className="mt-2">
                                    <label className="text-sm text-gray-600 font-medium">Nhận xe</label>
                                    <select
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="border p-2 rounded-md w-full mt-1"
                                    >
                                        {timeOptionsStart.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col w-full bg-gray-50 rounded-lg p-4 shadow-md">
                                <label className="text-sm text-gray-600 font-medium">Ngày kết thúc</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                    placeholderText="Chọn ngày kết thúc"
                                    minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                                />
                                <div className="mt-2">
                                    <label className="text-sm text-gray-600 font-medium">Trả xe</label>
                                    <select
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="border p-2 rounded-md w-full mt-1"
                                    >
                                        {timeOptionsEnd.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col p-4 bg-white rounded-lg border mt-3'>
                            <div className='flex justify-between mb-2'>
                                <p className='font-semibold'>Đơn giá thuê ngày</p>
                                <p>{rentalPrice.toLocaleString()}đ/ngày</p>

                            </div>
                            <div className='flex justify-between mb-2'>
                                <p className='font-semibold'>Đơn giá thuê giờ</p>
                                <p>{overtimeFee.toLocaleString()}đ/giờ</p>
                            </div>
                            <div className='flex justify-between mb-2'>
                                <p className='font-semibold flex items-center'>Số ngày thuê  <GoQuestion className='ml-2' /></p>
                                <p>{totalDay} ngày {hours} giờ</p>
                            </div>
                            <div className='flex justify-between mb-2'>
                                <p className='font-semibold'>Tổng cộng</p>
                                <p>{totalPrice.toLocaleString()}đ/ngày</p>
                            </div>
                            <div className='flex justify-between mb-2'>
                                <p className='font-semibold'>Thành tiền</p>
                                <p>{finalPrice.toLocaleString()}đ/ngày</p>
                            </div>
                            <div className='flex justify-center mt-4'>
                                <button
                                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                                    onClick={handleClickRent} // Gọi hàm cập nhật tổng khi nhấn nút
                                >
                                    Chọn thuê
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col p-4 bg-white rounded-lg  mt-5 space-y-3 border'>
                            <h1 className='font-semibold'>Phụ phí có thể phát sinh</h1>
                            <div>
                                <div className='flex justify-between'><p className='font-semibold text-sm'>Phí vượt quá giới hạn</p><p className='text-sm font-sans'>{overLimitDistanceFee.toLocaleString()}đ/km</p></div>
                                <p className='text-sm text-gray-500'>Phụ phí phát sinh nếu lộ trình di chuyển vượt quá {dailyDistanceLimit} khi thuê xe 1 ngày</p>
                            </div>
                            <div><div className='flex justify-between'><p className='font-semibold text-sm'>Phí quá giờ</p><p className='text-sm font-sans'>{overtimeFee.toLocaleString()}đ/h</p></div>
                                <p className='text-sm text-gray-500'>Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá {hourlyFeeLimit} giờ, phụ phí thêm 1 ngày thuê</p></div>
                            <div><div className='flex justify-between'><p className='font-semibold text-sm'>Phí vệ sinh</p><p className='text-sm font-sans'>{cleaningFee.toLocaleString()}đ</p></div>
                                <p className='text-sm text-gray-500'>Phụ phí phát sinh khi xe hoàn trả không đảm bảo vệ sinh (nhiều vết bẩn, bùn cát, sình lầy...)</p></div>
                            <div><div className='flex justify-between'><p className='font-semibold text-sm'>Phí khử mùi</p><p className='text-sm font-sans'>{deodorizingFee.toLocaleString()}đ</p></div>
                                <p className='text-sm text-gray-500'>Phụ phí phát sinh khi xe hoàn trả bị ám mùi khó chịu (mùi thuốc lá, thực phẩm nặng mùi...)</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal carousel để xem toàn bộ hình ảnh */}
            {showCarousel && (
                <ReactModal
                    isOpen={showCarousel}
                    onRequestClose={() => setShowCarousel(false)}
                    className='relative bg-black rounded-lg shadow-lg p-6 w-screen h-screen overflow-hidden'
                    overlayClassName='fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-20'>

                    {/* Nút đóng */}
                    <FaTimes size={20} color='white' onClick={() => setShowCarousel(false)} className="absolute top-5 right-5  z-30 cursor-pointer" />

                    <div className='relative flex items-center justify-center h-full w-full'>
                        {/* Nút điều hướng trước */}
                        <FaArrowLeft
                            size={20}
                            color='white'
                            onClick={handlePrev}
                            className='absolute top-1/2 left-2 cursor-pointer'
                        />
                        {/* Carousel */}
                        <div className="flex items-center overflow-hidden w-[70%] h-screen px-16 justify-center">
                            <div
                                className="flex items-center transition-transform duration-500"
                                style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${imagesData.length * 100}%` }}
                            >
                                {imagesData.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`Carousel image ${index + 1}`}
                                        className='flex-shrink-0 w-full h-screen rounded-md shadow-md object-contain p-4'
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Nút điều hướng tiếp theo */}
                        <FaArrowRight
                            size={20}
                            color='white'
                            onClick={handleNext}
                            className='absolute right-4 top-1/2 cursor-pointer'
                        />
                    </div>
                </ReactModal>

            )}
            {confirm && (
                <ReactModal
                    isOpen={showConfirm}
                    onRequestClose={() => {
                        setShowConfirm(false)
                        setError('')
                    }}
                    className="bg-white rounded-lg shadow-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
                >
                    <div className="space-y-3">
                        <h1 className="text-center font-bold text-xl text-gray-800">
                            Xác nhận thuê xe
                        </h1>
                        <p className="text-sm text-gray-600 italic text-center">
                            Thông tin đặt xe sẽ được gửi để nhân viên kiểm duyệt. Vui lòng kiểm tra kỹ thông tin.
                        </p>
                        {carData && (
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <span className="font-semibold">Xe thuê:</span> {carData.tenhangxe}{" "}
                                    {carData.tendongxe}
                                </p>
                                <p>
                                    <span className="font-semibold">Nhận xe:</span>{" "}
                                    {startDate.toLocaleDateString()} {startTime}
                                </p>
                                <p>
                                    <span className="font-semibold">Trả xe:</span>{" "}
                                    {endDate.toLocaleDateString()} {endTime}
                                </p>
                                <p>
                                    <span className="font-semibold">Thời gian tính thuê:</span>{" "}
                                    {totalDay} ngày {hours} giờ
                                </p>
                                <p>
                                    <span className="font-semibold">Số km có thể chạy trong chuyến đi:</span>{" "}
                                    {dailyDistanceLimit * totalDay} km
                                </p>
                                <p>
                                    <span className="font-semibold">Tổng tiền thuê xe:</span>{" "}
                                    {finalPrice.toLocaleString()} VND
                                </p>
                                <p>
                                    <span className="font-semibold">Tiền đặt cọc:</span>{" "}
                                    {(finalPrice * 0.3).toLocaleString()} VND
                                </p>
                            </div>
                        )}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                                Tôi đã đọc và đồng ý với các <Link
                                    to="/terms-and-conditions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 cursor-pointer hover:underline"
                                >
                                    điều khoản thuê xe
                                </Link>.
                            </label>
                        </div>
                        {error && <p className='text-red-600 italic text-sm'>{error}</p>}
                        <div className="flex justify-center">
                            <button onClick={handleSubmitRent} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                                Xác nhận thuê
                            </button>
                        </div>
                    </div>
                </ReactModal>
            )}
            <Notification isOpen={isOpenNotification} closeModal={() => setIsOpenNotification(false)} message={message} />
            <LoginModal isOpen={isOpenLogin} setLoginModalOpen={setLoginModalOpen} />
        </ReactModal >
    )
}
export default InformationCar