import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
    if (!socket) {
        const options = {
            'force new connection': true,
            reconnectionAttempts: Infinity,
            timeout: 10000,
            transports: ['websocket'],
        };
        socket = io('https://colabsync.onrender.com', options);
        // socket = io('http://localhost:5000', options);
    }
    return socket;
};
