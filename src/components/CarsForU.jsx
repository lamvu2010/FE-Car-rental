import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CarItem from './CarItem';
import InformationCar from './InformationCar';

const CarsForU = () => {
    const [data, setData] = useState([]);
    const [listIdCar, setListIdCar] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/xe/ds-xe-de-xuat');
            if (response.data.success === true) {
                const listCar = response.data.data;
                setData(listCar);
                const ids = listCar.map(car => car.idxe);
                setListIdCar(ids);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchImages = async () => {
        try {
            const response = await axios.post('http://localhost:8080/image/xe/home', listIdCar);
            if (response.data.success === true) {
                const images = response.data.data;

                setData(prevData =>
                    prevData.map(car => {
                        const foundImage = images.find(image => image.id === car.idxe);
                        return {
                            ...car,
                            src: foundImage ? `data:image/png;base64,${foundImage.src}` : ''
                        };
                    })
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (listIdCar.length > 0) {
            fetchImages();
        }
        console.log(data);
    }, [listIdCar]); // Đảm bảo `fetchImages` chỉ chạy khi `listIdCar` thay đổi

    return (
        <>
            <div className='flex flex-col justify-center items-center mt-10 mx-10'>
                <h1 className='text-4xl font-semibold mb-6 '>XE DÀNH CHO BẠN</h1>
                <div className='flex flex-wrap'>
                    {data && data.map(item => (
                        <div key={item.idxe} className='p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
                            <div className='bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl'>
                                <CarItem
                                    hopso={item.hopso}
                                    tenhangxe={item.tenhangxe}
                                    tendongxe={item.tendongxe}
                                    hinhanh={item.src} // `src` lấy từ `images` sau khi được gán trong `fetchImages`
                                    giathue={item.giahientai}
                                    id={item.idxe}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default CarsForU;