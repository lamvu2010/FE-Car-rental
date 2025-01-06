import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'
import Notification from '../components/Notification'
import ReactModal from 'react-modal';
import { UserContext } from '../ContextApi/UserContext';
import Hopdong from './Hopdong';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ContractPDF from '../components/ContactPDF';

const ContractDetail = () => {
    const { user } = useContext(UserContext);
    const { idhopdong } = useParams();
    const [contactData, setContactData] = useState(null);
    const [reload, setReload] = useState(false);
    const [lido, setLido] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const [issueDescription, setIssueDescription] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState({ lat: 10.762622, lng: 106.660172 });
    const [selectedAddress, setSelectedAddress] = useState("");
    const [mapRef, setMapRef] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phuongThuc, setPhuongThuc] = useState('tienmat');
    const [nganHang, setNganHang] = useState('');
    const [soTaiKhoan, setSoTaiKhoan] = useState('');

    const [imgGPLX, setImgGPLX] = useState('');
    const [imagesCar, setImagesCar] = useState([]);
    const [imageHoantien, setImageHoanTien] = useState(null);
    const [issueImages, setIssueImages] = useState([]);
    const [imagesDelivery, setImagesDelivery] = useState([]);
    const [imagesReturn, setImagesReturn] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState('');

    const [isOpenNotification, openNotification] = useState(false);

    const [message, setMessage] = useState('')
    const [error, setError] = useState('');
    const handleImageClick = () => {
        setIsModalOpen(true);
        setModalState('gplx');
    };

    const navigate = useNavigate();

    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy');
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/detail/${idhopdong}`);
            if (response.data.success) {
                const result = response.data.data;
                setContactData(result);
                const imgsCar = await axios.get(`http://localhost:8080/image/${result.idxe}/xe`)
                const listImages = imgsCar.data.data
                const listSrc = listImages.map(item => {
                    return `data:image/jpeg;base64,${item.src}`
                })
                setImagesCar(listSrc)
                if (result.sogplx) {
                    const imgGplx = await axios.get(`http://localhost:8080/image/a/${result.idgiaypheplaixe}/gplx`);
                    const imageSrc = `data:image/jpeg;base64,${imgGplx.data.data.src}`
                    setImgGPLX(imageSrc);
                }
                if (result.idbienbangiao) {
                    const imgBBG = await axios.get(`http://localhost:8080/image/${result.idbienbangiao}/bienbangiao`);
                    if (imgBBG.data.success) {
                        const listImages = imgBBG.data.data;
                        if (Array.isArray(listImages)) {
                            const imageSrc = listImages.map(item => `data:image/jpeg;base64,${item.src}`);
                            setImagesDelivery(imageSrc);
                        } else {
                            const imageSrc = `data:image/jpeg;base64,${listImages.src}`;
                            setImagesDelivery([imageSrc]); // Đưa vào một mảng
                        }
                    }
                }
                if (result.idbienbannhan) {
                    const imgBBN = await axios.get(`http://localhost:8080/image/${result.idbienbannhan}/bienbannhan`);
                    if (imgBBN.data.success) {
                        const listImages = imgBBN.data.data;
                        if (Array.isArray(listImages)) {
                            const imageSrc = listImages.map(item => `data:image/jpeg;base64,${item.src}`);
                            setImagesReturn(imageSrc);
                        } else {
                            const imageSrc = `data:image/jpeg;base64,${listImages.src}`;
                            setImagesReturn([imageSrc]); // Đưa vào một mảng
                        }
                    }
                }
                if (result.trangthai != 'dangky' && result.trangthai != 'duyet' && result.trangthai != 'hethan' && result.trangthai != 'huy') {
                    console.log("có fetch tttt");
                    fetchThongtinthanhtoan();
                }
            }
        } catch (error) {
            console.error('Error fetching contract data:', error);
        }
    };

    const fetchThongtinthanhtoan = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/thongtinthanhtoan/${idhopdong}`);
            if (response.data.success) {
                setPaymentData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching payment data:', error);
        }
    }

    const getContractStatusMessage = (status) => {
        const statusMessages = {
            dangky: "Hợp đồng chưa được duyệt.",
            duyet: "Hợp đồng đã được duyệt, vui lòng đặt cọc để bắt đầu hiệu lực hợp đồng.",
            tuchoi: "Hợp đồng đã bị từ chối, lí do được gửi ở phần thông báo.",
            hethan: "Hợp đồng đã bị huỷ do quá thời gian đặt cọc, vui lòng đặt lại xe.",
            dacoc: "Hợp đồng đã đặt cọc, vui lòng đến cơ sở trước 1 giờ để nhận xe.",
            huy: "Hợp đồng đã hủy trước khi đặt cọc.",
            chuahoantien: "Hợp đồng đã hủy, chưa hoàn tiền cọc.",
            hoantien: "Hợp đồng đã hủy, đã hoàn tiền cọc theo quy định thuê xe.",
            dagiaoxe: "Xe đã được giao.",
            danhanxe: "Xe đã được nhận.",
            hoantat: "Hợp đồng đã hoàn tất.",
        };
        return statusMessages[status] || "Trạng thái không xác định";
    };
    useEffect(() => {
        fetchData();
    }, [idhopdong, reload]);


    const handleClickBack = () => {
        if (user.quyen === 'nhanvien') {
            navigate('/contacts');
        }
        if (user.quyen === 'khachhang') {
            navigate('/dangky')
        }
    }

    const LocationPicker = ({ onLocationSelect }) => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                onLocationSelect(lat, lng);
            },
        });
        return null;
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setSelectedLocation({ lat: latitude, lng: longitude });

                    // Move the map to user's current location
                    if (mapRef) {
                        mapRef.setView([latitude, longitude], 15);
                    }

                    // Fetch address for the current location
                    handleLocationSelect(latitude, longitude);
                },
                (error) => {
                    // Handle different error cases
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert(
                                "Bạn đã từ chối quyền truy cập vị trí. Hãy bật quyền truy cập trong cài đặt trình duyệt hoặc cấp lại quyền."
                            );
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Không thể lấy thông tin vị trí. Hãy kiểm tra kết nối mạng hoặc GPS.");
                            break;
                        case error.TIMEOUT:
                            alert("Thời gian yêu cầu vị trí đã hết. Vui lòng thử lại.");
                            break;
                        default:
                            alert("Đã xảy ra lỗi không xác định khi lấy vị trí.");
                    }
                }
            );
        } else {
            alert("Trình duyệt của bạn không hỗ trợ chức năng định vị.");
        }
    };


    const handleClickAccept = () => {
        setIsModalOpen(true)
        setModalState('duyet')
    }

    const handleSubmitAccept = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/duyet/${idhopdong}`)
            if (response.data.success) {
                openNotification(true)
                setModalState('')
                setMessage("Duyệt hợp đồng thành công")
                setReload(prev => !prev);
            }
        } catch (error) {
            console.log("Duyệt thất bại");
        }
    }
    const handleClickDeny = () => {
        setModalState('tuchoi');
        setIsModalOpen(true);
    }
    const handleSubmitDeny = async () => {
        if (lido.trim() === '') {
            setError('Lý do không được để trống.');
            return;
        }
        try {
            const request = { idhopdong, lido };
            const response = await axios.post('http://localhost:8080/hopdong/tuchoi', request);
            if (response.data.success) {
                openNotification(true)
                setMessage("Hợp đồng đã bị từ chối.");
                setReload(prev => !prev);
                closeModal();
            }
        } catch (error) {
            console.error("Lỗi khi từ chối hợp đồng:", error);
            setError("Không thể từ chối hợp đồng.");
        }
    };


    const closeModal = () => {
        setIsModalOpen(false)
        setModalState('');
        setError('');
        setImageHoanTien(null);
    }

    const handleClickDatCoc = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/payment/datcoc/${idhopdong}`);
            console.log('Response data:', response.data); // Log dữ liệu trả về

            if (response.data && response.data.success) {
                const paymentData = response.data.data;
                console.log('Payment Data:', paymentData); // Log dữ liệu thanh toán

                // Kiểm tra xem checkoutUrl có tồn tại và hợp lệ không
                const checkoutUrl = paymentData?.checkoutUrl;
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Lỗi khi đặt cọc:", error);
        }
    };

    const handleClickHuyChuaCoc = () => {
        setModalState('huychuacoc');
        setIsModalOpen(true);
    }

    const handleClickHuyDaCoc = () => {
        setModalState('huydacoc');
        setIsModalOpen(true);
    }
    const handleSubmitHuyDaCoc = async () => {
        try {
            if (phuongThuc === 'tienmat') {
                setNganHang('')
                setSoTaiKhoan('')
            }
            const request = {
                idhopdong: idhopdong,
                lido: lido,
                phuongthuc: phuongThuc,
                nganhang: nganHang,
                sotaikhoan: soTaiKhoan
            }
            const response = await axios.post(`http://localhost:8080/hopdong/huy-hopdong-dacoc`, request);
            if (response.data.success) {
                openNotification(true);
                setMessage("Hợp đồng đã huỷ cọc thành công.");
                setReload(prev => !prev);
                closeModal();
            }
        }
        catch (error) {
            console.error("Lỗi khi huỷ cọc hợp đồng:", error);
            setError("Không thể huỷ cọc hợp đồng.");
        }
    }
    const handleSubmitHuyChuaCoc = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/huy-hopdong-chuacoc/${idhopdong}`);
            if (response.data.success) {
                openNotification(true);
                setMessage("Hợp đồng đã huỷ thành công.");
                setReload(prev => !prev);
                closeModal();
            }
        }
        catch (error) {
            console.error("Lỗi khi huỷ hợp đồng:", error);
            setError("Không thể huỷ hợp đồng.");
        }
    }

    const handleDeliveryRecord = () => {
        if (!contactData.ngaygiao) {
            navigate(`/addDeliveryRecord/${contactData.idhopdong}`)
        }
    }
    const handleReturnRecord = () => {
        if (!contactData.ngaynhan) {
            navigate(`/addReturnRecord/${contactData.idhopdong}`)
        }
    }

    const handleClickCapNhatHoanTien = async () => {
        setModalState('capnhathoantien')
        setIsModalOpen(true)


    }

    const handleSubmitCapNhatHoantien = async () => {
        try {
            const capnhatResponse = await axios.get(`http://localhost:8080/hopdong/capnhat-hoantien/${idhopdong}`)
            if (!capnhatResponse.data.success) {
                return;
            }
            if (imageHoantien) {
                const formData = new FormData();
                formData.append('images', imageHoantien);
                formData.append('id', idhopdong);
                formData.append('loai', 'hoantien');
                const imageHoanTienResponse = await axios.post('http://localhost:8080/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (!imageHoanTienResponse.data.success) {
                    setError('Thêm hình ảnh thất bại')
                    return;
                }
            }

            openNotification(true);
            setMessage("Cập nhật trạng thái hoàn tiền thành công.")
            setReload(prev => !prev);
            closeModal();
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeImageHoanTien = (e) => {
        const imageHoantien = e.target.files[0];
        if (imageHoantien && imageHoantien.type.startsWith('image/')) {
            setImageHoanTien(imageHoantien);
            setError('');
        } else {
            setError('Vui lòng chọn một tệp hình ảnh hợp lệ (jpg, png, v.v.)');
            setImageHoanTien(null);
        }
    }

    const handleClickReview = () => {
        setModalState('review')
        setIsModalOpen(true)
    }

    const handleClickIssue = () => {
        setModalState('thongbaosuco')
        setIsModalOpen(true)

    }
    const handleSubmitIssue = async () => {
        try {
            const request = {
                vitri: selectedAddress,
                lienlac: phoneNumber,
                mota: issueDescription,
                idhopdong: contactData.idhopdong
            }
            const response = await axios.post('http://localhost:8080/hopdong/thongbao-suco/add', request);
            if (response.data.success) {
                const idthongbaosuco = response.data.data.idthongbaosuco
                if (issueImages) {
                    const formData = new FormData();
                    issueImages.forEach((image) => {
                        formData.append('images', image);
                    });
                    formData.append('id', idthongbaosuco);
                    formData.append('loai', 'thongbaosuco');
                    const responseImage = await axios.post('http://localhost:8080/image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    )
                }
                openNotification(true)
                setMessage("Gửi thông báo sự cố thành công.");
                setReload(prev => !prev);
                closeModal();
            }
        } catch (error) {
            console.error("Lỗi khi gửi thông báo:", error);
            setError("Lỗi khi gửi thông báo.");
        }
    }

    const handleSubmitReview = async () => {
        try {
            const request = {
                sodienthoai: contactData.sodienthoai,
                idxe: contactData.idxe,
                idhopdong: contactData.idhopdong,
                danhgia: reviewText,
                sao: rating
            }
            const response = await axios.post('http://localhost:8080/hopdong/danhgia', request);
            if (response.data.success) {
                openNotification(true);
                setMessage("Gửi đánh giá thành công");
                setReload(prev => !prev);
                closeModal();
            }
        } catch (error) {
            setError('Lỗi khi cập nhật đánh giá, review')
        }
    }

    const handleIssueImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files); // Lấy danh sách tệp từ input
        const validImages = selectedFiles.filter(file => file.type.startsWith('image/')); // Lọc các tệp hình ảnh hợp lệ

        if (validImages.length > 0) {
            setIssueImages(prevImages => [...prevImages, ...validImages]); // Thêm hình ảnh mới vào danh sách hiện có
            setError('');
        } else {
            setError('Vui lòng chọn ít nhất một tệp hình ảnh hợp lệ (jpg, png, v.v.)');
        }
    };

    const handleRemoveImage = (index) => {
        setIssueImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleLocationSelect = async (lat, lng) => {
        setSelectedLocation({ lat, lng });

        // Reverse geocoding to get address
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        setSelectedAddress(data.display_name || 'Không tìm thấy địa chỉ');
    };

    const handleClickBill = () => {
        navigate(`/bill/${idhopdong}`)
    }

    if (!contactData) {
        return (
            <div className=" relative flex justify-center items-center h-screen">
                <button onClick={handleClickBack} className='absolute top-3 left-3 p-2 bg-slate-500 text-white rounded'>Quay lại</button>
                <p className="text-lg text-gray-600">Thông tin hợp đồng không còn tồn tại :((.</p>
            </div>
        );
    }
    return (
        <>
            <div className="  p-8 bg-white shadow-lg rounded-lg  space-y-6 text-sm">
                <div className='flex items-center justify-between mb-6'>
                    <button
                        onClick={handleClickBack}
                        className='bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'>
                        ← Quay lại
                    </button>
                    <h1 className='flex-grow text-3xl font-bold text-center text-gray-800'>Chi tiết hợp đồng</h1>
                </div>
                {contactData.ngaytao && <p className='text-red-500 text-sm italic'>Khách hàng đã đăng ký thuê xe lúc: {contactData.ngaytao ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.ngaytao)) : ''}</p>}

                {contactData.thoigiantuchoi && <p className='text-red-500 text-sm italic'>Nhân viên đã từ chối hợp đồng với lí do: {contactData.lidotuchoi} Lúc {contactData.thoigiantuchoi ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigiantuchoi)) : ''}</p>}

                {contactData.thoigianduyet && <p className='text-red-500 text-sm italic'>Nhân viên đã duyệt hợp đồng lúc {contactData.thoigianduyet ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianduyet)) : ''}, vui lòng hoàn thành tiền cọc trong vòng 2 giờ kể từ lúc hợp đồng được duyệt.</p>}

                {contactData.thoigianhethan && <p className='text-red-500 text-sm italic'>Hợp đồng đã hết hạn đặt cọc lúc {contactData.thoigianhethan ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianhethan)) : ''}</p>}

                {contactData.thoigiandatcoc && <p className='text-red-500 text-sm italic'>Khách hàng đặt cọc lúc:  {contactData.thoigiandatcoc ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigiandatcoc)) : ''} .Vui lòng có mặt trước thời điểm nhận xe 30p để làm biên bản giao xe.</p>}

                {contactData.thoigianhuy && <p className='text-red-500 text-sm italic'>Khách hàng đã huỷ hợp đồng chưa đặt cọc lúc:  {contactData.thoigianhuy ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianhuy)) : ''}</p>}

                {contactData.thoigianhuycoc && <p className='text-red-500 text-sm italic'>Khách hàng đã huỷ cọc hợp đồng lúc:  {contactData.thoigianhuycoc ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianhuycoc)) : ''}.
                </p>}

                {contactData.trangthai === 'chuahoantien' && <p className='text-red-500 text-sm italic'>Tiền cọc sẽ được hoàn lại cho khách hàng trong 2 ngày.</p>}

                {contactData.thoigianhoantien && <p className='text-red-500 text-sm italic'>Tiền cọc đã được hoàn lại cho khách hàng lúc: {contactData.thoigianhoantien ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianhoantien)) : ''}</p>}

                {contactData.ngaygiao && <p className='text-red-500 text-sm italic'>Xe đã được giao cho khách lúc:   {contactData.ngaygiao ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.ngaygiao)) : ''}</p>}

                {contactData.ngaynhan && <p className='text-red-500 text-sm italic'>Xe đã được nhận lại lúc:   {contactData.ngaynhan ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.ngaynhan)) : ''}.</p>}

                {contactData.thoigianhoantat && <p onClick={handleClickBill} className='text-red-500 text-sm italic hover:underline cursor-pointer'>Khách hàng đã hoàn tất thanh toán lúc: {contactData.thoigianhoantat ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianhoantat)) : ''}.</p>}

                {contactData.thoigiandanhgia && <p className='text-red-500 text-sm italic'>Cảm ơn quý khách đánh giá dịch vụ.</p>}
                {user.quyen === 'khachhang' && (
                    <>
                        {contactData.trangthai === 'duyet' && (
                            <div className='space-y-2'>
                                <button
                                    onClick={handleClickDatCoc}
                                    className='p-2 bg-green-300 rounded hover:bg-green-400'
                                >
                                    Đặt cọc
                                </button>
                                <button
                                    onClick={handleClickHuyChuaCoc}
                                    className='mx-2 p-2 bg-red-300 rounded hover:bg-red-400'
                                >
                                    Huỷ đăng ký
                                </button>
                            </div>
                        )}
                        {contactData.trangthai === 'dacoc' && (
                            <button
                                onClick={handleClickHuyDaCoc}
                                className='p-2 bg-red-300 rounded hover:bg-red-400'
                            >
                                Huỷ đặt cọc
                            </button>
                        )}
                        {contactData.trangthai === 'dangky' && (
                            <button
                                onClick={handleClickHuyChuaCoc}
                                className='p-2 bg-red-300 rounded hover:bg-red-400'
                            >
                                Huỷ đăng ký
                            </button>
                        )}
                        {contactData.trangthai === 'dagiaoxe' && (
                            <button onClick={handleClickIssue}
                                className='p-2 bg-green-400 rounded hover:bg-green-300'
                            >Gửi thông báo sự cố</button>
                        )}
                        {contactData.trangthai === 'hoantat' && !contactData.thoigiandanhgia && (
                            <button onClick={handleClickReview}
                                className='p-2 bg-green-400 rounded hover:bg-green-300'
                            >Thêm review, đánh giá</button>
                        )}
                    </>
                )}
                {user.quyen === 'nhanvien' &&
                    <>
                        {contactData.trangthai === 'dangky' &&
                            (<div className='space-x-3'>
                                <button onClick={handleClickAccept} className='p-2 bg-green-300 rounded hover:bg-green-400'>Duyệt hợp đồng</button>
                                <button onClick={handleClickDeny} className='p-2 bg-red-300 rounded hover:bg-red-400'>Từ chối hợp đồng</button>
                            </div>)}
                        {contactData.trangthai === 'chuahoantien' &&
                            (<div className='space-y-2'>
                                <p className='text-red-500 italic'>Số tiền cần hoàn lại là: {contactData.sotienhoanlai.toLocaleString()} VND</p>
                                <button onClick={handleClickCapNhatHoanTien} className='p-2 bg-green-400 rounded hover:bg-green-300'>Cập nhật trạng thái hoàn tiền</button>
                            </div>)}
                        {!contactData.ngaygiao && contactData.trangthai === 'dacoc' &&
                            <div className='flex space-x-2'>
                                <button onClick={handleDeliveryRecord} className='bg-yellow-400 p-2 rounded-md hover:bg-yellow-300'>Biên bản giao</button>
                                <ContractPDF {...contactData} />
                            </div>
                        }
                        {contactData.ngaygiao && !contactData.ngaynhan &&
                            <button onClick={handleReturnRecord} className='bg-green-400 p-2 rounded-md hover:bg-green-300'>Biên bản nhận</button>}
                        {contactData.trangthai === 'danhanxe' &&
                            <button onClick={handleClickBill} className='bg-green-400 p-2 rounded-md hover:bg-green-300'>Lập hoá đơn</button>}
                    </>}
                <div className='grid grid-cols-2 gap-4 border-b pb-6'>
                    <section className="space-y-4">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Khách thuê</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><span className="font-medium text-gray-600">Họ và tên:</span> {contactData.hovaten}</p>
                            <p><span className="font-medium text-gray-600">Ngày sinh:</span> {formatDate(contactData.ngaysinh)}</p>
                            <p><span className="font-medium text-gray-600">Số điện thoại:</span> {contactData.sodienthoai}</p>
                            <p><span className="font-medium text-gray-600">Email:</span> {contactData.email}</p>
                            <p><span className="font-medium text-gray-600">CCCD:</span> {contactData.cccd}</p>
                            <p><span className="font-medium text-gray-600">Số GPLX:</span> {contactData.sogplx}</p>
                        </div>
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Xe thuê</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><span className="font-medium text-gray-600">Tên xe:</span> {contactData.tenhangxe} {contactData.tendongxe}</p>
                            <p><span className="font-medium text-gray-600">Biển số xe:</span> {contactData.biensoxe}</p>
                            <p><span className="font-medium text-gray-600">Màu nội thất:</span> {contactData.maunoithat}</p>
                            <p><span className="font-medium text-gray-600">Màu ngoại thất:</span> {contactData.maungoaithat}</p>
                            <p><span className="font-medium text-gray-600">Năm sản xuất:</span> {formatDate(contactData.namsanxuat)}</p>
                            <p><span className="font-medium text-gray-600">Kiểu dáng:</span> {contactData.kieudang}</p></div>
                    </section>
                    <section className="">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Nội dung thuê</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><span className="font-medium text-gray-600">ID Hợp đồng:</span> {contactData.idhopdong}</p>
                            <p><span className="font-medium text-gray-600">Thời gian đăng ký:</span> {contactData.ngaytao ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.ngaytao)) : 'Không có thòi gian đăng ký'}</p>
                            <p><span className="font-medium text-gray-600">Thời gian bắt đầu:</span> {contactData.thoigianbatdau ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianbatdau)) : 'Không có thòi gian bắt đầu'}</p>
                            <p><span className="font-medium text-gray-600">Thời gian kết thúc:</span> {contactData.thoigianketthuc ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contactData.thoigianketthuc)) : 'Không có thời gian kết thúc'}</p>
                            <p><span className="font-medium text-gray-600">Số ngày thuê:</span> {contactData.songaythue} ngày</p>
                            <p><span className="font-medium text-gray-600">Giá thuê một ngày:</span> {contactData.giathuemotngay.toLocaleString()} VND</p>
                            <p><span className="font-medium text-gray-600">Số giờ thuê:</span> {contactData.sogiothue} giờ</p>
                            <p><span className="font-medium text-gray-600">Phụ trội thời gian theo giờ:</span> {contactData.phutroithoigian.toLocaleString()} VND</p>
                            <p><span className="font-medium text-gray-600">Số km giới hạn trong chuyến đi:</span> {contactData.sokmgioihanchuyendi} km</p>
                            <p><span className="font-medium text-gray-600">Phụ trội quãng đường:</span> {contactData.phutroiquangduong.toLocaleString()} VND/km</p>
                            <p><span className="font-medium text-gray-600">Phí vệ sinh:</span> {contactData.phivesinh.toLocaleString()} VND</p>
                            <p><span className="font-medium text-gray-600">Phí khử mùi:</span> {contactData.phikhumui.toLocaleString()} VND</p>
                            <p><span className="font-medium text-gray-600">Tiền đặt cọc:</span> {contactData.tiendatcoc.toLocaleString()} VND</p>
                            <p><span className="font-medium text-gray-600">Giá thuê tổng:</span> {contactData.giathuetong.toLocaleString()} VND</p>
                        </div>
                        <p className='mt-2 text-sm text-red-600'>Giá thuê theo giờ được tính theo phụ trội thời gian, nếu khách thuê nhiều hơn hoặc trả xe trễ hẹn {contactData.gioihanphitheogio} giờ thì được giá thuê được tính theo ngày. Tương tự áp dụng cho ngày tiếp theo.</p>
                    </section>
                </div>
                <div className='grid grid-cols-2 gap-4 border-b'>
                    {contactData.idbienbangiao && <section className="pb-6">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Thông tin giao xe</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <p><strong className='font-medium text-gray-600'>Người giao xe:</strong> {contactData.nguoigiaoxe}</p>
                            <p><strong className='font-medium text-gray-600'>Ngày giao:</strong> {new Date(contactData.ngaygiao).toLocaleString()}</p>
                            <p><strong className='font-medium text-gray-600'>Địa điểm giao:</strong> {contactData.diadiemgiao}</p>
                            <p><strong className='font-medium text-gray-600'>Số KM lúc giao:</strong> {contactData.sokmlucgiao.toLocaleString()} km</p>
                            <p><strong className='font-medium text-gray-600'>Phần trăm xăng:</strong> {contactData.phantramxanglucgiao}%</p>
                            <p><strong className='font-medium text-gray-600'>Số lít xăng:</strong> {contactData.xangtheolitlucgiao} L</p>
                            <p><strong className='font-medium text-gray-600'>Tình trạng xe:</strong> {contactData.tinhtranglucgiao}</p>
                            <p><strong className='font-medium text-gray-600'>Phụ kiện kèm theo:</strong> {contactData.phukienkemtheo}</p>
                        </div>
                    </section>}
                    {contactData.idbienbannhan && <section className="pb-6">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Thông tin nhận xe</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <p><strong className='font-medium text-gray-600'>Người nhận xe:</strong> {contactData.nguoinhanxe}</p>
                            <p><strong className='font-medium text-gray-600'>Ngày nhận:</strong> {new Date(contactData.ngaynhan).toLocaleString()}</p>
                            <p><strong className='font-medium text-gray-600'>Địa điểm nhận:</strong> {contactData.diadiemnhan}</p>
                            <p><strong className='font-medium text-gray-600'>Số KM lúc giao:</strong> {contactData.sokmlucnhan.toLocaleString()} km</p>
                            <p><strong className='font-medium text-gray-600'>Phần trăm xăng:</strong> {contactData.phantramxanglucnhan}%</p>
                            <p><strong className='font-medium text-gray-600'>Số lít xăng:</strong> {contactData.xangtheolitlucnhan} L</p>
                        </div>
                    </section>}
                </div>
                <div className="  max-w-screen-lg">
                    {/* Phần Tiêu đề */}
                    <h2 className="text-base font-semibold text-gray-700 mb-4  pb-2">
                        Thông Tin Hình Ảnh
                    </h2>
                    {/* Giấy phép lái xe */}
                    <div className="mb-8">
                        <h3 className=" font-medium text-gray-600 mb-3">
                            Giấy phép lái xe
                        </h3>
                        <div className="flex flex-wrap gap-4 justify-start items-center">
                            <img
                                alt="Gplx"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setModalState('gplx');
                                }}
                                src={imgGPLX}
                                className="cursor-pointer h-[20vh] w-[15vw] object-cover rounded-xl shadow-lg border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Hình ảnh xe thuê */}
                    <div className='mb-8'>
                        <h3 className=" font-semibold text-gray-600 mb-3">
                            Hình ảnh xe thuê
                        </h3>
                        <div className="flex flex-wrap gap-4 justify-start items-center">
                            {imagesCar.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Hình phụ ${index + 1}`}
                                    className="h-[20vh] w-[15vw] object-cover rounded-xl shadow-lg border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl"
                                />
                            ))}
                        </div>
                    </div>
                    <div className='mb-8'>
                        <h3 className=" font-semibold text-gray-600 mb-3">
                            Hình ảnh giao xe
                        </h3>
                        <div className="flex flex-wrap gap-4 justify-start items-center">
                            {imagesDelivery.length > 0 ? (imagesDelivery.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Hình phụ ${index + 1}`}
                                    className="h-[20vh] w-[15vw] object-cover rounded-xl shadow-lg border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl"
                                />
                            ))) : ''}
                        </div>
                    </div>
                    <div className='mb-8'>
                        <h3 className=" font-semibold text-gray-600 mb-3">
                            Hình ảnh nhận xe
                        </h3>
                        <div className="flex flex-wrap gap-4 justify-start items-center">
                            {imagesReturn.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Hình phụ ${index + 1}`}
                                    className="h-[20vh] w-[15vw] object-cover rounded-xl shadow-lg border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-2xl"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {modalState === 'gplx' && <ReactModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                    className="bg-white rounded-lg shadow-lg max-w-lg overflow-auto transform transition-all duration-300 ease-in-out"
                >
                    <div className="relative">
                        <img
                            src={imgGPLX}
                            alt="Giấy phép lái xe lớn"
                            className="max-w-[90vw] max-h-[90vh] rounded-lg"
                        />
                    </div>
                </ReactModal>}
                {modalState === 'duyet' && <ReactModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                    className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full overflow-auto transform transition-all duration-300 ease-in-out"
                >
                    <div className=' flex flex-col space-y-5'>
                        <h3 className='text-2xl font-semibold text-center'>Thông báo</h3>
                        <p className=''>Bạn đã đọc kĩ thông tin khách đăng kí? </p>
                        <p className='italic text-red-400'>Sau khi duyệt, yêu cầu thanh toán tiền đặt cọc sẽ được gửi đến khách hàng.</p>
                        <button onClick={handleSubmitAccept} className='bg-green-300 p-2 rounded px-4'>Duyệt</button>
                    </div>
                </ReactModal>}
                {modalState === 'tuchoi' && <ReactModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                    className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full overflow-auto transform transition-all duration-300 ease-in-out"
                >
                    <div className=' flex flex-col space-y-5'>
                        <h3 className='text-2xl font-semibold text-center'>Thông báo từ chối</h3>
                        <p className=''>Bạn đã đọc kĩ thông tin khách đăng kí? </p>
                        <label htmlFor="lido">Lí do từ chối</label>
                        <input onChange={(e) => setLido(e.target.value)} htmlFor="lido" type="text" className='p-2 border' placeholder='Lí do từ chối' />
                        <p className='italic'>Sau khi từ chối, lí do từ chối hợp đồng sẽ được gửi đến khách hàng.</p>
                        {error && <p className='text-red-500'>{error}</p>}
                        <button onClick={handleSubmitDeny} className='bg-red-300 p-2 rounded px-4'>Xác nhận</button>
                    </div>
                </ReactModal>}
                {modalState === 'huychuacoc' && <ReactModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                    className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full overflow-auto transform transition-all duration-300 ease-in-out"
                >
                    <div className=' flex flex-col space-y-5'>
                        <h3 className='text-2xl font-semibold text-center'>Thông báo huỷ đăng ký</h3>
                        <p className=''>Hợp đồng của bạn chưa đặt cọc. Bạn có xác nhận huỷ?</p>
                        {error && <p className='text-red-500'>{error}</p>}
                        <button onClick={handleSubmitHuyChuaCoc} className='bg-red-300 p-2 rounded px-4'>Xác nhận</button>
                    </div>
                </ReactModal>}
                {modalState === 'huydacoc' && (
                    <ReactModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                        className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full overflow-auto transform transition-all duration-300 ease-in-out h-[80%]"
                    >
                        <div className="flex flex-col space-y-5">
                            <h3 className="text-2xl font-semibold text-center">Thông báo huỷ hợp đồng</h3>
                            <p>Hợp đồng bạn đã đặt cọc, bạn có xác nhận huỷ?</p>
                            <label htmlFor="lido">Lí do huỷ</label>
                            <input
                                onChange={(e) => setLido(e.target.value)}
                                id="lido"
                                type="text"
                                className="p-2 border"
                                placeholder="Lí do huỷ hợp đồng"
                            />
                            <p className="italic">Sau khi huỷ, tiền cọc sẽ được hoàn lại cho khách hàng theo quy định của cơ sở cho thuê xe.</p>
                            <label htmlFor="phuongThucHoanTien">Phương thức hoàn tiền</label>
                            <select
                                id="phuongThucHoanTien"
                                className="p-2 border"
                                onChange={(e) => setPhuongThuc(e.target.value)}
                                value={phuongThuc}
                            >
                                <option value="tienmat">Tiền mặt</option>
                                <option value="chuyenkhoan">Chuyển khoản</option>
                            </select>
                            {phuongThuc === 'chuyenkhoan' && (
                                <>
                                    <label htmlFor="nganHang">Ngân hàng</label>
                                    <input
                                        id="nganHang"
                                        type="text"
                                        className="p-2 border"
                                        placeholder="Tên ngân hàng"
                                        onChange={(e) => setNganHang(e.target.value)}
                                    />
                                    <label htmlFor="soTaiKhoan">Số tài khoản</label>
                                    <input
                                        id="soTaiKhoan"
                                        type="text"
                                        className="p-2 border"
                                        placeholder="Số tài khoản"
                                        onChange={(e) => setSoTaiKhoan(e.target.value)}
                                    />
                                </>
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                            <button onClick={handleSubmitHuyDaCoc} className="bg-red-300 p-2 rounded px-4">
                                Xác nhận
                            </button>
                        </div>
                    </ReactModal>
                )}

                {modalState === 'capnhathoantien' && (
                    <ReactModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                        className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out"
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Xác nhận hoàn tiền</h2>
                            <p className="text-sm text-red-500 text-center">
                                Xác nhận đã hoàn đúng số tiền hoàn lại cho khách hàng?
                            </p>
                            <p className="text-gray-600 text-center">
                                Vui lòng thêm hình ảnh chuyển khoản cho khách hàng nếu có.
                            </p>

                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin hoàn tiền</h3>
                                <div className="border rounded-md p-3 bg-gray-50">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Phương thức hoàn tiền: </span>
                                        {contactData.phuongThuc === 'tienmat'
                                            ? 'Tiền mặt'
                                            : 'Chuyển khoản'}
                                    </p>
                                    {contactData.phuongthuc === 'chuyenkhoan' && (
                                        <>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Ngân hàng: </span>
                                                {contactData.nganhang || 'Chưa có thông tin'}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Số tài khoản: </span>
                                                {contactData.sotaikhoan || 'Chưa có thông tin'}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Số tiền hoàn lại: </span>
                                                {contactData.sotienhoanlai || 'Chưa có thông tin'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="w-full">
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hình ảnh xác nhận
                                </label>
                                <input
                                    onChange={(e) => handleChangeImageHoanTien(e)}
                                    type="file"
                                    accept="image/*"
                                    id="file"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {imageHoantien && (
                                    <img
                                        src={URL.createObjectURL(imageHoantien)}
                                        alt="Hình ảnh hoàn tiền"
                                        className="mt-4 max-h-40 w-auto object-cover rounded-md shadow-md"
                                    />
                                )}
                            </div>
                            {error && <p className="text-red-500 italic text-sm">{error}</p>}
                            <button
                                onClick={handleSubmitCapNhatHoantien}
                                className="absolute bottom-2 bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Xác nhận cập nhật
                            </button>
                        </div>
                    </ReactModal>
                )}

                {modalState === 'thongbaosuco' && (
                    <ReactModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                        className="bg-white rounded-lg shadow-2xl p-8 w-[90vw] md:w-[70vw] h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out"
                    >
                        <div className="flex flex-col space-y-8">
                            <h2 className="text-4xl font-bold text-gray-800 text-center">Gửi Thông Báo Sự Cố</h2>
                            <p className="text-sm text-gray-600 text-center">
                                Vui lòng mô tả chi tiết sự cố gặp phải trong quá trình thuê xe và thêm hình ảnh minh họa nếu có.
                            </p>

                            {/* Map Section */}
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2">Vị trí</label>
                                <div className="h-60 w-full rounded-md overflow-hidden border relative">
                                    <MapContainer
                                        center={selectedLocation}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                        whenCreated={setMapRef}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={selectedLocation} />
                                        <LocationPicker onLocationSelect={handleLocationSelect} />
                                    </MapContainer>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleGetCurrentLocation}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all w-1/4"
                                    >
                                        Lấy vị trí hiện tại
                                    </button>
                                    <input
                                        className='text-sm w-3/4 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
                                        type="text"
                                        value={selectedAddress}
                                        onChange={(e) => setSelectedAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Số điện thoại liên lạc</label>
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700">Mô tả sự cố</label>
                                <textarea
                                    onChange={(e) => setIssueDescription(e.target.value)}
                                    value={issueDescription}
                                    rows={5}
                                    placeholder="Mô tả sự cố..."
                                    className="w-full border border-gray-300 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="issueImage" className="text-sm font-medium text-gray-700">Hình ảnh sự cố (nếu có)</label>
                                <input
                                    onChange={(e) => handleIssueImageChange(e)}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    id="issueImage"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {issueImages && issueImages.length > 0 && (
                                    <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {issueImages.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Hình sự cố ${index + 1}`}
                                                    className="h-40 w-auto object-cover rounded-md shadow-md group-hover:opacity-80"
                                                />
                                                <button
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-red-700 transition-all group-hover:scale-105"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {error && <p className="text-red-500 italic text-sm">{error}</p>}

                            <button
                                onClick={handleSubmitIssue}
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-all"
                            >
                                Gửi Thông Báo
                            </button>
                        </div>
                    </ReactModal>
                )}
                {modalState === 'review' && (
                    <ReactModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                        className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out"
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Gửi Đánh Giá Dịch Vụ</h2>
                            <p className="text-sm text-gray-600 text-center">
                                Vui lòng để lại đánh giá về dịch vụ bạn vừa trải nghiệm.
                            </p>
                            <textarea
                                onChange={(e) => setReviewText(e.target.value)}
                                value={reviewText}
                                rows={5}
                                placeholder="Đánh giá của bạn..."
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`cursor-pointer text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            {error && <p className="text-red-500 italic text-sm">{error}</p>}
                            <button
                                onClick={handleSubmitReview}
                                className="bg-blue-600 text-white font-semibold p-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Gửi Đánh Giá
                            </button>
                        </div>
                    </ReactModal>
                )}

            </div>
            <Notification isOpen={isOpenNotification} closeModal={() => {
                openNotification(false)
                setMessage('')
            }} message={message} />
        </>
    );
};

export default ContractDetail;