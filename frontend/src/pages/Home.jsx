import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, getMyRooms } from '../services/api';

export default function Home() {
    const [roomName, setRoomName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [myRooms, setMyRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        getMyRooms().then((res) => setMyRooms(res.data)).catch(() => {});
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createRoom({ name: roomName });
            navigate(`/room/${res.data.roomCode}`);
        } catch (err) {
            alert('Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (joinCode.trim()) navigate(`/room/${joinCode.trim().toUpperCase()}`);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0d1117] p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">🔥 PairForge</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">👤 {username}</span>
                        <button onClick={handleLogout}
                                className="text-sm text-red-400 hover:text-red-300 border border-red-400 px-3 py-1 rounded-lg">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Create Room</h2>
                        <form onSubmit={handleCreate} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Room name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                                required
                            />
                            <button type="submit" disabled={loading}
                                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-lg font-medium transition">
                                {loading ? 'Creating...' : '+ Create Room'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Join Room</h2>
                        <form onSubmit={handleJoin} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Enter room code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                                required
                            />
                            <button type="submit"
                                    className="w-full bg-[#1f6feb] hover:bg-[#388bfd] text-white py-2 rounded-lg font-medium transition">
                                → Join Room
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">My Rooms</h2>
                    {myRooms.length === 0 ? (
                        <p className="text-gray-500 text-sm">No rooms yet. Create one above!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {myRooms.map((room) => (
                                <div key={room.id}
                                     onClick={() => navigate(`/room/${room.roomCode}`)}
                                     className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-[#238636] transition">
                                    <div className="font-medium text-white">{room.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Code: {room.roomCode} · {room.language}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}