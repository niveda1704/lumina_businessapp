import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, PieChart, Briefcase, Zap, Activity, Target } from 'lucide-react';

const FloatingIcons = () => {
    // Business Symbols
    const icons = [
        { Icon: DollarSign, color: '#d16d6d', size: 24 },
        { Icon: TrendingUp, color: '#5c9e6f', size: 28 },
        { Icon: PieChart, color: '#7a6e6e', size: 32 },
        { Icon: Briefcase, color: '#eab308', size: 26 },
        { Icon: Zap, color: '#d16d6d', size: 22 },
        { Icon: Activity, color: '#5c9e6f', size: 30 },
        { Icon: Target, color: '#d16d6d', size: 25 },
        { Icon: DollarSign, color: '#7a6e6e', size: 20 },
    ];

    // Generate random positions (client-side only to avoid hydration mismatch if SSR, but this is SPA)
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const generated = icons.map((item, i) => ({
            ...item,
            id: i,
            initialX: Math.random() * 100, // vw
            initialY: Math.random() * 100, // vh
            duration: 15 + Math.random() * 20, // 15-35s
            delay: Math.random() * 5,
        }));
        setElements(generated);
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    initial={{ x: `${el.initialX}vw`, y: `${el.initialY}vh`, opacity: 0 }}
                    animate={{
                        y: [`${el.initialY}vh`, `${el.initialY - 20}vh`, `${el.initialY}vh`], // Float up and down
                        x: [`${el.initialX}vw`, `${el.initialX + 10}vw`, `${el.initialX}vw`], // Drift
                        opacity: [0, 0.4, 0] // Fade in and out
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: el.delay
                    }}
                    style={{ position: 'absolute' }}
                >
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(2px)',
                        borderRadius: '12px',
                        padding: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                        <el.Icon size={el.size} color={el.color} strokeWidth={1.5} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingIcons;
