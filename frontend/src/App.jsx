import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Room from './pages/Room';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import useAuth from './hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
            <span className="text-gray-400 text-sm">Loading...</span>
        </div>
    )

    return user ? children : <Navigate to="/login" />
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/room/:roomCode" element={<PrivateRoute><Room /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}