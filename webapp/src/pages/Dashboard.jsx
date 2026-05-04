import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Compass, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';

const Dashboard = () => {
  const { userData } = useAppContext();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userData.id) return;
    // Simulate dashboard fetch
    setTimeout(() => {
      setDashboard({
        level: 'Beginner',
        levelScore: 35,
        skillGaps: ['Advanced React Hooks', 'System Design'],
        breakdown: { codingScore: 40, quizScore: 30, projectScore: 0 },
        progress: { attempts: 1, improvement: '+5%' }
      });
      setError('');
    }, 500);
  }, [userData.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Determine alternative paths based on current skills/target role
  const getAlternativePaths = () => {
    const role = userData.targetRole || 'Developer';
    if (role.includes('Frontend')) {
      return [
        { title: 'Web Designer', match: '85% Match', desc: 'Leverage your HTML/CSS skills for design-focused roles.' },
        { title: 'Full Stack Developer', match: '50% Match', desc: 'Expand your knowledge into backend technologies.' }
      ];
    } else if (role.includes('Backend')) {
      return [
        { title: 'Database Administrator', match: '80% Match', desc: 'Focus purely on data modeling and architecture.' },
        { title: 'DevOps Engineer', match: '60% Match', desc: 'Move into cloud infrastructure and deployment pipelines.' }
      ];
    } else {
      return [
        { title: 'Product Manager', match: '70% Match', desc: 'Use your technical background to lead product strategy.' },
        { title: 'Data Analyst', match: '60% Match', desc: 'Transition your problem-solving skills into data insights.' }
      ];
    }
  };

  const altPaths = getAlternativePaths();

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: '80px', paddingBottom: '120px', maxWidth: '800px' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Welcome back, <span className="text-gradient">{userData.name || 'Guest'}</span></h1>
        <p className="text-muted">Your employability dashboard.</p>
      </motion.div>

      {/* Target Role Section - Now links to Roadmap */}
      <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
        <div 
          className="glass-card" 
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => navigate('/roadmap')}
        >
          <div>
            <span className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>What you want to become</span>
            <h2 style={{ fontSize: '2rem', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target color="var(--accent-primary)" size={32} />
              {userData.targetRole || 'Not Selected'}
            </h2>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <ArrowRight size={24} color="var(--accent-primary)" />
          </div>
        </div>
      </motion.div>

      {error && <p style={{ color: 'var(--error)', textAlign: 'center' }}>{error}</p>}

      {dashboard && (
        <motion.div variants={itemVariants} className="grid-cols-2" style={{ marginBottom: '3rem' }}>
          <div className="glass-card">
            <span className="text-muted">Level Score</span>
            <h2 style={{ fontSize: '2.4rem', margin: '8px 0' }}>{dashboard.levelScore}</h2>
            <span className="badge badge-primary">{dashboard.level}</span>
          </div>
          <div className="glass-card">
            <span className="text-muted">Skill Gaps</span>
            <p style={{ marginBottom: 0 }}>{dashboard.skillGaps?.length ? dashboard.skillGaps.join(', ') : 'No major gaps found'}</p>
          </div>
          <div className="glass-card">
            <span className="text-muted">Breakdown</span>
            <p style={{ marginBottom: 0 }}>
              Coding {dashboard.breakdown.codingScore} | Quiz {dashboard.breakdown.quizScore} | Project {dashboard.breakdown.projectScore}
            </p>
          </div>
          <div className="glass-card">
            <span className="text-muted">Progress</span>
            <p style={{ marginBottom: 0 }}>{dashboard.progress.attempts} attempts | {dashboard.progress.improvement} improvement</p>
          </div>
        </motion.div>
      )}

      {/* Alternative Paths Section */}
      <motion.div variants={itemVariants}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={24} color="var(--accent-secondary)" /> 
          What you can become with your current skills
        </h3>
        <div className="grid-cols-2">
          {altPaths.map((path, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="glass-card" 
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{path.title}</h4>
                <span className="badge badge-success">{path.match}</span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.95rem', margin: 0 }}>{path.desc}</p>
              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <Link to="/roadmap" className="text-gradient" style={{ textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                  Explore Path <ExternalLink size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
