import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(express.static('/dist'))

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://colabsync.onrender.com',
        // origin: 'http://localhost:5000',
        methods: ['GET', 'POST']
    }
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId]
        };
    });
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join', (roomId, username) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);

        clients.forEach(({socketId}) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            })
        })   
    });

    socket.on('change', (roomId, newCode, sId) => {
        
        const clients = getAllConnectedClients(roomId);

        clients.forEach(({socketId}) => {
            if(socketId != sId){
                io.to(socketId).emit('updateEditor', newCode);
            }
        })
    })

    // socket.on('sync', (socketId, newCode) => {
    //     io.to(socketId).emit('updateEditor',  newCode);
    // });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })

        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log('Listening on 5000'));    