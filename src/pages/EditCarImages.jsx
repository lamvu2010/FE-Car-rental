import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditCarImages() {
    const { idxe } = useParams();
    const [car, setCar] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const navigate = useNavigate();
    const fetchCarDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/xe/${idxe}`);
            setCar(res.data.data);
            const response = await axios.get(`http://localhost:8080/image/${idxe}/xe`);
            const imagesData = response.data.data.map(item => ({
                id: item.id,
                loai: item.loai,
                src: `data:image/jpeg;base64,${item.src}`
            }));
            setImages(imagesData);
        } catch (error) {
            console.error("Error fetching car details:", error);
        }
    };
    useEffect(() => {
        fetchCarDetails();
    }, [idxe]);

    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    const handleAddImages = async () => {
        if (selectedFiles.length > 0) {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('images', file);
            });
            formData.append('id', idxe);
            formData.append('loai', 'xe');
            try {
                const res = await axios.post('http://localhost:8080/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.status === 200) {
                    alert("Thêm ảnh thành công");
                    // const newImages = selectedFiles.map(file => URL.createObjectURL(file));
                    // setImages([...images, ...newImages]);
                    // setSelectedFiles([]);
                } else {
                    alert("Thêm ảnh thất bại");
                }
            } catch (error) {
                console.error("Error adding images:", error);
                alert("Thêm ảnh thất bại");
            }
        }
        fetchCarDetails();
    };

    const handleDeleteImage = async (imageId) => {
        try {
            const res = await axios.delete(`http://localhost:8080/image/${imageId}`);
            if (res.status === 200) {
                setImages(images.filter(image => image.id !== imageId));
            } else {
                alert("Xóa ảnh thất bại");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Xóa ảnh thất bại");
        }
    };

    if (!car) return <p className="text-center text-lg text-gray-600">Loading...</p>;

    return (
        <div className="p-8 max-w-5xl mx-auto bg-white shadow-xl rounded-lg">
            <h1 className="text-4xl font-semibold text-gray-900 mb-6">Chỉnh sửa ảnh của xe {car.tenxe}</h1>
            <div className="mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                />
                <button
                    onClick={handleAddImages}
                    className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300">
                    Thêm Ảnh
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {images.map(image => (
                    <div className="relative group rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <img src={image.src} key={image.id} alt={`Car image ${image.id}`} className="w-full h-40 object-cover transition-transform duration-300 transform group-hover:scale-105" />
                        <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 3a1 1 0 01.993.883L11 4h5.5a.5.5 0 01.492.41L17 5v.5a.5.5 0 01-.5.5H16v11a2 2 0 01-1.85 1.995L14 18H6a2 2 0 01-1.995-1.85L4 16V5.5h-.5a.5.5 0 01-.492-.41L3 5V4a.5.5 0 01.41-.492L4 3.5h5.5a.5.5 0 01.493.41L10 4h0zM9 5V4h2v1H9zm-1 4v7a1 1 0 001 1h4a1 1 0 001-1V9H8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={() => navigate(-1)}
                className="mt-8 py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300">
                Quay lại
            </button>
        </div>
    );
};

export default EditCarImages;
