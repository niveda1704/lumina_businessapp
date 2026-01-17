import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Target, TrendingUp, Users, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketingPage = ({ title, subtitle, content, imageType }) => {
    const navigate = useNavigate();

    // Icon mapping for content
    const getIcon = (idx) => {
        const icons = [Zap, Target, TrendingUp, Users, Cpu, Globe];
        const Icon = icons[idx % icons.length];
        return <Icon size={24} color="#f472b6" />;
        return <Icon size={24} color="#db2777" />; // Updated icon color
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: '#fad1e3', // Pink Theme
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            color: '#4a042e', // Dark burgundy text
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Background Gradients (Softer/Hidden to match clean look) */}
            <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, #db2777 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.1 }} />
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.1 }} />

            <div style={{
                width: '100%',
                maxWidth: '1200px',
                height: '85vh',
                background: 'rgba(255, 255, 255, 0.4)', // Lighter glass
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(74, 4, 46, 0.1)'
            }}>

                {/* Left Side - Visual & Title */}
                <div style={{
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    borderRight: '1px solid rgba(74, 4, 46, 0.05)'
                }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#4a042e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
                        <ArrowLeft size={20} /> Back
                    </button>

                    <div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            style={{
                                fontSize: '4.5rem',
                                fontWeight: '300',
                                fontFamily: "'Playfair Display', serif", // Editorial style
                                lineHeight: 1.1,
                                marginBottom: '1rem',
                                color: '#4a042e'
                            }}
                        >
                            {title.split(' ')[0]} <br />
                            <span style={{ fontStyle: 'italic', fontWeight: '600', color: '#db2777' }}>{title.split(' ').slice(1).join(' ')}</span>
                        </motion.h1>

                        <div style={{ height: '4px', width: '80px', background: '#db2777', marginTop: '2rem' }} />
                    </div>

                    {/* Feature Image */}
                    <div style={{
                        marginTop: 'auto',
                        height: '350px',
                        borderRadius: '9999px', // Pill Shape for consistency
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(74,4,46,0.1)'
                    }}>
                        <img
                            src={imageType === 'services'
                                ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" // Data/Analytics Dashboard
                                : "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" // Meeting/Team
                            }
                            alt={imageType}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'grayscale(0%) contrast(105%)', // Removed heavy filter for cleaner look
                                transition: 'transform 0.5s ease',
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />

                        {/* Overlay Gradient for Text Readability if needed later */}
                        {/* Removed as per instruction, not present in new code */}
                    </div>
                </div>

                {/* Right Side - List */}
                <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem', overflowY: 'auto' }}>
                    <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: '#834b63', marginBottom: '1rem' }}>
                        {imageType === 'services' ? 'Capabilities' : 'Who We Are'}
                    </h3>

                    {content.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1.5rem',
                                padding: '1.5rem',
                                borderTop: index === 0 ? 'none' : '1px solid rgba(74, 4, 46, 0.1)',
                                borderBottom: '1px solid rgba(74, 4, 46, 0.1)'
                            }}
                        >
                            <div style={{
                                padding: '12px',
                                borderRadius: '50%', // Circle icon bg
                                background: 'rgba(219, 39, 119, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getIcon(index)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600', color: '#4a042e' }}>{item.head}</h3>
                                <p style={{ fontSize: '0.95rem', color: '#834b63', lineHeight: 1.6 }}>{item.body}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketingPage;
