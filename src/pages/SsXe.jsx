import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { SosanhContext } from '../ContextApi/SosanhContext';
import { useNavigate } from 'react-router-dom';
import InformationCar from '../components/InformationCar';

const SsXe = () => {
    const navigate = useNavigate(); // Hook để điều hướng
    const { xe1, xe2 } = useContext(SosanhContext);
    const [xe1Data, setXe1Data] = useState(null);
    const [xe2Data, setXe2Data] = useState(null);
    const [imageXe1, setImageXe1] = useState([]);
    const [imageXe2, setImageXe2] = useState([]);
    const [isOpen, openModal] = useState(false);
    const [idOpen, setIdOpen] = useState('')

    const closeModal = () => {
        openModal(false);
        setIdOpen('');
    }

    useEffect(() => {
        fetchData();
        fetchImages();
    }, [xe1, xe2]);

    const fetchData = async () => {
        try {
            if (xe1) {
                const response = await axios.get(`http://localhost:8080/xe/${xe1}`);
                if (response.data.success) setXe1Data(response.data.data);
            }
            if (xe2) {
                const response = await axios.get(`http://localhost:8080/xe/${xe2}`);
                if (response.data.success) setXe2Data(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching car data:', error.response.data);
        }
    };

    const fetchImages = async () => {
        try {
            if (xe1) {
                const response = await axios.get(`http://localhost:8080/image/${xe1}/xe`);
                const listImages = response.data.data.map(item => `data:image/jpeg;base64,${item.src}`);
                setImageXe1(listImages);
            }
            if (xe2) {
                const response = await axios.get(`http://localhost:8080/image/${xe2}/xe`);
                const listImages = response.data.data.map(item => `data:image/jpeg;base64,${item.src}`);
                setImageXe2(listImages);
            }
        } catch (error) {
            console.error('Error fetching car images:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 relative">
            <button
                className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                onClick={() => navigate(-1)} // Quay lại trang trước
            >
                Quay lại
            </button>
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-600">So sánh xe</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full bg-white border-collapse border border-gray-300">
                    <thead>
                        <tr className="">
                            <th className="border border-gray-300 px-6 py-4 text-left">Thông Tin</th>
                            <th className="border border-gray-300 px-6 py-4 text-center">Xe 1</th>
                            <th className="border border-gray-300 px-6 py-4 text-center">Xe 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Images */}
                        <tr className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-6 py-4 font-semibold">Hình Ảnh</td>
                            <td className="border border-gray-300 px-6 py-4 text-center">
                                {imageXe1.length > 0 ? (
                                    <img
                                        src={imageXe1[0]}
                                        alt="Car 1"
                                        className="h-40 w-60 object-cover mx-auto rounded-lg shadow-md"
                                    />
                                ) : (
                                    <span className="text-gray-500 italic">Không có hình ảnh</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-6 py-4 text-center">
                                {imageXe2.length > 0 ? (
                                    <img
                                        src={imageXe2[0]}
                                        alt="Car 2"
                                        className="h-40 w-60 object-cover mx-auto rounded-lg shadow-md"
                                    />
                                ) : (
                                    <span className="text-gray-500 italic">Không có hình ảnh</span>
                                )}
                            </td>
                        </tr>
                        {/* Data Rows */}
                        {[
                            { label: 'Tên Dòng Xe', field: 'tendongxe' },
                            { label: 'Thương Hiệu', field: 'tenhangxe' },
                            { label: 'Giá Thuê', field: 'giahientai', suffix: ' K/ngày' },
                            { label: 'Hộp Số', field: 'hopso' },
                            { label: 'Số chỗ ngồi', field: 'sochongoi' },
                            { label: 'Kiểu Dáng', field: 'kieudang' },
                            { label: 'Xuất Xứ', field: 'xuatxu' },
                            { label: 'Dẫn động', field: 'dandong' },
                            { label: 'Động cơ', field: 'dongco' },
                        ].map(({ label, field, suffix = '' }, idx) => (
                            <tr key={idx} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-6 py-4 font-semibold">{label}</td>
                                <td className="border border-gray-300 px-6 py-4 text-center">
                                    {xe1Data?.[field] ? xe1Data[field] + suffix : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-6 py-4 text-center">
                                    {xe2Data?.[field] ? xe2Data[field] + suffix : 'N/A'}
                                </td>
                            </tr>
                        ))}
                        <tr className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-6 py-4 font-semibold">Hành động</td>
                            <td className="border border-gray-300 px-6 py-4 text-center">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                                    onClick={() => {
                                        openModal(true)
                                        setIdOpen(xe1);
                                    }} // Điều hướng đến trang thuê xe 1
                                >
                                    Chọn Thuê
                                </button>
                            </td>
                            <td className="border border-gray-300 px-6 py-4 text-center">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                                    onClick={() => {
                                        openModal(true)
                                        setIdOpen(xe2)
                                    }
                                    } // Điều hướng đến trang thuê xe 2
                                >
                                    Chọn Thuê
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <InformationCar isOpen={isOpen} closeModal={closeModal} idxe={idOpen} />
        </div>
    );
};

export default SsXe;