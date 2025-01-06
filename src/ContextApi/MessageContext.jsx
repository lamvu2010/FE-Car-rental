import React, { useState } from 'react'
import { createContext } from 'react'

const MessageContext = createContext();

const MessageProvider = ({ children }) => {

    const [message, setMessage] = useState();

    return (
        <MessageContext.Provider value={{ message, setMessage }}>
            {children}
        </MessageContext.Provider>
    )
}

export { MessageContext, MessageProvider };