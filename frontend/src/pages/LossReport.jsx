import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Zap, Download, FileText, TrendingUp, AlertCircle, Target } from 'lucide-react';
import WorkflowMap from './WorkflowMap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LossReport = () => {
    const navigate = useNavigate();
    const reportRef = useRef(null);
    const [dataCopy, setDataCopy] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('lastAnalysis');
        if (!saved) {
            navigate('/input');
            return;
        }
        setDataCopy(JSON.parse(saved));
    }, [navigate]);

    const handleDownloadPDF = async () => {
        const id = dataCopy?.id || dataCopy?.result?.id;
        if (!id) return alert("Please save analysis first (or re-run to save)");
        window.open(`http://localhost:8000/export/pdf/${id}`, '_blank');
    };

    const handleDownloadPPTX = async () => {
        const id = dataCopy?.id || dataCopy?.result?.id;
        if (!id) return alert("Please save analysis first (or re-run to save)");
        window.open(`http://localhost:8000/export/pptx/${id}`, '_blank');
    };

    if (!dataCopy) return null;

    const { result, input } = dataCopy;

    const getSeverityColor = (sev) => {
        switch (sev.toLowerCase()) {
            case 'high': return 'var(--text-primary)';
            case 'medium': return 'var(--text-primary)';
            default: return 'var(--success)';
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            {/* Navigation & Actions Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} /> Dashboard
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleDownloadPDF} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={16} /> PDF
                    </button>
                    <button onClick={handleDownloadPPTX} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={16} /> Export PPTX
                    </button>
                </div>
            </div>

            {/* MAIN REPORT SURFACE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                ref={reportRef}
                className="report-surface"
            >
                {/* 1. HERO HEADER: Centered & Impactful */}
                <div style={{ textAlign: 'center', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        background: 'rgba(0,0,0,0.03)',
                        borderRadius: '50px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        letterSpacing: '0.05em',
                        fontWeight: '600'
                    }}>
                        INVISIBLE LOSS ANALYSIS
                    </div>
                    <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', lineHeight: '1.1' }}>{input.name}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Workflow Clarity Score</span>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: result.clarity_score > 70 ? 'var(--success)' : 'var(--text-primary)' }}>
                                {result.clarity_score}<span style={{ fontSize: '1.5rem', color: '#ccc' }}>/100</span>
                            </div>
                        </div>
                        {result.waste_ratio && (
                            <div style={{
                                padding: '1rem 2rem',
                                background: result.waste_ratio > 30 ? 'rgba(217, 66, 66, 0.05)' : 'rgba(92, 158, 111, 0.05)',
                                borderRadius: '16px',
                                border: result.waste_ratio > 30 ? '1px solid rgba(217, 66, 66, 0.1)' : '1px solid rgba(92, 158, 111, 0.1)'
                            }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Investment Waste Ratio</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: result.waste_ratio > 30 ? 'var(--text-primary)' : 'var(--success)' }}>
                                    {result.waste_ratio}%
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. THE IMPACT DASHBOARD (Bento Grid) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>

                    {/* A. Big Financial Impact Card (60%) */}
                    <div className="report-card" style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '300px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>Weekly Financial Bleed</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
                                ₹{Math.round(result.estimated_financial_loss / 1000)}k
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Conservative Est.</div>
                                <div style={{ fontWeight: '600' }}>₹{(result.confidence_interval?.lower / 1000).toFixed(0)}k</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Worst Case</div>
                                <div style={{ fontWeight: '600' }}>₹{(result.confidence_interval?.upper / 1000).toFixed(0)}k</div>
                            </div>
                        </div>
                    </div>

                    {/* B. Stacked Metrics (40%) */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Time Loss */}
                        <div className="report-card compact" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <Clock size={18} /> Hours Lost Weekly
                                </div>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontWeight: '600' }}>
                                    DELAY INDEX: {result.decision_delay_index}/10
                                </span>
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {result.weekly_time_loss_hours}h
                            </div>
                            {result.rework_loss_hours > 0 && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Includes {result.rework_loss_hours}h rework</div>
                            )}
                        </div>

                        {/* Risk */}
                        <div className="report-card compact" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                <AlertTriangle size={18} /> Operational Risk
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: getSeverityColor(result.severity) }}>
                                {result.severity}
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. VISUAL DIAGNOSTIC (Full Width) */}
                <div style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '4px', height: '24px', background: 'var(--accent-color)', borderRadius: '2px' }}></div>
                        <h2 style={{ margin: 0 }}>Process Anatomy</h2>
                    </div>
                    <WorkflowMap input={input} />
                </div>

                {/* 4. ANALYSIS & BLINDSPOTS (Split Layout) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>

                    {/* Left: Trend Graph */}
                    <div className="report-card" style={{ minHeight: '400px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <TrendingUp size={20} color="var(--text-primary)" />
                            <h3 style={{ margin: 0 }}>Projected Loss Trajectory</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Cumulative financial impact over 4 Quarters if process remains unoptimized.
                        </p>
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { q: 'Start', val: 0 },
                                    { q: 'Q1', val: result.estimated_financial_loss * 12.5 },
                                    { q: 'Q2', val: result.estimated_financial_loss * 25 },
                                    { q: 'Q3', val: result.estimated_financial_loss * 37.5 },
                                    { q: 'Q4', val: result.estimated_financial_loss * 50 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d16d6d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#d16d6d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        formatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                                    />
                                    <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="val"
                                        stroke="#d16d6d"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorLoss)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right: Blindspots List */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <AlertCircle size={20} color="var(--text-primary)" />
                            <h3 style={{ margin: 0 }}>Critical Blindspots</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {result.invisible_loss_points.map((point, idx) => (
                                <div key={idx} className="report-card compact" style={{ borderLeft: '3px solid var(--danger)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{point.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{point.reason}</p>
                                    {point.blindness_reason && (
                                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(0,0,0,0.1)', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                            "{point.blindness_reason}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. STRATEGIC ACTION (Bottom Grid) */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Target size={20} color="var(--accent-color)" />
                        <h2 style={{ margin: 0 }}>Corrective Roadmap</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {result.recommendations.map((rec, idx) => (
                            <div key={idx} className="report-card compact" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        background: rec.type === 'Automate' ? 'rgba(88, 166, 255, 0.1)' : 'rgba(92, 158, 111, 0.1)',
                                        color: rec.type === 'Automate' ? 'var(--text-primary)' : 'var(--success)'
                                    }}>
                                        {rec.type}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{rec.action}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0', flex: 1 }}>{rec.impact}</p>

                                {rec.simulator_action && (
                                    <button
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'var(--text-primary)',
                                            borderRadius: '12px',
                                            color: '#fff',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontWeight: '500',
                                            transition: 'transform 0.2s'
                                        }}
                                        onClick={() => navigate('/simulator')}
                                    >
                                        <Zap size={16} fill="white" /> Simulate Solution
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default LossReport;
