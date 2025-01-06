import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ThongBaoSuCo = () => {
    const { idthongbaosuco } = useParams();
    const navigate = useNavigate();
    const [issueData, setIssueData] = useState(null);
    const [imagesIssue, setImagesIssue] = useState([]);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hopdong/thongbao-suco/${idthongbaosuco}`);
            if (response.data.success) {
                const result = response.data.data;
                setIssueData(result);

                // Fetch images related to the issue
                const imagesIssue = await axios.get(`http://localhost:8080/image/${result.idthongbaosuco}/thongbaosuco`);
                const listImage = imagesIssue.data.data;
                const listSrc = listImage.map(item => `data:image/jpeg;base64,${item.src}`);
                setImagesIssue(listSrc);
            }
        } catch (error) {
            console.error('Error fetching issue data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [idthongbaosuco]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const openCarousel = (index) => {
        setCurrentImageIndex(index);
        setIsCarouselOpen(true);
    };

    const closeCarousel = () => {
        setIsCarouselOpen(false);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesIssue.length) % imagesIssue.length);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesIssue.length);
    };

    if (!issueData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Thông Báo Sự Cố</h1>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Vị Trí:</h3>
                <p className="text-gray-600">{issueData.vitri}</p>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Liên Lạc:</h3>
                <p className="text-gray-600">{issueData.lienlac}</p>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Mô Tả:</h3>
                <p className="text-gray-600">{issueData.mota}</p>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Hình Ảnh:</h3>
                <div className="flex flex-wrap gap-4">
                    {imagesIssue.length > 0 ? (
                        imagesIssue.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Sự cố ${index + 1}`}
                                className="w-48 h-36 object-cover rounded-md shadow cursor-pointer"
                                onClick={() => openCarousel(index)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600">Không có hình ảnh nào</p>
                    )}
                </div>
            </div>
            <button
                onClick={handleGoBack}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
                Quay lại
            </button>

            {/* Carousel Modal */}
            {isCarouselOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <button
                        onClick={closeCarousel}
                        className="absolute top-4 right-4 text-white text-2xl font-bold"
                    >
                        &times;
                    </button>
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 text-white px-3 py-2 rounded-full"
                    >
                        &#9664;
                    </button>
                    <img
                        src={imagesIssue[currentImageIndex]}
                        alt={`Carousel ${currentImageIndex + 1}`}
                        className="max-w-3xl max-h-screen object-contain"
                    />
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 text-white px-3 py-2 rounded-full"
                    >
                        &#9654;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ThongBaoSuCo;
