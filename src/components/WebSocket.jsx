import React, { useContext, useEffect } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { UserContext } from '../ContextApi/UserContext'
import { MessageContext } from '../ContextApi/MessageContext'

const WebSocket = () => {
    const { user } = useContext(UserContext);

    const { message, setMessage } = useContext(MessageContext);
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('WebSocket connected');
                if (user && user.quyen === 'khachhang') {
                    stompClient.subscribe(`/topic/${user.khachhang.sodienthoai}`, (message) => {
                        console.log('Received message:', message.body);
                        try {
                            const parsedMessage = JSON.parse(message.body); // Nếu dữ liệu trả về là JSON
                            console.log('Parsed message:', parsedMessage);
                            setMessage(parsedMessage);
                        } catch (error) {
                            console.log('Error parsing message:', error);
                        }
                    });
                    console.log('subcribe khachhang');
                }
                if (user && user.quyen === 'nhanvien') {
                    stompClient.subscribe(`/topic/manager`, (message) => {
                        console.log('Received message:', message.body);
                        try {
                            const parsedMessage = JSON.parse(message.body); // Nếu dữ liệu trả về là JSON
                            console.log('Parsed message:', parsedMessage);
                            setMessage(parsedMessage);
                        } catch (error) {
                            console.log('Error parsing message:', error);
                        }
                    });
                    console.log('subcribe nhanvien');
                }
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
            },
        });
        stompClient.activate();
        return () => {
            stompClient.deactivate();
        };
    }, [])
    return null;
}

export default WebSocket