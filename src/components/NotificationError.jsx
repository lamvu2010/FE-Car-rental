import React from 'react'
import ReactModal from 'react-modal'
import { FaExclamationCircle } from "react-icons/fa";

const NotificationError = ({ isOpen, closeModal, message }) => {
    return (
        <ReactModal isOpen={isOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center"
        >
            {/* Biểu tượng thành công */}
            <div className="flex justify-center mb-4">
                <FaExclamationCircle size={50} className="text-red-500" />
            </div>
            {/* Thông điệp */}
            <p className="text-lg font-semibold mb-4">{message}</p>
        </ReactModal>
    )
}

export default NotificationError