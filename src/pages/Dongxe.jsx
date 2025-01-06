import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import axios from "axios";
import ReactModal from "react-modal";
import Notification from "../components/Notification"

ReactModal.setAppElement("#root");

function DongXe() {

    const [data, setData] = useState([]);
    const [listHangXe, setListHangXe] = useState([])
    const [error, setError] = useState(null);

    const [reload, setReload] = useState(false);

    const [dataImages, setDataImages] = useState([]);
    const [isOpen, setModalOpen] = useState(false);

    const [modalState, setModalState] = useState('');

    const [selectedCarBranch, setSelectedCarBranch] = useState('');

    const [logoCarBranch, setLogoCarBranch] = useState(null);

    const [idCarName, setIdCarName] = useState('');
    const [carName, setCarName] = useState('');

    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [message, setMessage] = useState('');

    const openNotification = (message, duration = 2000) => {
        setNotificationOpen(true);
        setMessage(message);
        setTimeout(() => {
            setNotificationOpen(false);
            setMessage('');
        }, duration)
    }

    const closeNotification = () => {
        setNotificationOpen(false);
        setMessage('');
    }

    const closeModal = () => {
        setModalOpen(false);
        setModalState('');
        setCarName('');
        setIdCarName('');
        setError('');
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:8080/dongxe')
            setData(response.data.data);

            const imagePromises = response.data.data.map(item =>
                axios.get(`http://localhost:8080/image/a/${item.idhangxe}/hangxe`)
                    .then(res => ({
                        idhangxe: item.idhangxe,
                        img: `data:image/jpeg;base64,${res.data.data.src}`
                    }))
                    .catch(() => ({
                        idhangxe: item.idhangxe,
                        img: null
                    }))
            );

            const images = await Promise.all(imagePromises);
            setDataImages(images);
        }
        fetchData();
    }, [reload]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/hangxe');
                const hangXeList = response.data.data;
                setListHangXe(hangXeList);

                // Kiểm tra nếu danh sách không rỗng, gán giá trị đầu tiên vào `selectedCarBranch`
                if (hangXeList.length > 0) {
                    const firstCarBranch = hangXeList[0].idhangxe;
                    setSelectedCarBranch(firstCarBranch);

                    // Gọi hàm để lấy logo của hãng xe đầu tiên
                    getLogoCarBranch(firstCarBranch);
                }
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);


    const handleClickAdd = async () => {
        setModalOpen(true);
        setModalState('add');
    }

    const handleClickUpdate = (idhangxe, iddongxe, tendongxe) => {
        setModalOpen(true);
        setModalState('update');
        setSelectedCarBranch(idhangxe);
        getLogoCarBranch(idhangxe);
        setCarName(tendongxe);
        setIdCarName(iddongxe);
    }

    const handleClickDelete = (idhangxe, iddongxe, tendongxe) => {
        setModalOpen(true);
        setModalState('delete');
        setSelectedCarBranch(idhangxe);
        getLogoCarBranch(idhangxe);
        setCarName(tendongxe);
        setIdCarName(iddongxe);
    }

    const handleClickSubmitAdd = async () => {
        if (selectedCarBranch === '') {
            setError('Hãng xe không được để trống!!');
            return;
        }
        if (carName.trim() === '') {
            setError('Tên dòng xe không được để trống!!');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/dongxe', {
                tendongxe: carName,
                idhangxe: selectedCarBranch
            });
            closeModal();
            openNotification('Thêm dòng xe thành công!!');
            setReload(prev => !prev);
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const handleClickSubmitUpdate = async () => {
        if (selectedCarBranch === '') {
            setError('Hãng xe không được để trống!!');
            return;
        }
        if (carName.trim() === '') {
            setError('Tên dòng xe không được để trống!!');
            return;
        }
        console.log(idCarName);
        try {
            const response = await axios.put('http://localhost:8080/dongxe', {
                iddongxe: idCarName,
                tendongxe: carName,
                idhangxe: selectedCarBranch
            });
            closeModal();
            openNotification('Sửa dòng xe thành công!!');
            setReload(prev => !prev);
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const handleClickSubmitDelete = async () => {

        if (idCarName === '') {
            setError('Id dòng xe không được để trống!!');
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:8080/dongxe/${idCarName}`);
            closeModal();
            openNotification('Xóa thành công!!');
            setReload(prev => !prev);
        } catch (error) {
            setError(error.response.data.message);
            return;
        }
    }

    const getLogoCarBranch = async (idCarBranch) => {
        try {
            const res = await axios.get(`http://localhost:8080/image/a/${idCarBranch}/hangxe`);
            const imageSrc = `data:image/jpeg;base64,${res.data.data.src}`
            setLogoCarBranch(imageSrc);
        } catch (error) {
        }
    }

    const handleSelectChange = (e) => {
        setSelectedCarBranch(e.target.value);
        getLogoCarBranch(e.target.value);
    }

    const handleChangeCarName = (e) => {
        setCarName(e.target.value);
    }
    return (<>
        <div className="flex h-screen">
            <SideBar />
            <div className="flex flex-col space-y-3 p-4 w-full">
                <h1 className="text-center font-bold text-2xl">Danh sách dòng xe</h1>
                <div><button onClick={handleClickAdd} className="font-semibold bg-blue-300 p-3 rounded hover:bg-blue-400">Thêm dòng xe</button></div>
                <div className="flex-grow max-h-[calc(100vh-150px)] overflow-y-auto">
                    <table className="w-full overflow-hidden rounded-lg shadow-2xl border border-gray-300 border-collapse text-sm">
                        <thead className=" bg-gray-200 border border-gray-300">
                            <tr>
                                <th className="p-3 text-left border-b border-gray-300">ID</th>
                                <th className="p-3 text-left border-b border-gray-300">Tên hãng xe</th>
                                <th className="p-3 text-left border-b border-gray-300">Tên dòng xe</th>
                                <th className="p-3 text-left border-b border-gray-300">Logo</th>
                                <th className="p-3 text-left border-b border-gray-300">Sửa</th>
                                <th className="p-3 text-left border-b border-gray-300">Xóa</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {data.map((item, index) => (
                                <tr key={item.iddongxe} className='hover:bg-gray-100 transition-colors'>
                                    <td className="p-2 border-b border-gray-300">{item.iddongxe}</td>
                                    <td className="p-2 border-b border-gray-300">{item.tenhangxe}</td>
                                    <td className="p-2 border-b border-gray-300">{item.tendongxe}</td>
                                    <td className="p-2 border-b border-gray-300">
                                        {/* Hiển thị hình ảnh tương ứng từ mảng dataImages */}
                                        {dataImages[index] && dataImages[index].img != null ? (
                                            <img
                                                src={dataImages[index].img}
                                                alt={`Logo of ${item.tenhangxe}`}
                                                className="h-14 w-14 "
                                                loading="lazy"
                                            />
                                        ) : (
                                            <p>Không có hình ảnh</p>
                                        )}
                                    </td>
                                    <td className="p-2 border-b border-gray-300">
                                        <button onClick={() => handleClickUpdate(item.idhangxe, item.iddongxe, item.tendongxe)} className="px-4 py-2 bg-yellow-300 rounded hover:bg-yellow-400 transition-colors">Sửa</button>
                                    </td>
                                    <td className="p-2 border-b border-gray-300">
                                        <button onClick={() => handleClickDelete(item.idhangxe, item.iddongxe, item.tendongxe)} className="px-4 py-2 bg-red-300 rounded hover:bg-red-400 transition-colors">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
            className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full overflow-auto transform transition-all duration-300 ease-in-out"
        >
            {modalState === 'add' && (
                <div className="flex flex-col space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Thêm dòng xe</h1>
                    <div className="flex space-x-5">
                        <div className="w-1/2 space-y-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Hãng xe:</label>
                            <select
                                id="carBranchSelected"
                                value={selectedCarBranch}
                                onChange={handleSelectChange}
                                className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                {listHangXe.map((item) => (
                                    <option key={item.idhangxe} value={item.idhangxe}>
                                        {item.tenhangxe}
                                    </option>
                                ))}
                            </select>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Dòng xe:</label>
                            <input
                                onChange={handleChangeCarName}
                                className="w-full mt-3 p-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Tên dòng xe"
                            />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Logo hãng xe</p>
                            {logoCarBranch && typeof logoCarBranch === 'object' && (
                                <img
                                    className="w-40 h-40 object-contain border border-gray-200 rounded-md"
                                    src={URL.createObjectURL(logoCarBranch)}
                                    alt="No image chosen"
                                />
                            )}
                            {logoCarBranch && typeof logoCarBranch === 'string' && (
                                <img
                                    className="w-40 h-40 object-contain border border-gray-200 rounded-md"
                                    src={logoCarBranch}
                                    alt="Logo hãng xe"
                                />
                            )}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleClickSubmitAdd}
                        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                        Thêm
                    </button>
                </div>
            )}
            {modalState === 'update' && (
                <div className="flex flex-col space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Sửa dòng xe</h1>
                    <div className="flex space-x-5">
                        <div className="w-1/2 space-y-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Id dòng xe: {idCarName}</label>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Hãng xe:</label>
                            <select
                                id="carBranchSelected"
                                value={selectedCarBranch}
                                onChange={handleSelectChange}
                                className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                {listHangXe.map((item) => (
                                    <option key={item.idhangxe} value={item.idhangxe}>
                                        {item.tenhangxe}
                                    </option>
                                ))}
                            </select>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Dòng xe:</label>
                            <input
                                onChange={handleChangeCarName}
                                value={carName}
                                className="w-full mt-3 p-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Tên dòng xe"
                            />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Logo hãng xe</p>
                            {logoCarBranch && typeof logoCarBranch === 'object' && (
                                <img
                                    className="w-40 h-40 object-contain border border-gray-200 rounded-md"
                                    src={URL.createObjectURL(logoCarBranch)}
                                    alt="No image chosen"
                                />
                            )}
                            {logoCarBranch && typeof logoCarBranch === 'string' && (
                                <img
                                    className="w-40 h-40 object-contain border border-gray-200 rounded-md"
                                    src={logoCarBranch}
                                    alt="Logo hãng xe"
                                />
                            )}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleClickSubmitUpdate}
                        className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                        Sửa
                    </button>
                </div>
            )}
            {modalState === 'delete' && (
                <div className="flex flex-col space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Xóa dòng xe</h1>
                    <div className="flex space-x-5">
                        <div className="w-1/2 space-y-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Id dòng xe: {idCarName}</label>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Hãng xe:</label>
                            <select
                                id="carBranchSelected"
                                value={selectedCarBranch}
                                onChange={handleSelectChange}
                                className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                disabled
                            >
                                {listHangXe.map((item) => (
                                    <option key={item.idhangxe} value={item.idhangxe}>
                                        {item.tenhangxe}
                                    </option>
                                ))}
                            </select>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Dòng xe:</label>
                            <input
                                value={carName}
                                className="w-full mt-3 p-2 border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Tên dòng xe"
                                disabled
                            />
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Logo hãng xe</p>
                            {logoCarBranch && typeof logoCarBranch === 'object' && (
                                <img
                                    className="w-40 h-40 object-contain border border-gray-200 rounded-md"
                                    src={URL.createObjectURL(logoCarBranch)}
                                    alt="No image chosen"
                                />
                            )}
                            {logoCarBranch && typeof logoCarBranch === 'string' && (
                                <img
                                    className="w-40 h-40 object-contain border border-gray-200 rounded-md"
                                    src={logoCarBranch}
                                    alt="Logo hãng xe"
                                />
                            )}
                        </div>
                    </div>
                    <p className="text-red-500">Bạn muốn xóa dòng xe này ??</p>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleClickSubmitDelete}
                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                        Xóa
                    </button>
                </div>
            )}
        </ReactModal>
        <Notification isOpen={isNotificationOpen} closeModal={closeNotification} message={message} />
    </>
    )
}

export default DongXe