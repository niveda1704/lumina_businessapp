import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';

const WorkflowInput = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: 'Strategic Vendor Procurement',
        description: 'End-to-end process for sourcing, vetting, and onboarding new strategic software vendors. This includes initial RFI/RFP generation, multiple rounds of vendor evaluation, legal contract review, security compliance checks (InfoSec), and final budget approval from the CFO and Finance department.',
        people_involved: 8,
        approvals_per_task: 3,
        tools_used: 'Jira, Slack, DocuSign, Excel, Email, Coupa',
        avg_delays_hours: 48,
        rejection_rate: 15,
        monthly_volume: 12,
        avg_annual_salary: 1800000,
        additional_budget: 500000
    });

    // ... rest of the code ...

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert tools string to array and other types
            const payload = {
                ...formData,
                people_involved: parseInt(formData.people_involved),
                approvals_per_task: parseInt(formData.approvals_per_task),
                avg_delays_hours: parseFloat(formData.avg_delays_hours),
                rejection_rate: parseFloat(formData.rejection_rate),
                monthly_volume: parseInt(formData.monthly_volume) || 1,
                avg_annual_salary: parseFloat(formData.avg_annual_salary),
                additional_budget: parseFloat(formData.additional_budget),
                tools_used: formData.tools_used.split(',').map(t => t.trim()).filter(t => t)
            };

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            // Store result in local storage or pass via state
            localStorage.setItem('lastAnalysis', JSON.stringify({ input: payload, result: data }));
            navigate('/report');
        } catch (error) {
            console.error(error);
            alert('Failed to connect to the analysis engine. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', paddingTop: '4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Describe the Workflow</h2>

                <form onSubmit={handleSubmit} className="glass-panel">

                    <div className="input-group">
                        <label className="input-label">Workflow Name</label>
                        <input
                            className="input-field"
                            name="name"
                            placeholder="e.g. Employee Onboarding, Vendor Payment"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            className="input-field"
                            name="description"
                            rows="3"
                            placeholder="Briefly describe what happens step-by-step..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label className="input-label">People Involved</label>
                            <input
                                type="number"
                                className="input-field"
                                name="people_involved"
                                min="1"
                                value={formData.people_involved}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Approvals Required</label>
                            <input
                                type="number"
                                className="input-field"
                                name="approvals_per_task"
                                min="0"
                                value={formData.approvals_per_task}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Tools Used (Comma Separated)</label>
                        <input
                            className="input-field"
                            name="tools_used"
                            placeholder="e.g. Email, Slack, Excel, Jira"
                            value={formData.tools_used}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Avg. Delay per Task (Hours)</label>
                        <input
                            type="number"
                            className="input-field"
                            name="avg_delays_hours"
                            step="0.5"
                            value={formData.avg_delays_hours}
                            onChange={handleChange}
                        />
                        <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                            Time spent waiting for feedback, approvals, or information.
                        </small>
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            Average Rejection/Rework Rate: <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{formData.rejection_rate}%</span>
                        </label>
                        <input
                            type="range"
                            className="range-slider"
                            name="rejection_rate"
                            min="0" max="50" step="5"
                            value={formData.rejection_rate}
                            onChange={handleChange}
                            style={{ width: '100%', marginBottom: '0.5rem', accentColor: 'var(--accent-color)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span>Rarely (0-5%)</span>
                            <span>Sometimes (15%)</span>
                            <span>Often (30%+)</span>
                        </div>
                        <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block', fontStyle: 'italic' }}>
                            "How often is work sent back for correction?" (e.g. 15% = 1 in 7 tasks)
                        </small>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Monthly Volume (Executions/Month)</label>
                        <input
                            type="number"
                            className="input-field"
                            name="monthly_volume"
                            min="1"
                            placeholder="e.g. 50"
                            value={formData.monthly_volume}
                            onChange={handleChange}
                        />
                        <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                            How many times does this process run per month? (Crucial for total loss calc)
                        </small>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Avg. Annual Salary per Person (₹)</label>
                            <input
                                type="number"
                                className="input-field"
                                name="avg_annual_salary"
                                value={formData.avg_annual_salary}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Total Estimated Project Budget (₹)</label>
                            <input
                                type="number"
                                className="input-field"
                                name="total_project_budget"
                                placeholder="Includes salaries, licenses, etc."
                                value={formData.total_project_budget}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Loader2 className="animate-spin" size={20} /> Analyzing...
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Generate Clarity Report <ChevronRight size={20} />
                                </span>
                            )}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
};

export default WorkflowInput;
