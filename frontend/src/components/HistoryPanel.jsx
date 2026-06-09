import { useState, useEffect } from 'react';
import { getSnapshots } from '../services/api';

export default function HistoryPanel({ roomCode, onRestore, onClose }) {
    const [snapshots, setSnapshots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSnapshots(roomCode)
            .then((res) => setSnapshots(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [roomCode]);

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-96 max-h-96 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-semibold">📜 Code History</h2>
                    <button onClick={onClose}
                            className="text-gray-400 hover:text-white">✕</button>
                </div>
                {loading ? (
                    <p className="text-gray-400 text-sm">Loading...</p>
                ) : snapshots.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                        No snapshots yet. Click 💾 Save to create one.
                    </p>
                ) : (
                    <div className="overflow-y-auto space-y-2">
                        {snapshots.map((snap) => (
                            <div key={snap.id}
                                 className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-white text-xs font-medium">
                                            {formatTime(snap.savedAt)}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            by {snap.savedBy} · {snap.language}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onRestore(snap)}
                                        className="bg-[#238636] text-white text-xs px-3 py-1 rounded hover:bg-[#2ea043]">
                                        Restore
                                    </button>
                                </div>
                                <pre className="text-gray-400 text-xs mt-2 truncate">
                                    {snap.content.substring(0, 80)}...
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}