import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/token' : '/api/users/';

        let body;
        let headers = { 'Content-Type': 'application/json' };

        if (isLogin) {
            const form = new URLSearchParams();
            form.append('username', formData.username);
            form.append('password', formData.password);
            body = form;
            headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        } else {
            body = JSON.stringify(formData);
        }

        try {
            const res = await fetch(endpoint, { method: 'POST', headers, body });

            // Safely parse response
            const text = await res.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (err) {
                console.error("Response parsing error:", err, text);
                throw new Error(res.status === 504
                    ? "Backend unavailable. Is the server running?"
                    : `Server error (${res.status})`);
            }

            if (!res.ok) throw new Error(data.detail || 'Authentication failed');

            if (isLogin) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('role', data.role);
                navigate('/');
            } else {
                setIsLogin(true);
                setError('Registration successful! Please login.');
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.message || "Connection failed. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: '#fad1e3', // Pink background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Main Card Container */}
            <div style={{
                width: '1000px',
                height: '600px',
                background: 'white',
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(74, 4, 46, 0.1)',
                display: 'flex'
            }}>

                {/* Left Side - Login Form (White) */}
                <div style={{
                    flex: '0 0 400px',
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', color: '#4a042e', fontWeight: 'bold' }}>
                        <div style={{ width: '24px', height: '24px', background: '#a55b75', borderRadius: '6px' }} />
                        <span>LUMINA</span>
                    </div>

                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: '#a55b75',
                            color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <User size={40} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}><User size={16} /></div>
                            <input
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '50px',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#333'
                                }}
                                type="text"
                                required
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                placeholder="USERNAME"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}><Lock size={16} /></div>
                            <input
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '50px',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#333'
                                }}
                                type="password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="PASSWORD"
                            />
                        </div>

                        {error && (
                            <div style={{ fontSize: '0.8rem', color: '#e53e3e', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '12px',
                                background: '#a55b75', // Muted mauve/pink button
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(165, 91, 117, 0.3)'
                            }}
                        >
                            {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'REGISTER')}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} /> Remember me
                        </div>
                        <span style={{ cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Create Account' : 'Back to Login'}
                        </span>
                    </div>
                </div>

                {/* Right Side - Pink Swirl Image */}
                <div style={{
                    flex: 1,
                    position: 'relative',
                    background: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop")', // Abstract Pink Swirl
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '3rem'
                }}>
                    {/* Top Nav Links on Right Side */}
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-end', fontSize: '0.75rem', color: 'rgba(74, 4, 46, 0.7)', fontWeight: '600' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/about')}>ABOUT</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/services')}>SERVICES</span>
                    </div>

                    <div style={{ alignSelf: 'flex-end', textAlign: 'right', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>Welcome.</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', maxWidth: '300px', marginLeft: 'auto' }}>
                            Access your operational intelligence dashboard. Eliminate friction today.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
