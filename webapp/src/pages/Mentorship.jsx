import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Video, CheckCircle, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';

const Mentorship = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [matchedMentors, setMatchedMentors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // Simulate API call for mentors
    new Promise(resolve => setTimeout(resolve, 800))
      .then(() => {
        const mockMentors = [
          { id: 1, name: 'Dr. Sarah Chen', domain: 'Tech Leadership', experience: 12, explanation: 'Expert in transitioning junior engineers to senior roles.', matchPercentage: 98 },
          { id: 2, name: 'James Wilson', domain: 'System Design', experience: 8, explanation: 'Specializes in highly scalable architectures.', matchPercentage: 92 },
          { id: 3, name: 'Elena Rodriguez', domain: 'Frontend Architecture', experience: 10, explanation: 'React core contributor and UI/UX advocate.', matchPercentage: 88 }
        ];
        if (mounted) setMatchedMentors(mockMentors);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (confirmed) {
      const timer = setTimeout(() => {
        updateUserData({ hasCompletedAssessment: true });
        navigate('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [confirmed, navigate, updateUserData]);

  const handleConfirm = async () => {
    const mentor = matchedMentors.find((item) => item.id === selectedSlot);
    if (!mentor) return;

    setError('');
    try {
      const firstSlot = mentor.availability?.slots?.[0] || { day: 1, start: '10:00' };
      const nextSlot = new Date();
      const daysUntilSlot = (firstSlot.day - nextSlot.getUTCDay() + 7) % 7 || 7;
      nextSlot.setUTCDate(nextSlot.getUTCDate() + daysUntilSlot);
      const [hours, minutes] = firstSlot.start.split(':').map(Number);
      nextSlot.setUTCHours(hours, minutes, 0, 0);

      // Simulate booking API
      await new Promise(resolve => setTimeout(resolve, 500));

      setConfirmed(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSkip = () => {
    updateUserData({ hasCompletedAssessment: true });
    navigate('/dashboard');
  };

  return (
    <motion.div 
      className="container flex-center" 
      style={{ minHeight: '100vh', paddingBottom: '100px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '800px' }}>
        
        {!confirmed ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                <Video size={40} color="var(--accent-primary)" />
              </div>
              <h2 style={{ fontSize: '2.5rem' }}>Book Mentoring Session</h2>
              <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '10px' }}>
                Based on your interest in <strong style={{ color: 'var(--accent-primary)' }}>{userData?.targetRole || 'Tech'}</strong>, we found these specialized mentors for you:
              </p>
            </div>

            <div className="grid-cols-2">
              {loading && <p className="text-muted">Finding the best mentors...</p>}
              {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
              {matchedMentors.map((mentor) => (
                <motion.div 
                  key={mentor.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card"
                  style={{ 
                    cursor: 'pointer',
                    border: selectedSlot === mentor.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: selectedSlot === mentor.id ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                    boxShadow: selectedSlot === mentor.id ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  onClick={() => setSelectedSlot(mentor.id)}
                >
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '50%' }}>
                        <User size={24} color="var(--accent-primary)" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{mentor.name}</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>{mentor.domain} • {mentor.experience} yrs</p>
                      </div>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>{mentor.explanation}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>{mentor.matchPercentage}% match</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                        <Clock size={16} /> <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Next slot</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <button 
                className="btn btn-primary" 
                disabled={!selectedSlot}
                onClick={handleConfirm}
                style={{ opacity: selectedSlot ? 1 : 0.5, cursor: selectedSlot ? 'pointer' : 'not-allowed', width: '100%', maxWidth: '300px', padding: '14px' }}
              >
                Confirm & Start Consultation
              </button>
              
              <button 
                className="btn btn-secondary" 
                onClick={handleSkip}
                style={{ width: '100%', maxWidth: '300px', padding: '14px', background: 'transparent', border: 'none', textDecoration: 'underline', color: 'var(--text-muted)' }}
              >
                Skip Mentoring Session
              </button>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center', padding: '2rem 0' }}
          >
            <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Session Confirmed!</h2>
            <p className="text-muted" style={{ fontSize: '1.2rem' }}>Redirecting you to your Dashboard...</p>
          </motion.div>
        )}
        
      </div>
    </motion.div>
  );
};

export default Mentorship;
