import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../lib/api';
import Spline3D from '../components/Spline3D';

const Signup = () => {
  const navigate = useNavigate();
  const { updateUserData } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [mode, setMode] = useState('signup');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call for hackathon demo since there is no backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = {
        token: 'mock_token_123',
        user: {
          id: 1,
          name: formData.name || 'Test User',
          email: formData.email,
          target_career: '',
          skills: [],
          onboarding_complete: false
        }
      };

      localStorage.setItem('careerPlatformToken', result.token);
      updateUserData({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        token: result.token,
        targetRole: result.user.target_career || '',
        skills: result.user.skills || [],
        isLoggedIn: true,
        hasCompletedAssessment: Boolean(result.user.onboarding_complete)
      });
      navigate(result.user.onboarding_complete ? '/dashboard' : '/assessment');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 0,
          pointerEvents: 'auto'
        }}
      >
        <Spline3D scene="https://prod.spline.design/x8cqzwZl1E9AmRbz/scene.splinecode" />
      </div>

      <motion.div 
        className="container flex-center" 
        style={{ minHeight: '100vh', paddingBottom: '100px', position: 'relative', zIndex: 1, pointerEvents: 'none' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '500px', pointerEvents: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{mode === 'signup' ? 'Create Account' : 'Log In'}</h2>
          <p className="text-muted">Join the platform and start your journey.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && <div className="input-group">
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                style={{ paddingLeft: '48px' }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="john@example.com" 
                style={{ paddingLeft: '48px' }}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                style={{ paddingLeft: '48px' }}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          {error && <p style={{ color: 'var(--error)', marginTop: '1rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', padding: '14px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : 'Continue to Assessment'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}{' '}
            <span
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}
            >
              {mode === 'signup' ? 'Log in here' : 'Create one'}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default Signup;
