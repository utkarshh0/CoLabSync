import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
    if (!socket) {
        const options = {
            'force new connection': true,
            reconnectionAttempts: Infinity,
            timeout: 1000,
            transports: ['websocket'],
        };
        socket = io('http://localhost:5000', options);
    }
    return socket;
};
