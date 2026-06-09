import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      isLogin ? await login(form) : await register(form);
      navigate('/home');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      if (isLogin) {
        if (status === 401) setError('incorrect username or password.');
        else if (status === 404) setError('user not found. please register first.');
        else if (status === 400) setError('please fill in all fields.');
        else setError(message || 'login failed. please try again.');
      } else {
        if (status === 409) setError('username already taken. try a different one.');
        else if (status === 400) setError('please fill all fields correctly.');
        else setError(message || 'registration failed. please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0c10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: '#e6edf3',
        padding: '2rem',
      }}>
        {/* Subtle grid bg */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(#21262d 1px, transparent 1px), linear-gradient(90deg, #21262d 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.25,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.5px', color: '#fff' }}>
              PairCode
            </p>
            <p style={{ fontSize: '12px', color: '#484f58', margin: 0, letterSpacing: '0.5px' }}>
              real-time collaborative code editor
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#0d1117',
            border: '1px solid #21262d',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            {/* Tab switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderBottom: '1px solid #21262d',
            }}>
              {['login', 'register'].map((tab) => {
                const active = (tab === 'login') === isLogin;
                return (
                    <button
                        key={tab}
                        onClick={() => { setIsLogin(tab === 'login'); setError(''); }}
                        style={{
                          background: active ? '#161b22' : 'transparent',
                          border: 'none',
                          borderRight: tab === 'login' ? '1px solid #21262d' : 'none',
                          padding: '14px',
                          color: active ? '#e6edf3' : '#484f58',
                          fontSize: '12px',
                          fontFamily: 'inherit',
                          fontWeight: active ? 600 : 400,
                          cursor: 'pointer',
                          letterSpacing: '0.5px',
                          transition: 'all 0.15s',
                          borderBottom: active ? '2px solid #3fb950' : '2px solid transparent',
                        }}
                    >
                      {tab}
                    </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div>
                  <label style={labelStyle}>username</label>
                  <input
                      type="text"
                      placeholder="your_username"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#3fb950'}
                      onBlur={e => e.target.style.borderColor = '#21262d'}
                  />
                </div>

                {!isLogin && (
                    <div>
                      <label style={labelStyle}>email</label>
                      <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          required
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = '#3fb950'}
                          onBlur={e => e.target.style.borderColor = '#21262d'}
                      />
                    </div>
                )}

                <div>
                  <label style={labelStyle}>password</label>
                  <input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#3fb950'}
                      onBlur={e => e.target.style.borderColor = '#21262d'}
                  />
                </div>

                {error && (
                    <div style={{
                      background: 'rgba(248,81,73,0.08)',
                      border: '1px solid rgba(248,81,73,0.25)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#f85149',
                      letterSpacing: '0.2px',
                    }}>
                      ✗ {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                      marginTop: '6px',
                      padding: '11px',
                      background: loading ? '#161b22' : '#238636',
                      border: 'none',
                      borderRadius: '6px',
                      color: loading ? '#484f58' : '#fff',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.3px',
                      transition: 'all 0.15s',
                      width: '100%',
                    }}
                    onMouseOver={e => { if (!loading) e.target.style.background = '#2ea043'; }}
                    onMouseOut={e => { if (!loading) e.target.style.background = '#238636'; }}
                >
                  {loading ? 'please wait...' : isLogin ? '→ login' : '→ create account'}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div style={{
              borderTop: '1px solid #21262d',
              padding: '14px 1.75rem',
              textAlign: 'center',
            }}>
                        <span style={{ fontSize: '12px', color: '#484f58' }}>
                            {isLogin ? "don't have an account? " : 'already have an account? '}
                        </span>
              <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  style={{
                    background: 'none', border: 'none',
                    color: '#3fb950', fontSize: '12px',
                    fontFamily: 'inherit', cursor: 'pointer',
                    padding: 0, textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                  }}
              >
                {isLogin ? 'register' : 'login'}
              </button>
            </div>
          </div>

          {/* Bottom hint */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#30363d', marginTop: '1.5rem' }}>
            paircode · collaborative coding
          </p>
        </div>
      </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  color: '#484f58',
  marginBottom: '5px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#161b22',
  border: '1px solid #21262d',
  borderRadius: '6px',
  padding: '9px 12px',
  color: '#e6edf3',
  fontSize: '13px',
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  outline: 'none',
  transition: 'border-color 0.15s',
};