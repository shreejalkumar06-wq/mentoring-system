import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ProjectSystem = () => {
  const { userData } = useAppContext();
  const [activeTab, setActiveTab] = useState('available');
  const [projects, setProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [error, setError] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    // Simulate API fetch for projects based on career
    setProjects([
      { id: 1, title: 'Personal Portfolio', level: 'Beginner', skills_required: ['HTML', 'CSS', 'React'], description: 'Build a responsive personal website.' },
      { id: 2, title: 'Interactive To-Do App', level: 'Beginner', skills_required: ['React', 'State Management'], description: 'A classic project to master React state.' },
      { id: 3, title: 'E-commerce API', level: 'Intermediate', skills_required: ['Node.js', 'Express', 'MongoDB'], description: 'Build a REST API for a store.' }
    ]);
    setUserProjects([]);
  }, [userData.id, userData.targetRole]);

  const completedProjectIds = new Set(userProjects.filter((item) => item.status === 'completed').map((item) => item.project_id));
  const visibleProjects = projects
    .map((project) => ({
      ...project,
      difficulty: project.level,
      tags: project.skills_required || [],
      status: completedProjectIds.has(project.id) ? 'completed' : 'available',
      desc: project.description
    }))
    .filter((project) => project.status === activeTab || (activeTab === 'available' && project.status !== 'completed'));

  const handleSubmit = async (project) => {
    const submissionLink = window.prompt('Paste your project link');
    if (!submissionLink) return;
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserProjects(prev => [...prev, { project_id: project.id, status: 'completed' }]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: '80px', paddingBottom: '120px' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
          <Briefcase size={40} color="var(--accent-primary)" />
        </div>
        <h1 style={{ fontSize: '2.5rem' }}>Project <span className="text-gradient">Showcase</span></h1>
        <p className="text-muted">Apply your learned skills to real-world projects and build your portfolio.</p>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '3rem' }}>
        <button 
          className={`btn ${activeTab === 'available' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('available')}
        >
          Available Projects
        </button>
        <button 
          className={`btn ${activeTab === 'in-progress' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress
        </button>
        <button 
          className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid-cols-2" style={{ marginBottom: '5rem' }}>
        {error && <div style={{ gridColumn: '1 / -1', color: 'var(--error)' }}>{error}</div>}
        {visibleProjects.map(project => (
          <div key={project.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{project.title}</h3>
                <span className={`badge ${project.difficulty === 'Beginner' ? 'badge-success' : project.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-primary'}`}>
                  {project.difficulty}
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '16px' }}>{project.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {activeTab === 'completed' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 500 }}>
                <CheckCircle size={18} /> Evaluated & Added to Resume
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => handleSubmit(project)} style={{ flex: 1, padding: '10px' }}>
                  Submit Project <ArrowRight size={16} />
                </button>
                <button className="btn btn-secondary" style={{ padding: '10px' }}>
                  <ExternalLink size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
        {visibleProjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No projects found in this category.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectSystem;
