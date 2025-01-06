import React from 'react'
import { usePayOS, PayOSConfig } from "payos-checkout";

const Payment = () => {


    return (
        <div>
            <h1>Thanh toán</h1>
            <button onClick={open}>Mở thanh toán</button>
            <button onClick={exit}>Thoát thanh toán</button>

        </div>
    )
}

export default Payment