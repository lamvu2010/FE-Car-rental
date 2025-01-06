import React, { useState, useContext, useEffect } from "react";
import { UserContext } from '../ContextApi/UserContext';
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import Notification from "../components/Notification";

function HopDongUser() {
    const [trangthai, setTrangthai] = useState('duyet');
    const [contacts, setContacts] = useState([]);

    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [isOpen, openModal] = useState(false);
    const [isOpenNotification, openNotification] = useState(false);
    const [message, setMessage] = useState('');
    const [modalState, setModalState] = useState('');

    const [error, setError] = useState('');
    const [reload, setReload] = useState(false);

    const fetchData = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/user/${trangthai}/${user.khachhang.sodienthoai}`);
            setContacts(response.data.data);
        } catch (error) {
            console.error('Error fetching the data', error);
        }
    };

    useEffect(() => {
        console.log('Trạng thái hiện tại:', trangthai);
        fetchData();
    }, [trangthai, reload]);

    const handleClickDetail = (idhopdong) => {
        navigate(`/contact/${idhopdong}`)
    }
    const handleClickDeleteExpired = () => {
        openModal(true);
        setModalState('expired');
    }

    const handleSubmitDeleteExpired = async () => {
        try {
            const request = {
                sodienthoai: user.khachhang.sodienthoai
            }
            const response = await axios.post('http://localhost:8080/hopdong/xoa-hopdong-hethan', request);
            if (response.data.success) {
                openNotification(true)
                setMessage('Xoá hợp đồng hết hạn thành công')
                setReload(prev => !prev)
                openModal(false);
            }
        }
        catch (error) {
            setError('Lỗi khi xoá hợp đồng hết hạn.')
        }
    }

    const handleClickDeleteDeny = () => {
        openModal(true);
        setModalState('deny');
    }

    const handleSubmitDeleteDeny = async () => {
        try {
            const request = {
                sodienthoai: user.khachhang.sodienthoai
            }
            const response = await axios.post('http://localhost:8080/hopdong/xoa-hopdong-tuchoi', request);
            if (response.data.success) {
                openNotification(true)
                setMessage('Xoá hợp đồng bị từ chối thành công')
                setReload(prev => !prev)
                openModal(false);
            }
        }
        catch (error) {
            setError('Lỗi khi xoá hợp đồng từ chối.')
        }
    }

    return (
        <>
            < Header />
            <div className="container p-6 h-full space-y-4">
                <h1 className="text-xl font-semibold text-center">Danh sách hợp đồng</h1>

                {/* Dropdown for status selection */}
                <div className="flex items-center mb-4 space-x-4 justify-between">
                    <div>
                        <label htmlFor="status" className="mr-2 font-medium">Trạng thái:</label>
                        <select
                            id="status"
                            value={trangthai}
                            onChange={(e) => setTrangthai(e.target.value)}
                            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="dangky">Chưa duyệt</option>
                            <option value="duyet">Đã duyệt</option>
                        </select>
                    </div>
                    {/* <div className="flex justify-start space-x-2">
                        <button onClick={handleClickDeleteExpired} className="p-2 bg-red-500 rounded-md hover:bg-red-400 text-white">Xoá hợp đồng hết hạn</button>
                        <button onClick={handleClickDeleteDeny} className="p-2 bg-red-500 rounded-md hover:bg-red-400 text-white">Xoá hợp đồng từ chối</button>
                    </div> */}
                </div>

                <div className="overflow-y-auto rounded-lg shadow max-h-[60vh] h-full">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100 text-gray-700 text-sm font-medium">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Số điện thoại</th>
                                <th className="py-3 px-4 text-left">Họ và tên</th>
                                <th className="py-3 px-4 text-left">Tên xe</th>
                                <th className="py-3 px-4 text-left">Ngày bắt đầu</th>
                                <th className="py-3 px-4 text-left">Ngày kết thúc</th>
                                <th className="py-3 px-4 text-left">Ngày tạo</th>
                                <th className="py-3 px-4 text-left">Trạng thái</th>
                                <th className="py-3 px-4 text-left">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {contacts && contacts.map((contact) => (
                                <tr
                                    key={contact.idhopdong}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-2 px-4">{contact.idhopdong}</td>
                                    <td className="py-2 px-4">{contact.sodienthoai}</td>
                                    <td className="py-2 px-4">{contact.hovaten}</td>
                                    <td className="py-2 px-4">{`${contact.tenhangxe} ${contact.tendongxe}`}</td>
                                    <td className="py-2 px-4">
                                        {new Intl.DateTimeFormat('vi-VN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(contact.thoigianbatdau))}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Intl.DateTimeFormat('vi-VN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(contact.thoigianketthuc))}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Intl.DateTimeFormat('vi-VN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(contact.ngaytao))}
                                    </td>
                                    <td className="py-2 px-4">
                                        {contact.trangthai === 'dangky' ? 'Chưa duyệt' : ''}
                                        {contact.trangthai === 'duyet' ? 'Đã duyệt' : ''}
                                        {contact.trangthai === 'tuchoi' ? 'Đã từ chối' : ''}
                                        {contact.trangthai === 'dacoc' ? 'Đã đặt cọc' : ''}
                                        {contact.trangthai === 'dahoantien' ? 'Đã hoàn tiền' : ''}
                                        {contact.trangthai === 'chuahoantien' ? 'Chưa hoàn tiền' : ''}
                                        {contact.trangthai === 'hethan' ? 'Đã hết hạn' : ''}
                                        {contact.trangthai === 'huy' ? 'Đã huỷ' : ''}
                                        {contact.trangthai === 'dagiaoxe' ? 'Đã giao xe' : ''}
                                        {contact.trangthai === 'danhanxe' ? 'Đã trả xe' : ''}
                                        {contact.trangthai === 'hoantat' ? 'Đã hoàn tất' : ''}
                                    </td>
                                    <td onClick={() => handleClickDetail(contact.idhopdong)} className="py-2 px-4 text-blue-500 hover:underline cursor-pointer">
                                        Chi tiết
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {modalState === 'expired' && <ReactModal
                isOpen={isOpen}
                onRequestClose={() => {
                    openModal(false)
                    setModalState('')
                    setError('')
                }}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full overflow-auto transform transition-all duration-300 ease-in-out"
            >
                <div className=' flex flex-col space-y-5'>
                    <h3 className='text-2xl font-semibold text-center'>Thông báo</h3>
                    <p className=''>Bạn sẽ không thể xem lại những hợp đồng hết hạn.</p>
                    {error && <p className="text-red-400 italic">{error}</p>}
                    <button onClick={handleSubmitDeleteExpired} className='bg-red-400 p-2 rounded px-4 hover:bg-red-300'>Xác nhận xoá</button>
                </div>
            </ReactModal>}

            {modalState === 'deny' && <ReactModal
                isOpen={isOpen}
                onRequestClose={() => {
                    openModal(false)
                    setModalState('')
                    setError('')
                }}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full overflow-auto transform transition-all duration-300 ease-in-out"
            >
                <div className=' flex flex-col space-y-5'>
                    <h3 className='text-2xl font-semibold text-center'>Thông báo</h3>
                    <p className=''>Bạn sẽ không thể xem lại những hợp đồng từ chối.</p>
                    {error && <p className="text-red-400 italic">{error}</p>}
                    <button onClick={handleSubmitDeleteDeny} className='bg-red-400 p-2 rounded px-4 hover:bg-red-300'>Xác nhận xoá</button>
                </div>
            </ReactModal>}
            <Notification isOpen={isOpenNotification} closeModal={() => {
                openNotification(false)
                setMessage('')
            }} message={message} />
        </>
    );
}

export default HopDongUser;