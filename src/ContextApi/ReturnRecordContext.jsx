import React, { useContext, useState } from "react";
import { createContext } from "react";

const ReturnRecordContext = createContext();

const ReturnRecordProvider = ({ children }) => {

    const [returnRecord, setReturnRecord] = useState(null);
    const [danhmuc, setDanhmuc] = useState(null);
    const [thongtinthanhtoan, setThongtinthanhtoan] = useState(null);
    const [contact, setContact] = useState(null);
    const [deliveryRecord, setDeliveryRecord] = useState(null);

    return <ReturnRecordContext.Provider value={{ returnRecord, danhmuc, thongtinthanhtoan, contact, deliveryRecord, setReturnRecord, setDanhmuc, setThongtinthanhtoan, setContact, setDeliveryRecord }}  >
        {children}
    </ReturnRecordContext.Provider>
}

export { ReturnRecordContext, ReturnRecordProvider }