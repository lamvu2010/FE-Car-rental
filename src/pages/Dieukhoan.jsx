import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import ReactModal from "react-modal";
import NotificationError from "../components/NotificationError"
import Notification from "../components/Notification";
import { useNavigate } from "react-router-dom";

ReactModal.setAppElement("#root");

function Dieukhoan() {
    const [isOpen, openModal] = useState(false);
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const [idTerm, setIdTerm] = useState('');
    const [term, setTerm] = useState('');
    const [termDetail, setTermDetail] = useState('');
    const [termVersion, setTermVersion] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [modalState, setModalState] = useState('');
    const [hasDetailTerms, setHasDetailTerms] = useState({});

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            // Fetch main data
            const response = await axios.get('http://localhost:8080/dieukhoan');
            const fetchedData = response.data.data || [];

            // Fetch detail for all items in one go (if available)
            const detailResponse = await axios.get('http://localhost:8080/dieukhoan/hasDetail');
            let details = {};

            if (detailResponse.data.success === true) {
                details = detailResponse.data.data;
                console.log(details);
            }

            // Once both main data and detail are fetched, set the state
            setData(fetchedData);
            setHasDetailTerms(details);
        } catch (error) {
            console.error(error); // Handle errors
        }
    };


    useEffect(() => {
        fetchData();
    }, [reload]);

    const handleClickAdd = () => {
        openModal(true);
        setModalState('add');
        setTerm('');
    };

    const handleClickDelete = (item) => {
        openModal(true);
        setModalState('delete');
        setTerm(item.tieude);
        setIdTerm(item.iddieukhoan);
    }

    const handleSubmitTerm = async () => {

        if (term.trim() == '') {
            setError('Tiêu đề danh mục không được để trống.');
            return;
        }
        try {
            const request = {
                tieude: term,
                ngaytao: new Date()
            }
            const response = await axios.post('http://localhost:8080/dieukhoan', request);
            if (response.data.success === true) {
                closeModal();
                setMessage('Thêm danh mục thành công.');
                setSuccess(true);
                setReload(prev => !prev);
            }
        }
        catch (error) {
            setError(error.response.data.message);
        }
    }

    const handleSubmitDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/dieukhoan/${idTerm}`);
            if (res.data.success === true) {
                closeModal();
                setSuccess(true);
                setMessage('Xoá thành công.');
                setReload(prev => !prev);
            }
        } catch (error) {
            setError("Xoá thất bại " + error.response.data.message);
        }
    }

    const handleClickUpdate = async (item) => {
        try {
            const detailsResponse = await axios.get(`http://localhost:8080/dieukhoan/getDetail/${item.iddieukhoan}`);
            if (detailsResponse.data.success === true) {
                const response = detailsResponse.data.data;
                setTermDetail(response.noidung);
                setTermVersion(response.phienban);
                console.log(response.noidung);
            }
        } catch (error) {
        }
        setModalState('updateInformation');
        openModal(true);
        setIdTerm(item.iddieukhoan);
        setTerm(item.tieude);
    }

    const handleClickAddInformation = (item) => {
        openModal(true);
        setModalState('addInformation');
        setIdTerm(item.iddieukhoan);
        setTerm(item.tieude);
    }

    const handleSubmitAddTermDetail = async () => {
        if (termDetail.trim() === '') {
            setError('Nội dung điều khoản không được để trống.')
            return
        }
        if (termVersion.trim() === '') {
            setError('Version điều khoản không được để trống.')
            return
        }
        const request = {
            iddieukhoan: idTerm,
            noidung: termDetail,
            phienban: termVersion,
            ngaycapnhat: new Date()
        }
        console.log(request);
        try {
            const response = await axios.post('http://localhost:8080/phienbandieukhoan', request);
            if (response.data.success === true) {
                closeModal();
                setMessage('Thêm nội dung thành công.');
                setSuccess(true);
                setReload(prev => !prev);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    const closeModal = () => {
        openModal(false);
        setTerm('');
        setError('');
        setIdTerm('');
        setTermDetail('');
        setTermVersion('')
    };

    const closeSuccess = () => {
        setSuccess(false);
        setMessage('');
    }

    const handleClickInformation = (item) => {
        navigate(`/term-details/${item.iddieukhoan}`);
    }

    const handleClickHistory = (item) => {
        navigate(`/term-versions/${item.iddieukhoan}`);
    }

    return (
        <>
            <div className="flex h-screen">
                <SideBar />
                <div className="flex flex-col space-y-3 p-4 w-full">
                    <h1 className="text-center font-bold text-2xl">Danh mục điều khoản</h1>
                    <div><button onClick={handleClickAdd} className="font-semibold bg-blue-300 p-3 rounded hover:bg-blue-400">Thêm danh mục</button></div>
                    <div className="flex-grow max-h-[calc(100vh-150px)] overflow-y-auto">
                        <table className="w-full overflow-hidden rounded-lg shadow-2xl border border-gray-300 border-collapse text-sm">
                            <thead className="bg-gray-200 border border-gray-300">
                                <tr>
                                    <th className="p-3 text-left border-b border-gray-300">ID Điều khoản</th>
                                    <th className="p-3 text-left border-b border-gray-300">Tiêu đề</th>
                                    <th className="p-3 text-left border-b border-gray-300">Ngày tạo</th>
                                    <th className="p-3 text-left border-b border-gray-300">Chi tiết</th>
                                    <th className="p-3 text-left border-b border-gray-300">Lịch sử</th>
                                    <th className="p-3 text-left border-b border-gray-300">Cập nhật</th>
                                    <th className="p-3 text-left border-b border-gray-300">Xoá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(item => (
                                    <tr key={item.iddieukhoan}>
                                        <td className="p-3 border-b border-gray-300">{item.iddieukhoan}</td>
                                        <td className="p-3 border-b border-gray-300">{item.tieude}</td>
                                        <td className="p-3 border-b border-gray-300" >{item.ngaytao}</td>
                                        {hasDetailTerms.find(detail => detail[item.iddieukhoan] === true) ? (
                                            <td onClick={() => handleClickInformation(item)} className="p-2 border-b border-gray-300">
                                                <button className="px-4 py-2 bg-green-300 rounded hover:bg-green-400 transition-colors">Xem Chi tiết</button>
                                            </td>
                                        ) : (
                                            <td onClick={() => handleClickAddInformation(item)} className="p-2 border-b border-gray-300">
                                                <button className="px-4 py-2 bg-green-300 rounded hover:bg-green-400 transition-colors">Thêm Chi tiết</button>
                                            </td>
                                        )}
                                        <td className="p-2 border-b border-gray-300"><button onClick={() => handleClickHistory(item)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors">Lịch sử</button></td>
                                        <td className="p-2 border-b border-gray-300"><button onClick={() => handleClickUpdate(item)} className=" px-4 py-2 bg-yellow-300 rounded hover:bg-yellow-400 transition-colors"> Cập nhật</button></td>
                                        <td className="p-2 border-b border-gray-300"><button onClick={() => handleClickDelete(item)} className=" px-4 py-2 bg-red-300 rounded hover:bg-red-400 transition-colors"> Xóa</button></td>
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
                overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                className="w-full bg-white overflow-aut max-w-sm rounded-lg p-10">
                {modalState === 'add' && <div className="flex flex-col space-y-5 ">
                    <h1 className=" text-xl font-semibold text-center">Thêm danh mục điều khoản</h1>
                    <input value={term} onChange={(e) => setTerm(e.target.value)} type='text' placeholder="Nhập danh mục điều khoản mới" className="border border-gray-300 p-2 rounded"></input>
                    {error && <p className="text-red-500">{error}</p>}
                    <button onClick={handleSubmitTerm}
                        className="p-3 bg-blue-300  rounded font-semibold hover:bg-blue-400 ">Thêm</button>
                </div>}
                {modalState === 'delete' && <div className="flex flex-col space-y-5 ">
                    <h1 className=" text-xl font-semibold text-center">Xoá danh mục điều khoản</h1>
                    <p>Id điều khoản: {idTerm}</p>
                    <p>Tiêu đề: {term}</p>
                    <p className="text-red-400">Bạn muốn xoá điều khoản trên?</p>
                    {error && <p className="text-red-500">{error}</p>}
                    <button onClick={handleSubmitDelete}
                        className="px-4 py-2 bg-red-300  rounded-lg hover:bg-red-400 ">Xoá</button>
                </div>}
            </ReactModal>

            {modalState === 'addInformation' && <ReactModal isOpen={isOpen}
                onRequestClose={closeModal}
                overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                className=" w-[calc(90%)] bg-white overflow-auto rounded-lg p-5">
                <div className="flex flex-col space-y-5  bg-white rounded-lg mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">Thêm chi tiết điều khoản</h1>
                    <div className="flex flex-col space-y-2">
                        <p className=""><span className="font-semibold">Id điều khoản:</span> {idTerm}</p>
                        <p className=""><span className="font-semibold">Tiêu đề:</span> {term}</p>
                    </div>

                    <div className=" flex flex-col space-y-2">
                        <label htmlFor="termVersion" className="font-semibold">Phiên bản</label>
                        <input value={termVersion} onChange={(e) => setTermVersion(e.target.value)} className="w-1/4 border border-gray-300 p-2 rounded" placeholder="Nhập version" />
                        <label htmlFor="termDetail" className="font-semibold">Chi tiết</label>
                        <textarea
                            value={termDetail}
                            id="termDetail"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            rows={7}
                            placeholder="Nhập chi tiết điều khoản"
                            onChange={(e) => setTermDetail(e.target.value)}
                        ></textarea>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmitAddTermDetail}
                        className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                        Thêm chi tiết
                    </button>
                </div>
            </ReactModal>}
            {modalState === 'updateInformation' && <ReactModal isOpen={isOpen}
                onRequestClose={closeModal}
                overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
                className=" w-[calc(90%)] bg-white overflow-auto rounded-lg p-5">
                <div className="flex flex-col space-y-5  bg-white rounded-lg mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">Hiệu chỉnh chi tiết điều khoản</h1>
                    <div className="flex flex-col space-y-2">
                        <p className=""><span className="font-semibold">Id điều khoản:</span> {idTerm}</p>
                        <p className=""><span className="font-semibold">Tiêu đề:</span> {term}</p>
                    </div>

                    <div className=" flex flex-col space-y-2">
                        <label htmlFor="termVersion" className="font-semibold">Phiên bản</label>
                        <input value={termVersion} onChange={(e) => setTermVersion(e.target.value)} className="w-1/4 border border-gray-300 p-2 rounded" placeholder="Nhập version" />
                        <label htmlFor="termDetail" className="font-semibold">Chi tiết</label>
                        <textarea
                            value={termDetail}
                            id="termDetail"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            rows={7}
                            placeholder="Nhập chi tiết điều khoản"
                            onChange={(e) => setTermDetail(e.target.value)}
                        ></textarea>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmitAddTermDetail}
                        className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                        Hiệu chỉnh
                    </button>
                </div>
            </ReactModal>}
            <Notification isOpen={success} closeModal={closeSuccess} message={message} />
        </>
    );
}

export default Dieukhoan;