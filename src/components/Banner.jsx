import React from 'react'

const Banner = () => {
    return (
        <div
            className="w-[90%] h-[500px] m-auto p-16 rounded-3xl bg-cover bg-center mt-10"
            style={{
                backgroundImage: "url('/image/gt86-driving-along-road-1920x1080.webp')"
            }}
        >
            <div className="flex flex-col items-center justify-center h-full text-center text-white rounded-3xl p-10 space-y-5">
                <h1 className="text-5xl font-semibold">CAR-RENTAL</h1>
                <h2 className="text-3xl font-semibold">CÙNG BẠN ĐẾN MỌI HÀNH TRÌNH</h2>
            </div>
        </div>
    )
}

export default Banner