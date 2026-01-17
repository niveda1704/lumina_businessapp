import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Zap, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const Simulator = () => {
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    // Simulation States
    const [teamSize, setTeamSize] = useState(5);
    const [approvals, setApprovals] = useState(2);
    const [toolCount, setToolCount] = useState(3);
    const [monthlyVolume, setMonthlyVolume] = useState(50);

    // Derived Financials
    const [currentCost, setCurrentCost] = useState(0);
    const [projectedCost, setProjectedCost] = useState(0);
    const [savings, setSavings] = useState(0);
    const [optimizations, setOptimizations] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lastAnalysis');
        if (!saved) {
            navigate('/input');
            return;
        }
        const parsed = JSON.parse(saved);
        setInitialData(parsed);

        // Initialize sliders with real data
        setTeamSize(parsed.input.people_involved);
        setApprovals(parsed.input.approvals_per_task);
        if (parsed.input.tools_used && Array.isArray(parsed.input.tools_used)) {
            setToolCount(parsed.input.tools_used.length);
        }
        setMonthlyVolume(parsed.input.monthly_volume || 50);

        // Set initial baseline cost
        const baseline = parsed.result.estimated_financial_loss * 50;
        setCurrentCost(baseline);

    }, [navigate]);

    // Recalculate Projection
    useEffect(() => {
        if (!initialData) return;

        // Friction PER RUN
        const toolFriction = Math.max(0, toolCount - 2) * 0.5 * teamSize;
        const approvalFriction = approvals * teamSize * 1.5;

        // Delay Impact
        const originalApprovals = initialData.input.approvals_per_task || 1;
        const originalDelay = initialData.input.avg_delays_hours || 0;

        const baseWait = originalDelay * 0.5;
        const delayPerApproval = originalApprovals > 0 ? (originalDelay * 0.5) / originalApprovals : 0;

        const newDelay = baseWait + (delayPerApproval * approvals);
        const delayImpact = newDelay * teamSize;

        // Rejection/Rework Impact
        const rejectionRate = initialData.input.rejection_rate || 0;
        const reworkImpact = (delayImpact + approvalFriction) * (rejectionRate / 100) * 1.5;

        // Total Hours Lost PER RUN
        const timeLossPerRun = toolFriction + approvalFriction + delayImpact + reworkImpact;

        // Financials
        const hourlyRate = (initialData.input.avg_annual_salary || 2500000) / 2000;
        const costPerRun = timeLossPerRun * hourlyRate;

        // ANNUAL Projection
        const annualProjected = costPerRun * monthlyVolume * 12;

        setProjectedCost(annualProjected);
        setSavings(currentCost - annualProjected);

    }, [teamSize, approvals, toolCount, monthlyVolume, initialData, currentCost]);

    // Prepare Bullet Chart Data
    // Logic: Baseline is 100 (The full bar). The 'value' is the Percentage of the Baseline remaining.
    // Lower value = Better optimization.
    const getPercentage = (current, baseline) => {
        if (!baseline || baseline === 0) return 0;
        return Math.min(100, Math.round((current / baseline) * 100));
    };

    const bulletData = initialData ? [
        {
            name: 'Financial Cost',
            value: getPercentage(projectedCost, currentCost),
        },
        {
            name: 'Team Overhead',
            value: getPercentage(teamSize, initialData.input.people_involved),
        },
        {
            name: 'Approval Drag',
            value: getPercentage(approvals, initialData.input.approvals_per_task),
        },
        {
            name: 'Tool Complexity',
            value: getPercentage(toolCount, (initialData.input.tools_used || []).length),
        },
    ] : [];

    // Helper to get color based on efficiency
    // If value is low (e.g. 30% of original), it's Green (Good).
    // If value is high (e.g. 90% of original), it's Red/Orange (Bad).
    const getBarColor = (val) => {
        if (val < 50) return 'var(--success)';
        if (val < 80) return 'var(--warning)';
        return 'var(--accent-color)';
    };

    const handleAutoOptimize = () => {
        // Apply Best Practice Heuristics
        setApprovals(current => Math.max(0, Math.min(2, Math.floor(current * 0.5)))); // Aim for < 2
        setTeamSize(current => Math.max(2, Math.floor(current * 0.6))); // Aim for 2-Pizza Team
        setToolCount(current => Math.max(1, Math.min(3, Math.floor(current * 0.5)))); // Aim for < 3 tools
        setOptimizations(true);
    };

    if (!initialData) return null;

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '4rem' }}>
            <button onClick={() => navigate('/report')} className="btn-secondary" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to Report
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>

                {/* LEFT: CONTROLS */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="glass-panel"
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RefreshCw size={24} color="var(--accent-color)" />
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Scenario Tuner</h2>
                        </div>
                        <button
                            onClick={handleAutoOptimize}
                            style={{
                                background: 'linear-gradient(90deg, #238636 0%, #2ea043 100%)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            <Zap size={14} /> Auto-Optimize
                        </button>
                    </div>

                    <div className="input-group">
                        <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Approvals Required
                            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{approvals}</span>
                        </label>
                        <input
                            type="range"
                            min="0" max="10"
                            value={approvals}
                            onChange={(e) => setApprovals(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Fewer gates = higher velocity.
                        </p>
                    </div>

                    <div className="input-group" style={{ marginTop: '2rem' }}>
                        <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Team Size Involved
                            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{teamSize} People</span>
                        </label>
                        <input
                            type="range"
                            min="1" max="50"
                            value={teamSize}
                            onChange={(e) => setTeamSize(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Optimize team structure (Metcalfe's Law).
                        </p>
                    </div>

                    <div className="input-group" style={{ marginTop: '2rem' }}>
                        <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Tools in Workflow
                            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{toolCount} Apps</span>
                        </label>
                        <input
                            type="range"
                            min="1" max="15"
                            value={toolCount}
                            onChange={(e) => setToolCount(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Reduce context switching tax.
                        </p>
                    </div>

                    <div className="input-group" style={{ marginTop: '2rem' }}>
                        <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Monthly Volume
                            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{monthlyVolume} Runs</span>
                        </label>
                        <input
                            type="range"
                            min="1" max="500"
                            value={monthlyVolume}
                            onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            High frequency amplifies small inefficiencies.
                        </p>
                    </div>

                </motion.div>

                {/* Optimization Logic Panel */}
                {optimizations && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '2rem', background: 'rgba(92, 158, 111, 0.1)', border: '1px solid rgba(92, 158, 111, 0.2)', borderRadius: '12px', padding: '1.5rem' }}
                    >
                        <h4 style={{ color: 'var(--success)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Zap size={16} /> Strategy Applied
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li>
                                <strong style={{ color: 'var(--text-primary)' }}>Process Streamlining:</strong> Reduced approval layers and team size to optimal levels.
                            </li>
                            <li>
                                <strong style={{ color: 'var(--text-primary)' }}>Tech Consolidation:</strong> Minimized tool switching to recover cognitive load.
                            </li>
                        </ul>
                    </motion.div>
                )}

                {/* RIGHT: VISUALIZATION */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)' }}>ANNUAL COST PROJECTION</h3>

                        {/* Dynamic Headline based on state */}
                        {!optimizations ? (
                            <div style={{
                                fontSize: '4rem',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                            }}>
                                ₹ {(currentCost).toLocaleString('en-IN', { maximumFractionDigits: 0, notation: "compact", compactDisplay: "short" })}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    fontSize: '4rem',
                                    fontWeight: '800',
                                    color: 'var(--success)', // Green for savings
                                    textShadow: '0 0 30px rgba(63, 185, 80, 0.2)'
                                }}>
                                    ₹ {(projectedCost).toLocaleString('en-IN', { maximumFractionDigits: 0, notation: "compact", compactDisplay: "short" })}
                                </div>
                                <div style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    color: 'var(--success)',
                                    background: 'rgba(92, 158, 111, 0.1)',
                                    padding: '0.2rem 1rem',
                                    borderRadius: '50px',
                                    marginTop: '0.5rem'
                                }}>
                                    SAVE ₹ {(savings).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / YR
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ height: '450px', background: 'white', borderRadius: '30px', padding: '2rem', border: '1px solid rgba(74, 4, 46, 0.05)', boxShadow: '0 20px 60px rgba(74, 4, 46, 0.08)', position: 'relative' }}>
                        {/* HORIZONTAL CAPSULE/BULLET CHART IMPLEMENTATION */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={bulletData}
                                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                                barSize={40}
                            >
                                <XAxis type="number" hide domain={[0, 100]} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value}% of Baseline`, 'Remaining Consumption']}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[0, 20, 20, 0]}
                                    background={{ fill: 'rgba(0,0,0,0.05)', radius: [0, 20, 20, 0] }}
                                    animationDuration={1500}
                                >
                                    {bulletData.map((entry, index) => (
                                        <Cell key={index} fill={getBarColor(entry.value)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        {!optimizations && (
                            <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', textAlign: 'center', opacity: 0.7 }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    Bars represent % of original waste/cost remaining.<br />Short bars = <b>Good</b>.
                                </div>
                            </div>
                        )}
                    </div>

                    {optimizations && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(57, 181, 74, 0.05)', borderRadius: '16px', border: '1px solid rgba(57, 181, 74, 0.2)' }}
                        >
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={18} fill="var(--success)" color="var(--success)" /> Efficiency Gains Realized
                            </h4>
                            <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                The <b>Short Green Bar</b> indicates significant optimization. You have successfully reduced the 'Consumption Footprint' of this workflow
                                to just <b>{getPercentage(projectedCost, currentCost)}%</b> of its original state, saving <b>{(savings / ((initialData.input.avg_annual_salary || 2500000) / 2000)).toFixed(0)} hours</b> annually.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Simulator;
