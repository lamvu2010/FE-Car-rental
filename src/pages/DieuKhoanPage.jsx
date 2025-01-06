import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function DieuKhoanPage() {
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/dieukhoan/true');
                setTerms(response.data.data);
            } catch (error) {
                console.error('Error fetching terms:', error);
            }
        };

        fetchTerms();
    }, []);

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Điều khoản</h1>
                <div>
                    {terms.map((term, index) => (
                        <div key={index} className="mb-4">
                            <h2 className="text-xl font-semibold">{term.tieude}</h2>
                            <text>{term.noidung}</text>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default DieuKhoanPage;
