import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Compass, UserCheck, Briefcase } from 'lucide-react';
import Spline3D from '../components/Spline3D';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    {
      id: 1,
      icon: <UserCheck size={32} color="var(--accent-primary)" />,
      title: 'Profile & Qualification',
      desc: 'Tell us about your background, current qualifications, and the career you are aiming for.',
      color: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 2,
      icon: <Target size={32} color="var(--accent-secondary)" />,
      title: 'Skill Assessment',
      desc: 'We analyze your current qualifications against industry standards to find your skill gaps.',
      color: 'rgba(139, 92, 246, 0.1)'
    },
    {
      id: 3,
      icon: <Compass size={32} color="var(--success)" />,
      title: 'Personalized Roadmap',
      desc: 'Get a clear, step-by-step learning path to bridge your skill gaps and reach your target role.',
      color: 'rgba(16, 185, 129, 0.1)'
    },
    {
      id: 4,
      icon: <Briefcase size={32} color="var(--warning)" />,
      title: 'Project Building',
      desc: 'Apply your new skills to real-world projects and build a portfolio that stands out.',
      color: 'rgba(245, 158, 11, 0.1)'
    },
    {
      id: 5,
      icon: <Target size={32} color="var(--accent-primary)" />,
      title: 'Interview Prep',
      desc: 'Practice with mock interviews tailored to your target role and get constructive feedback.',
      color: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 6,
      icon: <Compass size={32} color="var(--success)" />,
      title: 'Career Placement',
      desc: 'Connect directly with hiring managers and companies looking for your specific skill set.',
      color: 'rgba(16, 185, 129, 0.1)'
    }
  ];

  return (
    <motion.div 
      className="container flex-center" 
      style={{ minHeight: '100vh', paddingBottom: '100px', paddingTop: '60px', position: 'relative' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ 
          scale: 1.05, 
          y: -2,
          filter: "drop-shadow(0px 8px 12px rgba(29, 78, 216, 0.3))" 
        }}
        whileTap={{ scale: 0.95 }}
        style={{ 
          position: 'absolute',
          top: '30px',
          left: '20px',
          fontSize: '1.4rem', 
          fontWeight: 800, 
          color: 'var(--accent-primary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          cursor: 'pointer'
        }}
      >
        <Briefcase size={26} />
        <span className="text-gradient" style={{ letterSpacing: '-0.5px' }}>Career Pilot AI</span>

      </motion.div>

      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', marginBottom: '4rem', flexDirection: 'row', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
            <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
              <span className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Your Personal Career Mentor
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
              Bridge the Gap Between <br/> <span className="text-gradient">Learning & Earning</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '600px' }}>
              This platform helps you understand exactly where you stand. By sharing your current qualifications and goals, we generate a personalized roadmap and provide expert mentorship to guide you to your dream career. No intimidating coding tests—just clear, actionable guidance.
            </motion.p>
            
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <motion.button 
                  className="btn btn-primary" 
                  style={{ padding: '16px 40px', fontSize: '1.2rem', borderRadius: '30px' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Journey <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants} 
            style={{ flex: '1', minWidth: '300px', height: '500px', position: 'relative' }}
          >
            <Spline3D />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} style={{ textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>How It Works</h2>
          <div className="grid-cols-2" style={{ gap: '20px' }}>
            {features.map((feature) => (
              <motion.div 
                key={feature.id}
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '20px',
                  transform: activeFeature === feature.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  borderColor: activeFeature === feature.id ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div style={{ background: feature.color, padding: '16px', borderRadius: '16px', flexShrink: 0 }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.3rem' }}>{feature.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Details / Mission Section */}
        <motion.div variants={itemVariants} style={{ textAlign: 'left', marginTop: '6rem', padding: '3rem', background: '#ffffff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="text-gradient">Our Mission</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              We noticed a massive gap between what is taught in traditional college education and what the modern tech industry actually requires. Many students graduate with theoretical knowledge but lack the practical, hands-on skills that employers are looking for today.
            </p>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <strong>Our project aims to solve this problem.</strong> We are building a Smart Mentoring & Employability Assessment platform that focuses on your actual career aspirations, not just your grades. By skipping intimidating coding tests and focusing purely on your current qualifications and interests, we provide a stress-free environment to discover your true potential.
            </p>
            <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Through personalized roadmaps, direct mentorship from industry experts, and curated project recommendations, we guide you step-by-step from being a student to becoming a highly employable professional. Your journey to your dream career starts here.
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Home;
