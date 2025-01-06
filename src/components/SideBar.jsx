import React, { useState } from "react"
import { BsCaretDown } from "react-icons/bs";
import { Link } from 'react-router-dom';

function SideBar() {

    const [isDropdownXe, setIsDropdownXe] = useState(false);

    const toggleDropdownXe = () => {
        setIsDropdownXe(!isDropdownXe);
    }
    return (
        <div className="w-[20%] p-2 h-full bg-gray-800 text-white flex-col hidden lg:flex">
            <h1 className="text-3xl font-serif text-center pt-4">Car-rental</h1>
            <ul className="pt-3 flex-grow px-4">
                <Link to={"/home"}><li className="p-4 hover:bg-gray-700 transition duration-300">Trang chủ</li></Link>
                <li
                    className="p-4 hover:bg-gray-700 transition duration-300 flex items-center justify-between cursor-pointer"
                    onClick={toggleDropdownXe}
                >
                    <span>Quản lý xe</span>
                    <BsCaretDown />
                </li>
                {isDropdownXe && (
                    <ul className="ml-4">
                        <Link to={"/hangxe"}><li className="p-2 hover:bg-gray-600 transition duration-300">Hãng xe</li></Link>
                        <Link to={"/dongxe"}><li className="p-2 hover:bg-gray-600 transition duration-300">Dòng xe</li></Link>
                        <Link to={"/xe"}><li className="p-2 hover:bg-gray-600 transition duration-300">Xe</li></Link>
                    </ul>
                )}
                <Link to={"/dieukhoan"}><li className="p-4 hover:bg-gray-700 transition duration-300">Điều khoản</li></Link>
            </ul>
            <div className="p-4">
                <Link to="/home"><button className="w-full py-2 bg-red-500 hover:bg-red-600 transition duration-300 rounded">Logout</button></Link>
            </div>
        </div >
    )
}

export default SideBar