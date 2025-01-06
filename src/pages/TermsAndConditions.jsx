import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'

const TermsAndConditions = () => {
    useEffect(() => {
        document.title = "Điều khoản";
    }, []);
    const [termsData, setTermsData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/dieukhoan/ds/noidung');
            if (response.data.success) {
                setTermsData(response.data.data);
            }
        } catch (error) {
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <>
            <div className="terms-container max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Điều khoản hợp đồng</h1>
                {termsData && termsData.map(item => (
                    <div key={item.thutu} className="term-item mb-6 p-4 border-b border-gray-300 last:border-b-0">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{item.tieude}</h2>
                        <div
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.noidung.replace(/\n/g, '<br />') }}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default TermsAndConditions