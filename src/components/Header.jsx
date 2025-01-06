import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import { UserContext } from '../ContextApi/UserContext';
import LoginModal from './LoginModal';
import { MessageContext } from '../ContextApi/MessageContext';
import axios from 'axios';

ReactModal.setAppElement("#root");

function Header() {
    const { message, setMessage } = useContext(MessageContext);
    const containerRef = useRef(null);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [numberNotifications, setNumberNotifications] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user, login, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [reload, setReload] = useState(false);

    // Tăng số lượng thông báo mỗi khi có message mới
    useEffect(() => {
        if (message) {
            setNotifications((prev) => [message, ...prev]);  // Thêm thông báo mới vào đầu danh sách
            setNumberNotifications(prev => prev + 1);
            setMessage(''); // Tăng số lượng thông báo
        }
    }, [message]);

    const fetchNotifications = async () => {
        if (!user || isLoading) {
            setNotifications([]);
            return
        }; // Tránh lặp lại fetch khi đang tải
        setIsLoading(true); // Đặt trạng thái đang tải
        try {
            const response = await axios.get(`http://localhost:8080/thongbao`, {
                params: { page, size: 7, sdt: user.khachhang.sodienthoai }
            });

            if (response.data.success && response.data.data.length > 0) {
                const newNotifications = response.data.data.filter(
                    newNotif => !notifications.some(existingNotif => existingNotif.idthongbao === newNotif.idthongbao)
                );
                setNotifications(prev => [...(page === 0 ? [] : prev), ...newNotifications]);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông báo:", error);
        } finally {
            setIsLoading(false); // Tắt trạng thái tải
        }
    };

    // Fetch notifications từ server
    useEffect(() => {
        fetchNotifications();
    }, [page, user, reload]);

    // Xử lý cuộn và tải thêm thông báo
    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        if ((clientHeight + scrollTop >= scrollHeight - 20) && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Lắng nghe sự kiện cuộn
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (currentContainer) {
            currentContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentContainer) {
                currentContainer.removeEventListener('scroll', handleScroll);
            }
        };
    });

    const handleLoginClick = () => {
        setLoginModalOpen(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    const handleClickSignUp = () => {
        navigate('/signup');
    };

    const handleClickPending = () => {
        navigate('/dangky');
    };

    const handleClickHome = () => {
        navigate('/home');
    };

    const handleClickManager = () => {
        navigate('/admin');
    };

    const handleClickUserInfo = () => {
        navigate('/userInfo');
    };

    const handleClickContacts = () => {
        navigate('/contacts');
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownOpen(!isNotificationDropdownOpen);
    };

    const handleClickNotification = async (idthongbao, loaithongbao, idnoidung) => {
        // Logic xử lý khi người dùng click vào thông báo
        if (loaithongbao === 'dangky' || loaithongbao === 'yeucauthanhtoan' || loaithongbao === 'tuchoihopdong' || loaithongbao === 'hopdong') {
            navigate(`/contact/${idnoidung}`);
        }
        if (loaithongbao === 'thongbaosuco') {
            navigate(`/issue/${idnoidung}`);
        }
        try {
            const response = await axios.get(`http://localhost:8080/thongbao/daxem/${idthongbao}`)
            if (response.data.success) {
                console.log('daxem')
                setReload(prev => !prev);
            }
        } catch (error) {
            console.log('lỗi')
        }
    };


    const handleClickNotifications = () => {
        setNumberNotifications(0);
    };

    return (
        <>
            <div className="flex justify-between items-center p-4">
                <p className='text-2xl font-semibold font-serif'>Car-Rental</p>
                <nav className="flex items-center justify-start space-x-10">
                    <ul className="flex justify-between space-x-10">
                        <li onClick={handleClickHome} className="cursor-pointer">Trang chủ</li>
                        <Link to="/terms-and-conditions" target="_blank"
                            rel="noopener noreferrer"><li className="cursor-pointer">Điều khoản</li></Link>
                        <Link to="/sosanh"
                            rel="noopener noreferrer"><li className="cursor-pointer">So sánh</li></Link>
                        {user && user.quyen === "khachhang" && <li onClick={handleClickPending} className=" cursor-pointer">Hợp đồng</li>}
                        {user && user.quyen === "nhanvien" && <li onClick={handleClickContacts} className=" cursor-pointer">Hợp đồng</li>}
                        {user && (user.quyen === 'admin') && <li onClick={handleClickManager} className=" cursor-pointer">Quản lý</li>}
                        {user && (user.quyen === 'khachhang') && <li onClick={handleClickUserInfo} className='cursor-pointer'>Thông tin</li>}
                    </ul>
                    <div onClick={handleClickNotifications} className="flex items-center relative">
                        <p onClick={toggleNotificationDropdown} className="cursor-pointer flex items-center space-x-2">
                            <span className="material-icons">Thông báo</span>
                            <span className="bg-red-500 text-white text-xs rounded-full px-2">{numberNotifications}</span>
                        </p>

                        {/* Notification Dropdown */}
                        {isNotificationDropdownOpen && (
                            <div
                                ref={containerRef}
                                className="absolute top-full left-0 mt-2 w-72 bg-white shadow-xl rounded-lg z-10 max-h-96 overflow-y-auto text-sm border border-gray-200"
                            >
                                <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                                    <h3 className="text-base font-semibold text-gray-700">Thông báo</h3>
                                    <button className='italic text-sm hover:underline'>Đánh dấu tất cả đã đọc</button>
                                </div>
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.idthongbao}
                                            onClick={() =>
                                                handleClickNotification(
                                                    notification.idthongbao,
                                                    notification.loaithongbao,
                                                    notification.idnoidung
                                                )
                                            }
                                            className={`p-3 border-b last:border-none cursor-pointer hover:bg-gray-100 transition ${notification.trangthai === 'daxem'
                                                ? 'bg-white'
                                                : 'bg-blue-50'
                                                }`}
                                        >
                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {notification.noidung}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{new Date(notification.thoigian).toLocaleString("vi-VN")}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        Không có thông báo mới.
                                    </div>
                                )}
                                {isLoading && (
                                    <div className="p-4 text-center text-gray-500">
                                        <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full"></span>
                                        Đang tải...
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {user ? (
                        <div className="flex items-center space-x-2">
                            <span className="">Xin chào, {user?.khachhang?.hovaten || (user.quyen === 'nhanvien' ? 'Nhân viên' : 'Admin')}</span>
                            <button
                                className='mr-5 p-2 rounded-md border border-black'
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                className="mr-5 p-2 rounded-md border border-black"
                                onClick={handleLoginClick}
                            >
                                Đăng nhập
                            </button>
                            <button
                                className="mr-5 p-2 rounded-md border border-black"
                                onClick={handleClickSignUp}
                            >
                                Đăng ký
                            </button>
                        </>
                    )}
                </nav>
            </div>

            <LoginModal isOpen={isLoginModalOpen} setLoginModalOpen={setLoginModalOpen} />
        </>
    );
}

export default Header;
