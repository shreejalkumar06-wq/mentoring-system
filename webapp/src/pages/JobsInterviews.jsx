import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building, MapPin, IndianRupee, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const JobsInterviews = () => {
  const { userData } = useAppContext();
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const role = userData?.targetRole || 'Frontend Developer';


  // Job Placements Data
  const getPlacements = () => {
    const allJobs = [
      { id: 101, company: 'TechFlow Innovations', position: 'Junior Frontend Engineer', location: 'Remote', salary: '₹6 LPA - ₹8 LPA', tags: ['Frontend Developer', 'Full Stack Developer'], logo: 'TF' },
      { id: 102, company: 'DataSphere Analytics', position: 'Data Science Intern', location: 'New Delhi, DL', salary: '₹20,000/mo', tags: ['Data Scientist'], logo: 'DS' },
      { id: 103, company: 'CloudNet Systems', position: 'Backend Developer', location: 'Bangalore, KA', salary: '₹8 LPA - ₹12 LPA', tags: ['Backend Developer', 'Full Stack Developer'], logo: 'CN' },
      { id: 104, company: 'CreativeWeb Agency', position: 'UI/UX Developer', location: 'Remote', salary: '₹5 LPA - ₹7 LPA', tags: ['Frontend Developer'], logo: 'CW' },
      { id: 105, company: 'AI Core Labs', position: 'Machine Learning Engineer', location: 'Hyderabad, TS', salary: '₹15 LPA - ₹25 LPA', tags: ['Data Scientist'], logo: 'AI' }
    ];

    const matched = allJobs.filter(job => job.tags.includes(role));
    return matched.length > 0 ? matched : allJobs.slice(0, 2);
  };

  // Mock Interview Questions Data
  const getInterviewQuestions = () => {
    const questionsDB = {
      'Frontend Developer': [
        { id: 1, q: 'Can you explain the difference between CSS Flexbox and CSS Grid?', a: 'Flexbox is designed for 1D layouts (either a row or a column), whereas CSS Grid is for 2D layouts (rows and columns simultaneously). Use Flexbox for alignment and Grid for complex layouts.' },
        { id: 2, q: 'What is the Virtual DOM in React and why is it useful?', a: 'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to figure out what exactly changed in the UI, and only updates those specific nodes in the real DOM, making rendering much faster.' },
        { id: 3, q: 'Explain event delegation in JavaScript.', a: 'Event delegation is a technique where you attach a single event listener to a parent element instead of multiple listeners to individual child elements. It leverages event bubbling.' }
      ],
      'Backend Developer': [
        { id: 1, q: 'What is the difference between REST and GraphQL?', a: 'REST uses multiple endpoints to return fixed data structures. GraphQL uses a single endpoint and allows the client to specify exactly what data they want, preventing over-fetching or under-fetching.' },
        { id: 2, q: 'Can you explain the Node.js Event Loop?', a: 'The Event Loop is what allows Node.js to perform non-blocking I/O operations despite being single-threaded. It offloads operations to the system kernel whenever possible.' },
        { id: 3, q: 'How would you prevent SQL Injection attacks?', a: 'By always using parameterized queries or prepared statements. Never directly concatenate user input into a SQL query string.' }
      ],
      'Data Scientist': [
        { id: 1, q: 'What is overfitting and how can you prevent it?', a: 'Overfitting happens when a model learns the training data too well, including its noise, and performs poorly on new data. It can be prevented using techniques like cross-validation, regularization, and pruning.' },
        { id: 2, q: 'Explain the difference between Type I and Type II errors.', a: 'Type I error is a False Positive (rejecting a true null hypothesis). Type II error is a False Negative (failing to reject a false null hypothesis).' },
        { id: 3, q: 'What is the curse of dimensionality?', a: 'As the number of features (dimensions) increases, the amount of data needed to generalize accurately grows exponentially, and distance metrics lose their usefulness.' }
      ],
      'default': [
        { id: 1, q: 'Tell me about a time you solved a complex problem.', a: 'Use the STAR method: Situation, Task, Action, Result. Focus on what YOU specifically did and the positive outcome.' },
        { id: 2, q: 'Where do you see yourself in 5 years?', a: 'Align your personal career goals with the potential growth opportunities within the company you are interviewing for.' }
      ]
    };

    return questionsDB[role] || questionsDB['default'];
  };

  const placements = matchedJobs.length
    ? matchedJobs.map((job) => ({
        id: job.id,
        company: job.companyName,
        position: job.role,
        location: `${job.matchPercentage}% match`,
        salary: job.salaryRange,
        logo: job.companyName?.slice(0, 2).toUpperCase() || 'CO'
      }))
    : getPlacements();
  const questions = getInterviewQuestions();

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: '80px', paddingBottom: '120px', maxWidth: '900px' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Jobs & <span className="text-gradient">Interviews</span></h1>
        <p className="text-muted">Opportunities and mock questions tailored for your journey as a {role}.</p>
      </motion.div>

      {/* Career Placements Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <Briefcase size={28} color="var(--accent-primary)" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Matched Opportunities</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {placements.map(job => (
            <motion.div 
              key={job.id} 
              className="glass-card"
              whileHover={{ x: 5 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}>
                  {job.logo}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{job.position}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building size={16} /> {job.company}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}><IndianRupee size={16} /> {job.salary}</span>
                  </div>
                </div>
              </div>
              <div>
                <button className="btn btn-primary" style={{ padding: '10px 24px' }}>Apply Now</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mock Interview Section */}
      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <MessageSquare size={28} color="var(--accent-secondary)" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Mock Interview Questions</h2>
        </div>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Practice these common technical and behavioral questions asked in {role} interviews.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((q) => (
            <div 
              key={q.id} 
              className="glass-card" 
              style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
            >
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expandedQuestion === q.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{q.q}</h4>
                {expandedQuestion === q.id ? <ChevronUp size={20} color="var(--accent-primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
              </div>
              
              <motion.div 
                initial={false}
                animate={{ height: expandedQuestion === q.id ? 'auto' : 0, opacity: expandedQuestion === q.id ? 1 : 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 20px 20px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '5px' }}>
                  <strong>How to answer:</strong> {q.a}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default JobsInterviews;
