import React from 'react'
import ReactModal from 'react-modal'
import { FaCheckCircle } from 'react-icons/fa'

const Notification = ({ isOpen, closeModal, message }) => {
    return (
        <ReactModal isOpen={isOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center"
        >

            {/* Biểu tượng thành công */}
            <div className="flex justify-center mb-4">
                <FaCheckCircle size={50} className="text-green-500" />
            </div>

            {/* Thông điệp */}
            <p className="text-lg font-semibold mb-4">{message}</p>
        </ReactModal>
    )
}

export default Notification