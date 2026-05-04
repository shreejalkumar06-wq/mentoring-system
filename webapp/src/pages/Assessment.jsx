import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';

const Assessment = () => {
  const navigate = useNavigate();
  const { updateUserData } = useAppContext();
  
  const [formData, setFormData] = useState({
    education: '',
    targetRole: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nextStep = async () => {
    const skills = formData.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    setError('');
    setLoading(true);

    try {
      // Simulate API call for hackathon demo since there is no backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = {
        target_career: formData.targetRole || 'Frontend Developer',
        interests: [formData.education],
        skills: skills
      };

      updateUserData({
        targetRole: user.target_career,
        education: formData.education,
        skills: user.skills || []
      });

      navigate('/mentorship');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="container flex-center" 
      style={{ minHeight: '100vh', paddingBottom: '100px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '800px' }}>
        
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Qualification</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Tell us a bit about what you know and where you want to go.</p>
          
          <div className="input-group">
            <label className="input-label">Current skills</label>
            <input
              type="text"
              className="input-field"
              placeholder="E.g., JavaScript, React, SQL"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label className="input-label">What is your education?</label>
            <input 
              type="text"
              className="input-field" 
              placeholder="E.g., B.Tech in Computer Science, 2nd Year..."
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label className="input-label">What are you interested in?</label>
            <select 
              className="input-field"
              value={formData.targetRole}
              onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
            >
              <option value="" disabled>Select your field of interest</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Don't know">Don't know</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '2rem' }}>
            {error && <p style={{ color: 'var(--error)', marginRight: '1rem' }}>{error}</p>}
            <button
              onClick={nextStep} 
              className="btn btn-primary"
              disabled={loading || !formData.education || !formData.targetRole}
              style={{ opacity: (loading || !formData.education || !formData.targetRole) ? 0.5 : 1 }}
            >
              {loading ? 'Saving...' : 'Book Mentoring'} <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Assessment;
