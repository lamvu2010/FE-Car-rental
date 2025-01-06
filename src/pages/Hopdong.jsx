import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Hopdong() {
    const [trangthai, setTrangthai] = useState('dangky');
    const [contacts, setContacts] = useState([]);
    const [searchId, setSearchId] = useState(''); // State cho ID tìm kiếm
    const [searchResult, setSearchResult] = useState([]); // Kết quả tìm kiếm
    const [error, setError] = useState(""); // Lỗi khi tìm kiếm

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/trangthai/${trangthai}`);
            setContacts(response.data.data);
        } catch (error) {
            console.error('Error fetching the data', error);
        }
    };

    useEffect(() => {
        setSearchResult([])
        console.log('Trạng thái hiện tại:', trangthai);
        fetchData();
    }, [trangthai]);

    const handleClickDetail = (idhopdong) => {
        navigate(`/contact/${idhopdong}`)
    }

    const handleSearch = async () => {
        if (!searchId) return;
        try {
            setError("");
            const response = await axios.get(`http://localhost:8080/hopdong/${searchId}`)
            if (response.data.success) {
                setSearchResult(response.data.data || null);
            }

        } catch (error) {
            console.error("Error searching for contract", error);
            setError("Không tìm thấy hợp đồng với ID này.");
            setSearchResult([]);
        }
    };

    return (
        <>
            < Header />
            <div className="container p-6 h-full space-y-4">
                <h1 className="text-xl font-semibold text-center">Danh sách hợp đồng</h1>

                {/* Dropdown for status selection */}
                <div className="flex justify-between">
                    <div className="flex items-center mb-4">
                        <label htmlFor="status" className="mr-2 font-medium">Trạng thái:</label>
                        <select
                            id="status"
                            value={trangthai}
                            onChange={(e) => setTrangthai(e.target.value)}
                            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="dangky">Chưa duyệt</option>
                            <option value="duyet">Đã duyệt</option>
                            <option value="tuchoi">Đã từ chối</option>
                            <option value="hethan">Đã hết hạn</option>
                            <option value="dacoc">Đã đặt cọc</option>
                            <option value="huy">Đã huỷ đăng ký</option>
                            <option value="chuahoantien">Chưa hoàn tiền cọc</option>
                            <option value="dahoantien">Đã hoàn tiền cọc</option>
                            <option value="dagiaoxe">Đã giao xe</option>
                            <option value="danhanxe">Đã nhận xe</option>
                            <option value="hoantat">Hoàn tất</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text "
                            placeholder="Tìm hợp đồng theo ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                            onClick={handleSearch}
                            className=" text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {searchResult.length === 0 ? (
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
                                        <td onClick={() => handleClickDetail(contact.idhopdong)} className="py-2 px-4 text-blue-500 hover:underline cursor-pointer">
                                            Chi tiết
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
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
                                    <th className="py-3 px-4 text-left">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                <tr
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-2 px-4">{searchResult.idhopdong}</td>
                                    <td className="py-2 px-4">{searchResult.sodienthoai}</td>
                                    <td className="py-2 px-4">{searchResult.hovaten}</td>
                                    <td className="py-2 px-4">{`${searchResult.tenhangxe} ${searchResult.tendongxe}`}</td>
                                    <td className="py-2 px-4">
                                        {new Intl.DateTimeFormat('vi-VN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(searchResult.thoigianbatdau))}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Intl.DateTimeFormat('vi-VN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(searchResult.thoigianketthuc))}
                                    </td>
                                    <td className="py-2 px-4">
                                        {new Intl.DateTimeFormat('vi-VN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(searchResult.ngaytao))}
                                    </td>
                                    <td onClick={() => handleClickDetail(searchResult.idhopdong)} className="py-2 px-4 text-blue-500 hover:underline cursor-pointer">
                                        Chi tiết
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                )}


            </div>
        </>
    );
}

export default Hopdong;