import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const FindCar = () => {
    const now = new Date();
    const currentHour = now.getHours();

    // Thiết lập thời gian nhận xe
    const [startTime, setStartTime] = useState('');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [minDate, setMinDate] = useState(new Date());
    const [endTime, setEndTime] = useState('');

    const generateTimeOptions = (start, end) => {
        const times = [];
        for (let hour = start; hour < end; hour++) {
            const hourString = String(hour).padStart(2, '0');
            times.push(`${hourString}:00`);
        }
        return times;
    };
    const [timeOptionsStart, setTimeOptionsStart] = useState([]);
    const [timeOptionsEnd, setTimeOptionsEnd] = useState([]);

    useEffect(() => {
        const today = new Date();
        const isToday = startDate.toDateString() === today.toDateString();

        const nextDay = new Date(startDate);
        nextDay.setDate(startDate.getDate() + 1);
        setEndDate(nextDay);

        if (isToday && currentHour < 12) {
            setTimeOptionsStart(generateTimeOptions(currentHour + 2, 17));
            setStartTime(`${currentHour + 2}:00`)
            setEndTime('7:00')
        }
        if (isToday && currentHour >= 12) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setMinDate(tomorrow);
            setStartDate(tomorrow);
            setTimeOptionsStart(generateTimeOptions(7, 17));
            setStartTime('7:00')
            setEndTime('7:00')
        }

        if (startDate > today) {
            setTimeOptionsStart(generateTimeOptions(7, 17));
            setStartTime('7:00')
            setEndTime('7:00')
        }
        setTimeOptionsEnd(generateTimeOptions(7, 17));
    }, [startDate]);

    // Cập nhật endDate mỗi khi startDate thay đổi

    // Định dạng ngày theo dd/MM/yyyy
    const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
    const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';

    return (
        <div className="w-full max-w-4xl grid grid-cols-3 gap-6 border rounded-xl p-8 bg-white shadow-lg m-auto mt-10">
            <div className="col-span-1 border rounded-lg p-4 flex flex-col space-y-2">
                <h1 className="text-lg font-semibold">Địa điểm</h1>
                <select className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Hồ Chí Minh</option>
                </select>
            </div>

            <div className="col-span-2 flex flex-col space-y-4">
                <h1 className="text-lg font-semibold">Thời gian</h1>
                <p className="text-gray-500">Chọn ngày và giờ bắt đầu, kết thúc thuê xe</p>
                <div className="flex justify-between space-x-4">
                    <div className="flex flex-col w-full bg-gray-50 rounded-lg p-4 shadow-md">
                        <label className="text-sm text-gray-600 font-medium">Ngày bắt đầu</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                            placeholderText="Chọn ngày bắt đầu"
                            minDate={minDate}
                        />
                        <div className="mt-2">
                            <label className="text-sm text-gray-600 font-medium">Nhận xe</label>
                            <select
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="border p-2 rounded-md w-full mt-1"
                            >
                                {timeOptionsStart.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col w-full bg-gray-50 rounded-lg p-4 shadow-md">
                        <label className="text-sm text-gray-600 font-medium">Ngày kết thúc</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                            placeholderText="Chọn ngày kết thúc"
                            minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                        />
                        <div className="mt-2">
                            <label className="text-sm text-gray-600 font-medium">Trả xe</label>
                            <select
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="border p-2 rounded-md w-full mt-1"
                            >
                                {timeOptionsEnd.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-3 flex justify-end mt-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 shadow-lg">
                    Tìm xe
                </button>
            </div>
        </div>
    );
};

export default FindCar;
