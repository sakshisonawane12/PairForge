import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../services/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = isLogin ? await login(form) : await register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', form.username);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2 text-white">
            🔥 PairForge
          </h1>
          <p className="text-center text-gray-400 mb-6 text-sm">
            Real-time collaborative code editor
          </p>

          <div className="flex mb-6 bg-[#0d1117] rounded-lg p-1">
            <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                    isLogin ? 'bg-[#238636] text-white' : 'text-gray-400'
                }`}>
              Login
            </button>
            <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                    !isLogin ? 'bg-[#238636] text-white' : 'text-gray-400'
                }`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                required
            />
            {!isLogin && (
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                    required
                />
            )}
            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-lg font-medium transition disabled:opacity-50">
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
  );
}