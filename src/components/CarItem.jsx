import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SosanhContext } from '../ContextApi/SosanhContext';
import InformationCar from './InformationCar';

const CarItem = ({ tenhangxe, tendongxe, hopso, hinhanh, giathue, id }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, openModal] = useState(false);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [replaceTarget, setReplaceTarget] = useState(null); // 1 hoặc 2, để xác định thay thế xe nào
    const [toastMessage, setToastMessage] = useState(null); // Thông báo tạm thời

    const { xe1, xe2, setXe1, setXe2, tenxe1, tenxe2, setTenxe1, setTenxe2 } = useContext(SosanhContext);

    const navigate = useNavigate();

    const closeModal = () => {
        openModal(false);
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // Ẩn thông báo sau 3 giây
    };

    const handleCompare = () => {
        if (xe1 && xe2) {
            setShowCompareModal(true);
        } else if (xe1 && !xe2) {
            setXe2(id);
            setTenxe2(`${tenhangxe} ${tendongxe}`);
            showToast(`Đã thêm xe "${tenhangxe} ${tendongxe}" vào danh sách so sánh.`);
        } else if (!xe1 && xe2) {
            setXe1(id);
            setTenxe1(`${tenhangxe} ${tendongxe}`);
            showToast(`Đã thêm xe "${tenhangxe} ${tendongxe}" vào danh sách so sánh.`);
        } else {
            setXe1(id);
            setTenxe1(`${tenhangxe} ${tendongxe}`);
            showToast(`Đã thêm xe "${tenhangxe} ${tendongxe}" vào danh sách so sánh.`);
        }
    };

    const handleReplace = (target) => {
        if (target === 1) {
            setXe1(id);
            setTenxe1(`${tenhangxe} ${tendongxe}`);
            showToast(`Đã thay thế xe đầu tiên bằng "${tenhangxe} ${tendongxe}".`);
        } else if (target === 2) {
            setXe2(id);
            setTenxe2(`${tenhangxe} ${tendongxe}`);
            showToast(`Đã thay thế xe thứ hai bằng "${tenhangxe} ${tendongxe}".`);
        }
        setShowCompareModal(false);
    };

    const handleViewDetails = () => {
        openModal(true);
    };

    const idxe = id;

    return (
        <>
            <div
                className="relative cursor-pointer bg-white rounded-lg shadow-md transition-shadow duration-300 transform"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="p-4">
                    <img
                        src={hinhanh}
                        alt={`Hình ảnh của ${tenhangxe} ${tendongxe}`}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                </div>
                <div className="p-4">
                    <p className="text-sm">{hopso}</p>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        {tenhangxe} {tendongxe}
                    </h2>
                    <p className="text-gray-800 font-semibold">{giathue} K/ngày</p>
                </div>
                {/* Hiển thị nút khi hover */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col justify-center items-center rounded-lg">
                        <button
                            onClick={handleCompare}
                            className="mb-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                        >
                            So sánh
                        </button>
                        <button
                            onClick={handleViewDetails}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                )}
            </div>

            {/* Modal hiển thị khi đã có 2 xe */}
            {showCompareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md h-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                            So sánh xe đã đầy đủ
                        </h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Bạn có muốn thay thế xe trong danh sách so sánh không?
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => handleReplace(1)}
                                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                            >
                                Thay thế xe {tenxe1}
                            </button>
                            <button
                                onClick={() => handleReplace(2)}
                                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                            >
                                Thay thế xe {tenxe2}
                            </button>
                        </div>
                        <button
                            onClick={() => setShowCompareModal(false)}
                            className="mt-6 w-full px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
            {toastMessage && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white  py-3 rounded-lg shadow-lg z-50">
                    {toastMessage}
                </div>
            )}
            <InformationCar isOpen={isOpen} closeModal={closeModal} idxe={idxe} />
        </>
    );
};

export default CarItem;