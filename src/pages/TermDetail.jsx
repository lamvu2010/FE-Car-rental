import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TermDetail = () => {

    useEffect(() => {
        document.title = "Chi tiết điều khoản | Ứng dụng của bạn";
    }, []);
    const navigate = useNavigate();
    const { iddieukhoan } = useParams(); // Lấy id từ useParams
    const [detailTerm, setDetailTerm] = useState(null);
    const [listTerms, setListTerms] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái tải

    const fetchData = async () => {
        try {
            // Lấy danh sách điều khoản
            const listTerm = await axios.get('http://localhost:8080/dieukhoan');
            if (listTerm.data.success === true) {
                setListTerms(listTerm.data.data || []);
            }

            // Lấy chi tiết điều khoản
            const response = await axios.get(`http://localhost:8080/dieukhoan/getDetail/${iddieukhoan}`);
            if (response.data.success === true) {
                setDetailTerm(response.data.data);
            }
        } catch (error) {
            console.log(error.response);
        } finally {
            setLoading(false); // Đặt trạng thái tải là false
        }
    };

    useEffect(() => {
        fetchData(); // Gọi hàm fetchData
    }, [iddieukhoan]); // Thay đổi iddieukhoan sẽ gọi lại

    const handleClickBack = () => {
        navigate('/dieukhoan');
    };

    const handleClickTerm = (id) => {
        navigate(`/term-details/${id}`);
    }

    return (
        <div className="flex flex-col p-8 space-y-6 bg-slate-100 min-h-screen">
            {/* Header với nút Quay lại và tiêu đề */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handleClickBack}
                    className="bg-slate-400 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-500 transition duration-300"
                >
                    Quay lại
                </button>
                <h1 className="text-center text-3xl font-bold text-gray-700">
                    {listTerms.find(term => term.iddieukhoan === Number(iddieukhoan))?.tieude || 'Không tìm thấy tiêu đề'}
                </h1>
                <div className="w-16"></div> {/* Phần trống để cân bằng khoảng cách với nút */}
            </div>

            {/* Nội dung chính với danh sách danh mục và nội dung điều khoản */}
            <div className="grid grid-cols-12 gap-6">
                {/* Cột danh mục */}
                <div className="col-span-4 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-600 mb-4">Danh sách danh mục</h2>
                    <ul>
                        {listTerms.map(item => (
                            <li onClick={() => handleClickTerm(item.iddieukhoan)} key={item.iddieukhoan} className="py-2 border-b hover:text-slate-400 cursor-pointer">{item.tieude}</li>
                        ))}
                    </ul>
                </div>

                {/* Cột nội dung chi tiết điều khoản */}
                <div className="col-span-8 bg-white p-6 rounded-lg shadow">
                    {loading ? (
                        <div className="text-center text-gray-500">Đang tải...</div>
                    ) : detailTerm ? (
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: detailTerm.noidung.replace(/\n/g, '<br />') }}
                        />
                    ) : (
                        <div className="text-center text-gray-500">Không tìm thấy nội dung.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TermDetail;
