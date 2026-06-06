import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import useWebSocket from '../hooks/useWebSocket';
import { getRoom, getChatHistory, executeCode } from '../services/api';

export default function Room() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [room, setRoom] = useState(null);
    const [code, setCode] = useState('// Start coding here...');
    const [language, setLanguage] = useState('javascript');
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const chatEndRef = useRef(null);
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const [showOutput, setShowOutput] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const saveTimerRef = useRef(null);

    const handleRemoteCodeChange = (newCode) => {
        setCode(newCode);
    };

    const { messages, connected, sendMessage, sendCodeChange, onlineUsers } =
        useWebSocket(roomCode, username, handleRemoteCodeChange);

    useEffect(() => {
        if (!username) { navigate('/'); return; }
        getRoom(roomCode)
            .then((res) => {
                setRoom(res.data);
                setCode(res.data.currentCode || '// Start coding here...');
                setLanguage(res.data.language || 'javascript');
            })
            .catch(() => navigate('/home'));

        getChatHistory(roomCode)
            .then((res) => setChatMessages(res.data))
            .catch(() => {});
    }, [roomCode]);

    useEffect(() => {
        if (messages.length > 0) {
            const latest = messages[messages.length - 1];
            setChatMessages((prev) => {
                const isDuplicate = prev.some(
                    (m) => m.sentAt === latest.sentAt &&
                        m.username === latest.username &&
                        m.content === latest.content
                );
                if (isDuplicate) return prev;
                return [...prev, latest];
            });
        }
    }, [messages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleCodeChange = (val) => {
        setCode(val);
        sendCodeChange(val);

        // Show saving indicator
        setSaveStatus('Saving...');
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            setSaveStatus('Saved ✓');
            setTimeout(() => setSaveStatus(''), 2000);
        }, 1500);
    };

    const getDefaultCode = (lang) => {
        switch(lang) {
            case 'python':     return '# Start coding here...\n';
            case 'java':       return '// Start coding here...\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}';
            case 'cpp':        return '// Start coding here...\n#include<iostream>\nusing namespace std;\nint main() {\n    \n    return 0;\n}';
            case 'typescript': return '// Start coding here...\n';
            case 'go':         return '// Start coding here...\npackage main\nimport "fmt"\nfunc main() {\n    \n}';
            default:           return '// Start coding here...\n';
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (chatInput.trim()) {
            sendMessage(chatInput.trim());
            setChatInput('');
        }
    };

    const handleRunCode = async () => {
        setRunning(true);
        setShowOutput(true);
        setOutput('Running...');
        try {
            const res = await executeCode({ code, language });
            const data = res.data;
            const out = data.stdout || data.stderr || 'No output';
            setOutput(`Status: ${data.status}\n\n${out}`);
        } catch (err) {
            setOutput('Error: Failed to execute code');
        } finally {
            setRunning(false);
        }
    };

    const copyRoomLink = () => {
        const link = `${window.location.origin}/room/${roomCode}`;
        navigator.clipboard.writeText(link);
        alert(`Room link copied! Share this: ${link}`);
    };

    const languages = ['javascript', 'python', 'java', 'cpp', 'typescript', 'go'];

    return (
        <div className="h-screen bg-[#0d1117] flex flex-col">
            {/* Header */}
            <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-white font-bold cursor-pointer"
                          onClick={() => navigate('/home')}>
                        🔥 PairForge
                    </span>
                    <span className="text-gray-400 text-sm">|</span>
                    <span className="text-white text-sm">{room?.name}</span>
                    <span className="bg-[#238636] text-white text-xs px-2 py-1 rounded font-mono">
                        {roomCode}
                    </span>
                    <button
                        onClick={copyRoomLink}
                        className="text-gray-400 hover:text-white text-xs border border-[#30363d] px-2 py-1 rounded">
                        🔗 Copy Link
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xs">
                        👥 {onlineUsers.length} online
                    </span>
                    <select
                        value={language}
                        onChange={(e) => {
                            setLanguage(e.target.value);
                            setCode(getDefaultCode(e.target.value));
                            sendCodeChange(getDefaultCode(e.target.value));
                        }}
                        className="bg-[#0d1117] border border-[#30363d] text-white text-sm rounded px-2 py-1">
                        {languages.map((l) => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleRunCode}
                        disabled={running}
                        className="bg-[#1f6feb] hover:bg-[#388bfd] disabled:opacity-50 text-white text-xs px-3 py-1 rounded font-medium">
                        {running ? '⏳ Running...' : '▶ Run'}
                    </button>
                    {saveStatus && (
                        <span className={`text-xs ${
                            saveStatus === 'Saved ✓'
                                ? 'text-green-400'
                                : 'text-yellow-400'
                        }`}>
        {saveStatus}
    </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${connected
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'}`}>
                        {connected ? '● Live' : '○ Offline'}
                    </span>
                    <span className="text-gray-400 text-sm">👤 {username}</span>
                </div>
            </div>

            {/* Main */}
            <div className="flex flex-1 overflow-hidden w-full">
                {/* Editor */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className={showOutput ? 'h-2/3' : 'h-full'}>
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                padding: { top: 16 },
                            }}
                        />
                    </div>
                    {showOutput && (
                        <div className="h-1/3 bg-[#0d1117] border-t border-[#30363d] flex flex-col">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
                                <span className="text-white text-xs font-medium">▶ Output</span>
                                <button onClick={() => setShowOutput(false)}
                                        className="text-gray-400 hover:text-white text-xs">
                                    ✕ Close
                                </button>
                            </div>
                            <pre className="flex-1 overflow-auto p-4 text-xs text-green-300 font-mono">
                                {output}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                <div style={{width: '280px', flexShrink: 0}}
                     className="bg-[#161b22] border-l border-[#30363d] flex flex-col">
                    <div className="px-4 py-3 border-b border-[#30363d]">
                        <h3 className="text-white font-medium text-sm">💬 Chat</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {onlineUsers.map((u, i) => (
                                <span key={i}
                                      className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">
                                    ● {u}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {chatMessages.length === 0 && (
                            <p className="text-gray-500 text-xs text-center mt-4">
                                No messages yet
                            </p>
                        )}
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`text-xs ${
                                msg.type === 'CHAT' ? '' : 'text-center text-gray-500 italic'
                            }`}>
                                {msg.type === 'CHAT' ? (
                                    <div>
                                        <span className="text-[#238636] font-medium">
                                            {msg.username}:{' '}
                                        </span>
                                        <span className="text-gray-300">{msg.content}</span>
                                    </div>
                                ) : (
                                    <span>{msg.content}</span>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage}
                          className="p-3 border-t border-[#30363d] flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 min-w-0 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                        />
                        <button type="submit"
                                className="bg-[#238636] text-white px-3 py-1 rounded text-xs hover:bg-[#2ea043] flex-shrink-0">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}