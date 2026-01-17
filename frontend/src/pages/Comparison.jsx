import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, AlertTriangle, Clock, DollarSign, Activity } from 'lucide-react';

const Comparison = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [wfA, setWfA] = useState(null);
    const [wfB, setWfB] = useState(null);

    useEffect(() => {
        if (!location.state || !location.state.workflows || location.state.workflows.length !== 2) {
            navigate('/dashboard');
            return;
        }
        setWfA(location.state.workflows[0]);
        setWfB(location.state.workflows[1]);
    }, [location, navigate]);

    if (!wfA || !wfB) return null;

    // Helper to determine winner
    const getWinnerClass = (valA, valB, lowerIsBetter = false) => {
        if (valA === valB) return [null, null];
        const aWins = lowerIsBetter ? valA < valB : valA > valB;
        return aWins ? ['winner', 'loser'] : ['loser', 'winner'];
    };

    const MetricRow = ({ label, icon: Icon, valueA, valueB, format = (v) => v, lowerIsBetter = false }) => {
        const [classA, classB] = getWinnerClass(valueA, valueB, lowerIsBetter);

        return (
            <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 150px 1fr', alignItems: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center', opacity: classA === 'loser' ? 0.5 : 1, transform: classA === 'winner' ? 'scale(1.1)' : 'none', transition: 'all 0.3s' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: classA === 'winner' ? 'var(--success)' : 'var(--text-primary)' }}>
                        {format(valueA)}
                    </div>
                    {classA === 'winner' && <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '0.25rem' }}><Trophy size={12} style={{ display: 'inline' }} /> BETTER</div>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)' }}>
                    <Icon size={20} style={{ marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>

                <div style={{ textAlign: 'center', opacity: classB === 'loser' ? 0.5 : 1, transform: classB === 'winner' ? 'scale(1.1)' : 'none', transition: 'all 0.3s' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: classB === 'winner' ? 'var(--success)' : 'var(--text-primary)' }}>
                        {format(valueB)}
                    </div>
                    {classB === 'winner' && <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '0.25rem' }}><Trophy size={12} style={{ display: 'inline' }} /> BETTER</div>}
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h4 style={{ color: 'var(--text-secondary)' }}>HEAD-TO-HEAD ANALYSIS</h4>
                    <h1 style={{ fontSize: '2.5rem' }}>Workflow Comparison</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 1fr', marginBottom: '2rem', alignItems: 'end', textAlign: 'center' }}>
                    <div>
                        <h2 style={{ color: 'var(--accent-color)', fontSize: '1.8rem' }}>{wfA.name}</h2>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{wfA.input_data.people_involved} People • {wfA.input_data.tools_used.length} Tools</div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '1.2rem', paddingBottom: '1rem' }}>VS</div>
                    <div>
                        <h2 style={{ color: 'var(--accent-color)', fontSize: '1.8rem' }}>{wfB.name}</h2>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{wfB.input_data.people_involved} People • {wfB.input_data.tools_used.length} Tools</div>
                    </div>
                </div>

                {/* Metrics */}
                <MetricRow
                    label="Clarity Score"
                    icon={Activity}
                    valueA={wfA.result_data.clarity_score}
                    valueB={wfB.result_data.clarity_score}
                />
                <MetricRow
                    label="Weekly Time Loss"
                    icon={Clock}
                    valueA={wfA.result_data.weekly_time_loss_hours}
                    valueB={wfB.result_data.weekly_time_loss_hours}
                    format={v => `${v}h`}
                    lowerIsBetter={true}
                />
                <MetricRow
                    label="Money Burned"
                    icon={DollarSign}
                    valueA={Math.round(wfA.result_data.estimated_financial_loss)}
                    valueB={Math.round(wfB.result_data.estimated_financial_loss)}
                    format={v => `₹${(v / 1000).toFixed(0)}k`}
                    lowerIsBetter={true}
                />
                <MetricRow
                    label="Waste Ratio"
                    icon={AlertTriangle}
                    valueA={wfA.result_data.waste_ratio || 0}
                    valueB={wfB.result_data.waste_ratio || 0}
                    format={v => `${v}%`}
                    lowerIsBetter={true}
                />

                {/* Verdict Box */}
                <div className="glass-panel" style={{ marginTop: '3rem', textAlign: 'center', background: 'var(--bg-card)', border: '2px solid var(--accent-color)' }}>
                    <h3 style={{ color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Analysis Verdict</h3>
                    <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>
                        The <b>{wfA.result_data.clarity_score > wfB.result_data.clarity_score ? wfA.name : wfB.name}</b> workflow is structurally superior,
                        retaining <b>{Math.abs(wfA.result_data.waste_ratio - wfB.result_data.waste_ratio).toFixed(1)}%</b> more capital efficiency than its counterpart.
                    </p>
                </div>

            </motion.div>
        </div>
    );
};

export default Comparison;
