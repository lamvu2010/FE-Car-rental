import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TermVersions = () => {
    const navigate = useNavigate();
    const { iddieukhoan } = useParams();

    const [listTermVersions, setListTermVersions] = useState([]);
    const [termVersion, setTermVersion] = useState('');
    const [termDetail, setTermDetail] = useState('');
    const [termTitle, setTermTitle] = useState('');

    const [loading, setLoading] = useState(true); // Thêm trạng thái tải

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/dieukhoan/getVersions/${iddieukhoan}`);
            if (response.data.success === true) {
                setListTermVersions(response.data.data);
            }

            const titleResponse = await axios.get(`http://localhost:8080/dieukhoan/getTitle/${iddieukhoan}`);
            if (titleResponse.data.success === true) {
                setTermTitle(titleResponse.data.data);
            }

            const detailsResponse = await axios.get(`http://localhost:8080/dieukhoan/getDetail/${iddieukhoan}`)
            if (detailsResponse.data.success === true) {
                setTermDetail(detailsResponse.data.data);
                setLoading(false);
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleClickBack = () => {
        navigate('/dieukhoan');
    };

    const handleClickVersion = async (item) => {
        try {
            const version = item.phienban;
            const title = termTitle.tieude;
            const request = {
                phienban: version,
                tieude: title
            }
            setTermTitle(request);
            const response = await axios.get(`http://localhost:8080/dieukhoan/getDetail/${iddieukhoan}/${item.phienban}`);
            if (response.data.success === true) {
                const detail = {
                    noidung: response.data.data
                }
                setTermDetail(detail);
            }
        } catch (error) {
        }

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
                    {/* {listTerms.find(term => term.iddieukhoan === Number(iddieukhoan))?.tieude || 'Không tìm thấy tiêu đề'} */}
                    {termTitle.tieude} - {termTitle.phienban}
                </h1>
                <div className="w-16"></div> {/* Phần trống để cân bằng khoảng cách với nút */}
            </div>

            {/* Nội dung chính với danh sách danh mục và nội dung điều khoản */}
            <div className="grid grid-cols-12 gap-6">
                {/* Cột danh mục */}
                <div className="col-span-4 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-600 mb-4">Danh sách danh mục</h2>
                    <ul>
                        {listTermVersions.map(item => {
                            const ngayCapNhat = new Date(item.ngaycapnhat);
                            return (
                                <li
                                    onClick={() => handleClickVersion(item)}
                                    key={item.phienban}
                                    className="py-2 border-b hover:text-slate-400 cursor-pointer">
                                    {item.phienban} - {ngayCapNhat.getDate()}/{ngayCapNhat.getMonth() + 1}/{ngayCapNhat.getFullYear()} - {item.trangthai ? "AC" : "EX"}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Cột nội dung chi tiết điều khoản */}
                <div className="col-span-8 bg-white p-6 rounded-lg shadow">
                    {loading ? (
                        <div className="text-center text-gray-500">Đang tải...</div>
                    ) : termDetail ? (
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: termDetail.noidung.replace(/\n/g, '<br />') }}
                        />
                    ) : (
                        <div className="text-center text-gray-500">Không tìm thấy nội dung.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TermVersions