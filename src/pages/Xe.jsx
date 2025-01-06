import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import InformationCar from "../components/InformationCar";
import ReactModal from "react-modal";
import Notification from "../components/Notification";

function Xe() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalState, setModalState] = useState('');
    const itemsPerPage = 7;

    const [isOpen, openModal] = useState(false);
    const [idCar, setIdCar] = useState('');
    const [selectedCar, setSelectedCar] = useState({});
    const [message, setMessage] = useState('');
    const [reload, setReload] = useState(true);

    const closeModal = () => {
        openModal(false);
        setIdCar('');
        setModalState('');
        setError('');
    }

    const [carList, setCarList] = useState([]);

    const navigate = useNavigate(); // Use useNavigate

    const getTotalCar = async () => {
        try {
            const response = await axios.get('http://localhost:8080/xe/sl');
            const totalCar = response.data.data;
            if (totalCar === 0) {
                setTotalPages(0)
            } else {
                const totalPages = Math.floor(totalCar / itemsPerPage);
                setTotalPages(totalPages);
            }
        }
        catch (error) {
            alert('Lỗi api')
        }
    }

    const getListCarName = async () => {
        axios.get('http://localhost:8080/dongxe')
            .then(response => {
                setCarList(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching car list:", error);
            });
    }

    useEffect(() => {
        getTotalCar();
        getListCarName();
    }, []);

    const fetchData = async (page) => {
        await axios.get(`http://localhost:8080/xe?page=${page}&size=${itemsPerPage}`)
            .then(response => {
                setData(response.data.data || []);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };


    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, reload])

    const handleNextPage = () => {
        if (currentPage < totalPages + 1) {
            setCurrentPage(currentPage + 1);
        }

    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleClickAddCar = () => {
        navigate('/addCar');
    }

    const handleClickUpdateCar = (idxe) => {
        navigate(`/updateCar/${idxe}`);
    }

    const handleClickDelete = (car) => {
        setSelectedCar(car);
        setModalState('delete');
        openModal(true);
    };

    const handleClickSubmitDelete = async (idxe) => {
        try {
            const response = await axios.delete(`http://localhost:8080/xe/${idxe}`);
            if (response.data.success === true) {
                openModal(true);
                setModalState('notification');
                setMessage('Xoá thành công');
                setReload(prev => !prev);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    const handleClickInformationCar = (idxe) => {
        openModal(true);
        setModalState('infor');
        setIdCar(idxe);
    }

    if (loading) return <p>Loading...</p>;
    return (<>
        <div className="flex h-screen">
            <SideBar />
            <div className="flex flex-col space-y-3 p-4 w-full">
                <h1 className="text-center font-bold text-2xl">Danh sách xe</h1>
                <div><button onClick={handleClickAddCar} className="font-semibold bg-blue-300 p-3 rounded hover:bg-blue-400">Thêm xe</button></div>
                <div className="flex-grow max-h-[calc(100vh-150px)] overflow-y-auto">
                    <table className="w-full overflow-hidden rounded-lg shadow-2xl border border-gray-300 border-collapse text-sm">
                        <thead className="bg-gray-200 border border-gray-300">
                            <tr>
                                <th className="p-3 text-left border-b border-gray-300">ID</th>
                                <th className="p-3 text-left border-b border-gray-300">Tên xe</th>
                                <th className="p-3 text-left border-b border-gray-300">Năm sx</th>
                                <th className="p-3 text-left border-b border-gray-300">Biển số</th>
                                <th className="p-3 text-left border-b border-gray-300">Trạng thái</th>
                                <th className="p-3 text-left border-b border-gray-300">Sửa</th>
                                <th className="p-3 text-left border-b border-gray-300">Xóa</th>
                                <th className="p-3 text-left border-b border-gray-300">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {data.map(item => (
                                <tr key={item.idxe} className='hover:bg-gray-100 transition-colors'>
                                    <td className="p-3 border-b border-gray-300">{item.idxe}</td>
                                    <td className="p-3 border-b border-gray-300">{item.tenxe}</td>
                                    <td className="p-3 border-b border-gray-300">{item.namsanxuat}</td>
                                    <td className="p-3 border-b border-gray-300">{item.biensoxe}</td>
                                    <td className="p-3 border-b border-gray-300">{item.trangthai ? "Đang được thuê" : "Có thể thuê"}</td>
                                    <td className="p-2 border-b border-gray-300"><button onClick={() => handleClickUpdateCar(item.idxe)} className="px-4 py-2 bg-yellow-300 rounded hover:bg-yellow-400 transition-colors">Sửa</button></td>
                                    <td className="p-2 border-b border-gray-300"><button onClick={() => handleClickDelete(item)} className="px-4 py-2 bg-red-300 rounded hover:bg-red-400 transition-colors">Xóa</button></td>
                                    <td className="p-2 border-b border-gray-300"><button onClick={() => handleClickInformationCar(item.idxe)} className="px-4 py-2 bg-green-300 rounded hover:bg-green-400 transition-colors">Chi tiết</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center space-x-4">
                    <button onClick={handlePreviousPage} className="p-0.5 bg-gray-400 rounded">Prev</button>
                    <p>{currentPage + 1}</p>
                    <button onClick={handleNextPage} className="p-0.5 bg-gray-400 rounded">Next</button>
                </div>
            </div>
        </div>
        {modalState === 'infor' && <InformationCar isOpen={isOpen} closeModal={closeModal} idxe={idCar} />}
        {modalState === 'delete' && <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            className="bg-white rounded-lg p-10 max-w-sm w-full overflow-auto">
            <div className="flex flex-col space-y-5">
                <h1 className="text-center font-bold text-2xl" >Xoá xe</h1>
                <p>Tên xe: {selectedCar.tenxe}</p>
                <p>Biển số xe: {selectedCar.biensoxe}</p>
                <p className="text-red-400">Bạn muốn xoá xe trong hệ thống?</p>
                {error && <p className="text-red-500">{error}</p>}
                <button onClick={() => { handleClickSubmitDelete(selectedCar.idxe) }} className="p-3 bg-red-300 hover:bg-red-400 rounded font-semibold">Xác nhận</button>
            </div></ReactModal>}
        {modalState === 'notification' && <Notification isOpen={isOpen} closeModal={closeModal} message={message} />}
    </>
    )
}
export default Xe