import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import WorkflowInput from './pages/WorkflowInput';
import LossReport from './pages/LossReport';
import Simulator from './pages/Simulator';
import Comparison from './pages/Comparison';
import Login from './pages/Login';
import MarketingPage from './pages/MarketingPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

import FloatingIcons from './components/FloatingIcons';

// ...

function App() {
  return (
    <Router>
      <div className="grid-bg"></div>
      <div className="mesh-overlay"></div>

      {/* Floating Business Aspects */}
      <FloatingIcons />

      <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/input" element={<PrivateRoute><WorkflowInput /></PrivateRoute>} />
          <Route path="/report" element={<PrivateRoute><LossReport /></PrivateRoute>} />
          <Route path="/simulator" element={<PrivateRoute><Simulator /></PrivateRoute>} />
          <Route path="/comparison" element={<PrivateRoute><Comparison /></PrivateRoute>} />

          {/* ... Marketing Routes ... */}
          <Route path="/about" element={
            <MarketingPage
              title="About Us"
              subtitle="Pioneering the future of operational intelligence."
              imageType="about"
              content={[
                { head: "Our Vision", body: "To create a business world where every decision is frictionless and zero capital is wasted on inefficiency." },
                { head: "The Technology", body: "Powered by advanced heuristic algorithms and large language models that understand enterprise context." },
                { head: "The Team", body: "Founded by a collective of operational experts and AI researchers dedicated to solving the 'Invisible Loss' problem." }
              ]}
            />
          } />
          <Route path="/services" element={
            <MarketingPage
              title="Our Services"
              subtitle="End-to-end intelligence for the modern enterprise."
              imageType="services"
              content={[
                { head: "Workflow Diagnostics", body: "We map, analyze, and stress-test your operational workflows to identify bottlenecks." },
                { head: "Financial Loss Quantification", body: "Our proprietary engine calculates the exact monetary impact of delays and rework." },
                { head: "Strategic Roadmap", body: "Receive actionable, AI-generated implementation plans to recover lost value immediately." }
              ]}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
