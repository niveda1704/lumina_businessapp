import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fad1e3', // Matches the soft pink reference
            color: '#4a042e', // Dark burgundy text
            fontFamily: "'Playfair Display', serif", // Elegant serif
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Top Nav (Minimal) */}
            <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>LUMINA</div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span onClick={() => navigate('/services')} style={{ cursor: 'pointer' }}>Services</span>
                    <span onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>About</span>
                    <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</span>
                </div>
            </nav>

            <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '4rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '4rem', fontWeight: '400', letterSpacing: '-0.02em', marginBottom: '1rem' }}
                >
                    Operational Intelligence
                </motion.h1>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1.2fr',
                maxWidth: '1200px',
                margin: '0 auto',
                alignItems: 'center',
                gap: '4rem',
                padding: '0 2rem'
            }}>

                {/* Left Pill Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        height: '500px',
                        borderRadius: '9999px', // Full pill shape
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                        alt="CEO Analysis"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(250, 209, 227, 0.2)' }} /> {/* Pink tint */}
                </motion.div>

                {/* Center Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ textAlign: 'left' }}
                >
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Flowing <br /> Perfectly.
                    </h2>
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        color: '#834b63',
                        marginBottom: '2rem'
                    }}>
                        The starter suite meant for learning how to optimize workflows perfectly.
                        Eliminate friction and invisible loss today.
                    </p>
                    <button
                        onClick={() => navigate('/input')}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: '1px solid #4a042e',
                            paddingBottom: '2px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            color: '#4a042e',
                            fontFamily: "'Inter', sans-serif",
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Start Analysis <ArrowRight size={18} />
                    </button>
                </motion.div>

                {/* Right Dual Pills */}
                <div style={{ display: 'flex', gap: '1.5rem', height: '500px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{
                            flex: 1,
                            borderRadius: '9999px',
                            overflow: 'hidden',
                            marginTop: '4rem', // Offset
                            background: '#fff'
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400&auto=format&fit=crop"
                            alt="Team"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            flex: 1,
                            borderRadius: '9999px',
                            overflow: 'hidden',
                            marginBottom: '4rem', // Offset
                            background: '#fff'
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop"
                            alt="Collaboration"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </motion.div>
                </div>

            </div>

            {/* Bottom Element */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <div style={{
                    display: 'inline-block',
                    border: '1px solid #4a042e',
                    borderRadius: '20px',
                    width: '30px',
                    height: '45px',
                    opacity: 0.5
                }} />
            </div>

        </div>
    );
};

export default Landing;
