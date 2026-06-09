import { useState } from 'react';

export default function PasswordModal({ roomCode, onSuccess, onCancel }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSuccess(password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-80">
                <h2 className="text-white font-semibold mb-1">🔒 Private Room</h2>
                <p className="text-gray-400 text-sm mb-4">
                    This room is password protected
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="password"
                        placeholder="Enter room password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                        autoFocus
                        required
                    />
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <div className="flex gap-2">
                        <button type="submit"
                                className="flex-1 bg-[#238636] text-white py-2 rounded-lg text-sm">
                            Enter Room
                        </button>
                        <button type="button" onClick={onCancel}
                                className="flex-1 border border-[#30363d] text-gray-400 py-2 rounded-lg text-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}