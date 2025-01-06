import { createContext, useState } from "react";

const SosanhContext = createContext();

const SosanhProvider = ({ children }) => {

    const [xe1, setXe1] = useState(null);

    const [xe2, setXe2] = useState(null);

    const [tenxe1, setTenxe1] = useState('');
    const [tenxe2, setTenxe2] = useState('');

    const [imageXe1, setImageXe1] = useState('');

    const [imageXe2, setImageXe2] = useState('');

    return (
        <SosanhContext.Provider value={{ xe1, xe2, setXe1, setXe2, setImageXe1, setImageXe2, tenxe1, tenxe2, setTenxe1, setTenxe2 }}>
            {children}
        </SosanhContext.Provider>
    )
}

export { SosanhContext, SosanhProvider };