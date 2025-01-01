import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'

export default function Home() {
    
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const newRoom = () => {
        const id = uuidv4(); 
        setRoomId(id);
        toast.success('Room created successfully!');
    }

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('RoomId and Username Required');
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username: username,
                roomId: roomId
            }
        });
    }

    return (
        <div className="bg-bg w-screen h-screen px-8 flex justify-center items-center text-textL">
            
            <div className="bg-main w-full md:w-2/5 p-4 rounded-lg">
                <img src={logo} className='h-20 mb-4' alt="" />
                <p className="text-1xl">Paste Invitation Room ID</p>
                <input type="text" placeholder="ROOM ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full text-black my-2 text-sm p-2 rounded-md" /><br />
                <input type="text" placeholder="USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full text-black my-2 text-sm p-2 rounded-md" />
                <div className="flex justify-end my-2">
                    <button onClick={joinRoom} className="bg-textD text-black px-4 py-1 rounded-lg">JOIN</button>
                </div>
                <p className="w-full text-sm md:text-md text-center my-2">If You do not have an invite then create a <a href="#" onClick={newRoom} className="text-textD underline">new room</a></p>
            </div>
        </div>
    );
}
