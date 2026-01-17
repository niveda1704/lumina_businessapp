import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, FileText, Calendar } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8000/workflows', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setWorkflows(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (wf) => {
        if (compareMode) {
            if (selectedIds.includes(wf.id)) {
                setSelectedIds(selectedIds.filter(id => id !== wf.id));
            } else {
                if (selectedIds.length < 2) {
                    setSelectedIds([...selectedIds, wf.id]);
                }
            }
        } else {
            localStorage.setItem('lastAnalysis', JSON.stringify({ input: wf.input_data, result: wf.result_data, id: wf.id }));
            navigate('/report');
        }
    };

    const handleCompareLaunch = () => {
        if (selectedIds.length !== 2) return;
        const selectedWfs = workflows.filter(w => selectedIds.includes(w.id));
        navigate('/comparison', { state: { workflows: selectedWfs } });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>CONSULTANT DASHBOARD</h4>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Client Projects</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-secondary"
                        onClick={handleLogout}
                        style={{ color: 'var(--danger)', borderColor: 'rgba(240, 82, 82, 0.3)' }}
                    >
                        Sign Out
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => { setCompareMode(!compareMode); setSelectedIds([]); }}
                        style={{ borderColor: compareMode ? 'var(--accent-color)' : 'var(--border-color)', color: compareMode ? 'var(--accent-color)' : 'var(--text-primary)' }}
                    >
                        {compareMode ? 'Cancel Selection' : 'Compare Workflows'}
                    </button>
                    {!compareMode && (
                        <button className="btn-primary" onClick={() => navigate('/input')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={20} /> New Analysis
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div style={{ color: 'var(--text-secondary)' }}>Loading projects...</div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
                >
                    {workflows.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)', border: '2px dashed var(--border-color)', borderRadius: '16px' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={40} color="var(--text-secondary)" />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>No Analyses Yet</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                                Start by creating a new workflow analysis to identify operational friction and invisible loss.
                            </p>
                            <button className="btn-primary" onClick={() => navigate('/input')}>
                                Start First Analysis
                            </button>
                        </div>
                    )}

                    {workflows.map((wf) => {
                        const isSelected = selectedIds.includes(wf.id);
                        return (
                            <div
                                key={wf.id}
                                className="glass-panel"
                                style={{
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                    transform: isSelected ? 'translateY(-5px)' : 'none',
                                    position: 'relative'
                                }}
                                onClick={() => handleCardClick(wf)}
                            >
                                {compareMode && (
                                    <div style={{
                                        position: 'absolute', top: '1rem', right: '1rem',
                                        width: '20px', height: '20px',
                                        borderRadius: '50%',
                                        border: '2px solid var(--border-color)',
                                        background: isSelected ? 'var(--accent-color)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {isSelected && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(219, 39, 119, 0.1)', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={20} />
                                    </div>
                                    {!compareMode && (
                                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: wf.result_data.severity === 'High' ? 'var(--danger)' : 'var(--success)' }}>
                                            {wf.result_data.severity} Risk
                                        </span>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{wf.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.8em' }}>
                                    {wf.description}
                                </p>

                                {!compareMode && (
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Calendar size={14} /> {new Date(wf.created_at).toLocaleDateString()}
                                        </span>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Delete this report?')) {
                                                        const token = localStorage.getItem('token');
                                                        fetch(`http://localhost:8000/workflows/${wf.id}`, {
                                                            method: 'DELETE',
                                                            headers: { 'Authorization': `Bearer ${token}` }
                                                        })
                                                            .then(() => setWorkflows(workflows.filter(w => w.id !== wf.id)));
                                                    }
                                                }}
                                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                Delete
                                            </button>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-color)' }}>
                                                View Report <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            )}

            {/* Float Action Button for Comparison */}
            {compareMode && selectedIds.length === 2 && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
                >
                    <button className="btn-primary" onClick={handleCompareLaunch} style={{ padding: '1rem 3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        Run Comparison vs
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
