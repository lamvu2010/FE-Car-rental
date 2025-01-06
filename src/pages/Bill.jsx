import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReturnRecordContext } from '../ContextApi/ReturnRecordContext';
import { format } from 'date-fns';
import axios from 'axios';

const Bill = () => {
    const { idhopdong } = useParams();
    const [danhmuc, setDanhmuc] = useState([]);
    const [contact, setContact] = useState(null);
    const [imagesDelivery, setImagesDelivery] = useState([]);
    const [imagesReturn, setImagesReturn] = useState([]);
    const navigate = useNavigate();

    const [failedItems, setFailedItems] = useState([]);

    const fetchData = async () => {
        try {
            const contactResponse = await axios.get(`http://localhost:8080/hopdong/detail/${idhopdong}`)
            let result;
            if (contactResponse.data.success) {
                setContact(contactResponse.data.data)
                result = contactResponse.data.data
            }

            //             const imagesDeliveryResponse = await axios.get(`http://localhost:8080/image/${result.idbienbangiao}/bienbangiao`);
            //             const listImages = imagesDeliveryResponse.data.data
            //             const listSrc = listImages.map(item => {
            //                 return `data:image/jpeg;base64,${item.src}`
            //             })
            //             setImagesDelivery(listSrc)
            // 
            //             const imagesReturnResponse = await axios.get(`http://localhost:8080/image/${result.idbienbannhan}/bienbannhan`);
            //             const listImagesReturn = imagesReturnResponse.data.data
            //             const listSrcReturn = listImagesReturn.map(item => {
            //                 return `data:image/jpeg;base64,${item.src}`
            //             })
            //             setImagesReturn(listSrcReturn)

            const danhmucResponse = await axios.get(`http://localhost:8080/hopdong/danhmuc/${result.idbienbannhan}`)
            setDanhmuc(danhmucResponse.data.data || []);

        } catch (error) {
            console.error('Error fetching delivery record:', error);
        }
    }

    const handleClickBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchData();
    }, [])

    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy');
    }
    const totalCost = (() => {
        const danhMucCost = danhmuc?.reduce((total, item) => total + (item.chiphiphatsinh || 0), 0) || 0;
        const giaThue = contact?.giathuetong || 0;
        const tienDatCoc = contact?.tiendatcoc || 0;

        return danhMucCost + giaThue - tienDatCoc;
    })();

    const handleClickSubmit = async () => {
        try {
            const thongtinthanhtoandto = {
                sotienthanhtoan: totalCost,
                idhopdong: idhopdong
            }
            console.log(thongtinthanhtoandto);
            const paymentResponse = await axios.post('http://localhost:8080/payment/thanhtoan/hoantat', thongtinthanhtoandto)
            if (paymentResponse.data.success) {
                const paymentData = paymentResponse.data.data;
                console.log('Payment Data:', paymentData); // Log dữ liệu thanh toán

                // Kiểm tra xem checkoutUrl có tồn tại và hợp lệ không
                const checkoutUrl = paymentData?.checkoutUrl;
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán hoàn tất:", error);
        }
    }

    const handleClickSubmitTM = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/thanhtoan/${idhopdong}`)
            if (response.data.success) {
                navigate(`/contact/${idhopdong}`)
            }
        } catch (error) {
        }

    }
    // if (!returnRecord || !danhmuc) {
    //     return <div className="flex justify-center items-center h-screen text-gray-600">Đang tải dữ liệu...</div>;
    // }
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className=" mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-center mb-6">
                    <button
                        onClick={handleClickBack}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow">
                        Quay lại
                    </button>
                    <div className='flex-grow'>
                        <h1 className="text-2xl font-bold text-gray-800 text-center">Hóa đơn</h1>
                    </div>

                </div>

                {/* Thông tin khách thuê */}
                {contact && <>
                    <div className='grid grid-cols-12 gap-4 text-sm'>
                        <div className='col-span-6'>
                            <div className='flex flex-col space-y-2'>
                                <h2 className="text-base font-semibold text-gray-700">Khách thuê</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <p><span className="font-medium text-gray-600">Họ và tên:</span> {contact.hovaten}</p>
                                    {/* <p><span className="font-medium text-gray-600">Ngày sinh:</span> {formatDate(contact?.ngaysinh)}</p> */}
                                    <p><span className="font-medium text-gray-600">Số điện thoại:</span> {contact.sodienthoai}</p>
                                    <p><span className="font-medium text-gray-600">Email:</span> {contact.email}</p>
                                    <p><span className="font-medium text-gray-600">CCCD:</span> {contact.cccd}</p>
                                </div>

                                {/* Nội dung thuê */}

                                <h2 className="text-base font-semibold text-gray-700">Thông tin thuê xe</h2>
                                <div className='grid grid-cols-2 gap-2'>
                                    <p><span className="font-medium text-gray-600">Bắt đầu thuê:</span> {contact.thoigianbatdau ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contact.thoigianbatdau)) : 'Không có thòi gian bắt đầu'}</p>
                                    <p><span className="font-medium text-gray-600">Kết thúc thuê:</span> {contact.thoigianketthuc ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(contact.thoigianketthuc)) : 'Không có thời gian kết thúc'}</p>
                                    <p><span className="font-medium text-gray-600">Số ngày thuê:</span> {contact.songaythue} ngày</p>
                                    <p><span className="font-medium text-gray-600">Giá thuê một ngày:</span> {contact.giathuemotngay.toLocaleString()} VND</p>
                                    <p><span className="font-medium text-gray-600">Số giờ thuê:</span> {contact.sogiothue} giờ</p>
                                    <p><span className="font-medium text-gray-600">Phụ trội thời gian theo giờ:</span> {contact.phutroithoigian.toLocaleString()} VND</p>
                                    <p><span className="font-medium text-gray-600">Số km giới hạn một ngày:</span> {contact.sokmgioihan} km</p>
                                    <p><span className="font-medium text-gray-600">Phụ trội quãng đường:</span> {contact.phutroiquangduong.toLocaleString()} VND/km</p>
                                    <p><span className="font-medium text-gray-600">Phí vệ sinh:</span> {contact.phivesinh.toLocaleString()} VND</p>
                                    <p><span className="font-medium text-gray-600">Phí khử mùi:</span> {contact.phikhumui.toLocaleString()} VND</p>
                                    <p><span className="font-medium text-gray-600">Tiền đặt cọc:</span> {contact.tiendatcoc.toLocaleString()} VND</p>
                                    <p><span className="font-medium text-gray-600">Giá thuê tổng:</span> {contact.giathuetong.toLocaleString()} VND</p></div>


                                {/* Biên bản giao xe */}
                                <h2 className="text-base font-semibold text-gray-700">Thông tin giao xe</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <p><span className="font-medium text-gray-600">Người giao xe:</span> {contact.nguoigiaoxe}</p>
                                    <p><span className="font-medium text-gray-600">Ngày giao:</span> {new Date(contact.ngaygiao).toLocaleString()}</p>
                                    <p><span className="font-medium text-gray-600">Địa điểm giao:</span> {contact.diadiemgiao}</p>
                                    <p><span className="font-medium text-gray-600">Số KM lúc giao:</span> {contact.sokmlucgiao.toLocaleString()} km</p>
                                    <p><span className="font-medium text-gray-600">Phần trăm xăng:</span> {contact.phantramxanglucgiao}%</p>
                                    <p><span className="font-medium text-gray-600">Xăng theo lít:</span> {contact.xangtheolitlucgiao} L</p>
                                </div>
                                <h2 className="text-base font-semibold text-gray-700">Thông tin nhận xe</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <p><span className="font-medium text-gray-600">Người nhận xe:</span> {contact.nguoinhanxe}</p>
                                    <p><span className="font-medium text-gray-600">Ngày nhận:</span> {new Date(contact.ngaynhan).toLocaleString()}</p>
                                    <p><span className="font-medium text-gray-600">Địa điểm nhận:</span> {contact.diadiemnhan}</p>
                                    <p><span className="font-medium text-gray-600">Số KM lúc nhận:</span> {contact.sokmlucnhan.toLocaleString()} km</p>
                                    <p><span className="font-medium text-gray-600">Phần trăm xăng:</span> {contact.phantramxanglucnhan}%</p>
                                    <p><span className="font-medium text-gray-600">Xăng theo lít:</span> {contact.xangtheolitlucnhan} L</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-6 space-y-4">
                            <h2 className="text-base font-semibold text-gray-700">Thông tin thanh toán</h2>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Danh mục</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Ghi chú</th>
                                        <th className="border border-gray-300 px-4 py-2 text-right">Chi phí (VND)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {danhmuc?.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">{item.muckiemtra || 'N/A'}</td>
                                            <td className="border border-gray-300 px-4 py-2">{item.ghichu || 'Không có'}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-right">
                                                {item.chiphiphatsinh ? item.chiphiphatsinh.toLocaleString() : '0'}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Tiền thuê còn lại</td>
                                        <td className="border border-gray-300 px-4 py-2"></td>
                                        <td className="border border-gray-300 px-4 py-2 text-right">
                                            {(contact?.giathuetong - contact?.tiendatcoc || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 font-bold">Tổng cộng</td>
                                        <td className="border border-gray-300 px-4 py-2"></td>
                                        <td className="border border-gray-300 px-4 py-2 text-right font-bold text-red-500">
                                            {totalCost.toLocaleString()} VND
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="flex flex-col space-y-2">
                                <p className="text-red-600">
                                    Biên bản nhận xe và thông tin thanh toán sẽ được lưu sau khi xác nhận thanh toán, vui lòng kiểm tra thông tin chính xác.
                                </p>
                                {
                                    contact.trangthai === 'danhanxe' && <div className="flex justify-center space-x-3">
                                        <button onClick={handleClickSubmitTM} className="p-2 bg-blue-400 hover:bg-blue-300 rounded">Xác nhận thanh toán tiền mặt</button>
                                        <button
                                            onClick={handleClickSubmit}
                                            className="p-2 bg-blue-400 hover:bg-blue-300 rounded"
                                        >
                                            Thanh toán chuyển khoản
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </>}
                {/* Thông tin thanh toán */}
            </div>
        </div>
    );
};

export default Bill;