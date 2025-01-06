import React, { useState, useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
import axios from 'axios';
import ReactModal from "react-modal";
import { set } from "date-fns";
import Notification from "../components/Notification";

ReactModal.setAppElement("#root");

function HangXe() {
    const [data, setData] = useState([]);
    const [dataImages, setDataImages] = useState([]);
    const [error, setError] = useState(null);
    const [idCarBranch, setIdCarBranch] = useState('');
    const [carBranch, setCarBranch] = useState('');
    const [image, setImage] = useState(null);
    const inputRef = useRef(null);
    const [isOpen, setModalOpen] = useState(false);
    const [modalState, setModalState] = useState('');
    const [reload, setReload] = useState(false);
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

    const handleChangeImage = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setError('');
        } else {
            setError('Vui lòng chọn một tệp hình ảnh hợp lệ (jpg, png, v.v.)');
            setImage(null);
        }
    }

    const handleChangeCarBranch = (e) => {
        setCarBranch(e.target.value);
    }

    const getLogoCarBranch = async (idCarBranch) => {
        try {
            console.log(idCarBranch);
            const res = await axios.get(`http://localhost:8080/image/a/${idCarBranch}/hangxe`);
            const imageSrc = `data:image/jpeg;base64,${res.data.data.src}`
            setImage(imageSrc);
        } catch (error) {
        }
    }

    const closeModal = () => {
        setModalOpen(false);
        setImage(null);
        setError('');
        setCarBranch('');
        setIdCarBranch('');
    }

    const handleClickAdd = () => {
        setModalOpen(true);
        setModalState('add');
    }
    const handleClickSubmitAdd = async () => {
        if (carBranch.trim() === '') {
            setError('Tên hãng xe không được để trống!!')
            return;
        }
        if (image === null) {
            setError('Logo của hãng xe không được để trống!!')
            return;
        }
        try {
            const res = await axios.post('http://localhost:8080/hangxe', {
                tenhangxe: carBranch
            });
            if (res.data.success === false || res.status === 404) {
                setError('Lưu hãng xe thất bại');
                return;
            }
            const formData = new FormData();
            formData.append('images', image);
            formData.append('id', res.data.data.idhangxe);
            formData.append('loai', 'hangxe');
            const res2 = await axios.post('http://localhost:8080/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res2.data.success === false) {
                setError('Thêm hình ảnh thất bại');
                return;
            }
            closeModal();
            openNotification('Thêm hãng xe thành công');
            setReload(prev => !prev);
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const handleClickUpdate = (id, name) => {
        setIdCarBranch(id);
        getLogoCarBranch(id);
        setModalOpen(true);
        setModalState('update');
        setCarBranch(name);
    }
    const handleClickSubmitUpdate = async () => {
        if (carBranch.trim() === '') {
            setError('Tên hãng xe không được để trống');
            return;
        }
        if (image === null) {
            setError('Logo hãng xe không được để trống');
            return;
        }
        try {
            const request = {
                idhangxe: idCarBranch,
                tenhangxe: carBranch
            }
            const res = await axios.put('http://localhost:8080/hangxe', request);
            if (typeof image === 'object') {
                const formData = new FormData();
                formData.append('images', image);
                formData.append('id', res.data.data.idhangxe);
                formData.append('loai', 'hangxe');

                const res2 = await axios.post('http://localhost:8080/image/carbranch', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            }
            closeModal();
            openNotification('Sửa thông tin thành công !!')
            setReload(prev => !prev);
        } catch (error) {
            setError(error.response.data.message);
            return;
        }
    }
    const handleClickDelete = (id, name) => {
        setModalOpen(true);
        setModalState('delete');
        setIdCarBranch(id);
        getLogoCarBranch(id);
        setModalOpen(true);
        setCarBranch(name);
    }
    const handleClickSubmitDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/hangxe/${idCarBranch}`)
            if (res.data.success === true) {
                closeModal();
                openNotification('Xóa thành công!');
                setReload(prev => !prev);
            }
        } catch (error) {
            console.log(error.response.data.message);
            setError(error.response.data.message);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/hangxe');
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
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        fetchData();
    }, [reload]);

    return (<>
        <div className="flex h-screen">
            <SideBar />
            <div className="flex flex-col space-y-3 p-4 w-full">
                <h1 className="text-center font-bold text-2xl ">Danh sách hãng xe</h1>
                <div>
                    <button onClick={handleClickAdd} className="font-semibold bg-blue-300 p-3 rounded hover:bg-blue-400">Thêm hãng xe</button>
                </div>
                <div className="flex-grow max-h-[calc(100vh-150px)] overflow-y-auto">
                    <table className="w-full overflow-hidden rounded-lg shadow-2xl border border-gray-300 border-collapse text-sm">
                        <thead className="bg-gray-200 border border-gray-300">
                            <tr>
                                <th className="p-3 text-left border-b border-gray-300">ID</th>
                                <th className="p-3 text-left border-b border-gray-300">Name</th>
                                <th className="p-3 text-left border-b border-gray-300">Logo</th>
                                <th className="p-3 text-left border-b border-gray-300">Sửa</th>
                                <th className="p-3 text-left border-b border-gray-300">Xóa</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {data.map((item, index) => (
                                <tr key={item.idhangxe} className="hover:bg-gray-100 transition-colors">
                                    <td className="p-2 border-b border-gray-300">{item.idhangxe}</td>
                                    <td className="p-2 border-b border-gray-300">{item.tenhangxe}</td>
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
                                        <button onClick={() => handleClickUpdate(item.idhangxe, item.tenhangxe)} className="px-4 py-2 bg-yellow-300 rounded hover:bg-yellow-400 transition-colors">Sửa</button>
                                    </td>
                                    <td className="p-2 border-b border-gray-300">
                                        <button onClick={() => handleClickDelete(item.idhangxe, item.tenhangxe)} className="px-4 py-2 bg-red-300 rounded hover:bg-red-400 transition-colors">Xóa</button>
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
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            className="bg-white rounded-lg p-10 max-w-sm w-full overflow-auto"
        >
            {modalState === 'add' && <div className="flex flex-col space-y-5 ">
                <h1 className="text-2xl font-bold text-center">Thêm hãng xe</h1>
                <input onChange={handleChangeCarBranch} className="p-2 border rounded" placeholder="Tên hãng xe"></input>
                <p>Logo hãng xe</p>
                <input onChange={handleChangeImage} type="file" className="" placeholder="Hình ảnh"></input>
                {image && <img className="max-w-full max-h-40 object-contain" src={URL.createObjectURL(image)} alt="No image choosen" />}
                {error && <p className="text-red-500">{error}</p>}
                <button onClick={handleClickSubmitAdd} className="p-3 bg-blue-300 hover:bg-blue-400 rounded font-semibold">Thêm</button>
            </div>}
            {modalState === 'update' && <div className="flex flex-col space-y-5">
                <h1 className="text-center font-bold text-2xl">Sửa hãng xe</h1>
                <p>Id hãng xe: {idCarBranch} </p>
                <input value={carBranch} onChange={handleChangeCarBranch} className="p-2 border rounded" placeholder="Tên hãng xe"></input>
                <p>Logo hãng xe</p>
                <input onChange={handleChangeImage} type="file" className="" placeholder="Hình ảnh"></input>

                {image && typeof image === 'object' && (
                    <img className="max-w-full max-h-40 object-contain" src={URL.createObjectURL(image)} alt="No image chosen" />
                )}
                {image && typeof image === 'string' && (
                    <img className="max-w-full max-h-40 object-contain" src={image} alt="Logo hãng xe" />
                )}
                {error && <p className="text-red-500">{error}</p>}
                <button onClick={handleClickSubmitUpdate} className="p-3 bg-yellow-300 hover:bg-yellow-400 rounded font-semibold">Sửa</button>
            </div>}
            {modalState === 'delete' && <div className="flex flex-col space-y-5">
                <h1 className="text-center font-bold text-2xl">Xóa hãng xe</h1>
                <p>Id hãng xe: {idCarBranch} </p>
                <p>Tên hãng xe: {carBranch}</p>
                <p>Logo hãng xe</p>
                {image && typeof image === 'object' && (
                    <img className="max-w-full max-h-40 object-contain" src={URL.createObjectURL(image)} alt="No image chosen" />
                )}
                {image && typeof image === 'string' && (
                    <img className="max-w-full max-h-40 object-contain" src={image} alt="Logo hãng xe" />
                )}
                <p className="text-red-400">Bạn muốn xóa hãng xe trên ?</p>
                {error && <p className="text-red-500">{error}</p>}
                <button onClick={handleClickSubmitDelete} className="p-3 bg-red-300 hover:bg-red-400 rounded font-semibold">Xóa</button>
            </div>}
        </ReactModal>
        <Notification isOpen={isNotificationOpen} closeModal={closeNotification} message={message} />
    </>
    );
}

export default HangXe