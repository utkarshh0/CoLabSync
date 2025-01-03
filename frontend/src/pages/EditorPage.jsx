import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import User from '../Components/User';
import Editor from '../Components/Editor';
import { initSocket } from '../../../backend/socket';
import { CODE_SNIPPETS } from '../Components/constants';
import logo from '../assets/logo.png'
import Loader from '../Components/Loader';

export default function EditorPage() {
    const [value, setValue] = useState(CODE_SNIPPETS.javascript);
    const [user, setUser] = useState([]);
    const [socketInitialized, setSocketInitialized] = useState(true);
    const reactNavigate = useNavigate();
    const socketRef = useRef(null);
    const codeRef = useRef('');
    const location = useLocation();
    const roomId = location.state.roomId;

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            function handleErrors(err) {
                console.log(err);
                toast.error('Socket connection failed! Try again later.');
                reactNavigate('/');
            }
            socketRef.current.emit('join', roomId, location.state?.username);

            socketRef.current.on('joined', ({clients, username}) => {

                console.log('joined')
                setSocketInitialized(false)
                if(username != location.state.username){
                    toast.success(`${username} joined the room`);
                }
                setUser(clients)

                socketRef.current.emit('sync', value, socketId);
            });

            socketRef.current.on('updateEditor', (newCode) => {
                setValue(newCode);
            })

            socketRef.current.on('disconnected', ({socketId, username}) => {
                toast.success(`${username} left the room`);
                setUser((prev) => prev.filter(client => client.socketId !== socketId));
            })
        };

        init()

        return () => {
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
            socketRef.current.disconnect();
        }
    }, []);

    async function copyRoom(){
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success("Copied");
        }
        catch(err){
            toast.error("Could not copy Room Id");
            console.log(err);
        }
    }

    if(socketInitialized) return <div className="w-screen h-screen flex justify-center items-center bg-zinc-800"><Loader /></div>
    
    return (
        <div className="w-screen h-screen overflow-hidden flex">
            <div className="w-1/4 lg:w-1/5 h-full bg-bg p-3 flex flex-col justify-between">
                <div>
                    <img src={logo} className='my-3' alt="" />
                    <h1 className="text-textL font-bold py-4">Connected</h1>
                    <div className='flex flex-col justify-between'>
                        <div className="flex gap-5 flex-wrap">
                            {user.map(user => (
                                <User key={user.socketId} username={user.username} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className='md:m-2 flex flex-col justify-center items-center'>
                    <button onClick={copyRoom} className='w-full md:w-3/4 h-8 my-1 p-1 bg-textL rounded-lg'>Copy Room Id</button>
                    <button onClick={() => reactNavigate('/')} className='w-full md:w-3/4 p-1 h-8 my-1 bg-textD rounded-lg'>Leave</button>
                </div>
            </div>
            <div className="w-3/4 h-screen lg:w-4/5 bg-main">
                 <Editor 
                    socketRef={socketRef} 
                    roomId={roomId} 
                    value={value} 
                    setValue={setValue}
                    onCodeChange={(code) => codeRef.current = code}
                />
            </div>
        </div>
    );
}
