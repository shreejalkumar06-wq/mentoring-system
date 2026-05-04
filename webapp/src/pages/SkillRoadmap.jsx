import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Briefcase, ArrowRight, BookOpen, Trophy, ExternalLink, X, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SkillRoadmap = () => {
  const { userData } = useAppContext();
  const [roadmap, setRoadmap] = useState(null);
  
  // Test State
  const [testPhase, setTestPhase] = useState(null); // 'choose', 'mcq', 'code', 'result'
  const [activeSkill, setActiveSkill] = useState(null);
  const [overallQuestionIndex, setOverallQuestionIndex] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [testCode, setTestCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLevel, setUserLevel] = useState(0);

  useEffect(() => {
    // API mock removed
    setRoadmap(null);
  }, [userData.targetRole]);
  const role = userData.targetRole || 'Frontend Developer';

  const getOverallQuestions = (r) => {
    const questions = {
      'Frontend Developer': [
        { q: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], ans: 1 },
        { q: 'Which is a React hook?', options: ['useFetch', 'useRender', 'useState', 'useData'], ans: 2 },
        { q: 'What does HTML describe?', options: ['Styling', 'Structure', 'Logic', 'Database'], ans: 1 }
      ],
      'Backend Developer': [
        { q: 'What is Node.js?', options: ['A web browser', 'A JS runtime', 'A database', 'A styling framework'], ans: 1 },
        { q: 'Which is a NoSQL database?', options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'], ans: 2 },
        { q: 'What does API stand for?', options: ['Application Programming Interface', 'Apple Programming Interface', 'Application Process Integration', 'Advanced Programming Interface'], ans: 0 }
      ],
      'Data Scientist': [
        { q: 'Which language is most popular for Data Science?', options: ['Java', 'Python', 'C++', 'Ruby'], ans: 1 },
        { q: 'What is Pandas?', options: ['An animal', 'A data analysis library', 'A web framework', 'A database'], ans: 1 },
        { q: 'What does ML stand for?', options: ['Machine Logic', 'Making Lists', 'Machine Learning', 'Model Learning'], ans: 2 }
      ],
      'Full Stack Developer': [
        { q: 'What connects Frontend and Backend?', options: ['CSS', 'API', 'HTML', 'Database'], ans: 1 },
        { q: 'Which of these is a full stack framework?', options: ['Next.js', 'React', 'Express', 'Tailwind'], ans: 0 },
        { q: 'Where is user data typically permanently stored?', options: ['Browser Memory', 'Redux', 'Database', 'Local Storage'], ans: 2 }
      ],
      "Don't know": [
        { q: 'What is a browser?', options: ['A search engine', 'Software to view web pages', 'A type of computer', 'An internet provider'], ans: 1 },
        { q: 'What does a Frontend Developer do?', options: ['Builds servers', 'Designs databases', 'Builds user interfaces', 'Analyzes data'], ans: 2 },
        { q: 'What does a Data Scientist do?', options: ['Builds websites', 'Analyzes complex data', 'Fixes computers', 'Writes CSS'], ans: 1 }
      ]
    };
    return questions[r] || questions["Don't know"];
  };

  const getSkillChallenge = (skillTitle) => {
    const challenges = {
      'Advanced React Hooks': {
        mcq: { q: 'What does the useEffect dependency array do?', options: ['Controls when the effect runs', 'Stores state variables', 'Renders HTML', 'Validates props'], ans: 0 },
        code: 'Write a custom hook `useDebounce(value, delay)` that debounces a fast-changing value.'
      },
      'CSS Grid & Flexbox': {
        mcq: { q: 'Which CSS property creates a Flexbox container?', options: ['display: block', 'display: flex', 'align-items: center', 'float: left'], ans: 1 },
        code: 'Write the CSS to center a child div both vertically and horizontally using Grid.'
      },
      'TypeScript Basics': {
        mcq: { q: 'How do you define an optional property in an interface?', options: ['prop!:', 'prop?:', 'prop*:', 'optional prop:'], ans: 1 },
        code: 'Write an interface `User` with an optional `age` property and a required `name` string.'
      },
      'Web Accessibility (a11y)': {
        mcq: { q: 'What attribute is used to provide alternative text for images?', options: ['title', 'src', 'alt', 'aria-hidden'], ans: 2 },
        code: 'Write an accessible button component in HTML that includes aria-labels.'
      },
      'Node.js Event Loop': {
        mcq: { q: 'Which phase of the event loop executes setTimeout callbacks?', options: ['Poll', 'Check', 'Timers', 'Close Callbacks'], ans: 2 },
        code: 'Explain or write a code snippet demonstrating the difference between setTimeout and setImmediate.'
      },
      'RESTful API Design': {
        mcq: { q: 'Which HTTP method is typically used to completely replace a resource?', options: ['GET', 'POST', 'PATCH', 'PUT'], ans: 3 },
        code: 'Write an Express route that handles a PUT request to update a user by ID.'
      },
      'Database Indexing': {
        mcq: { q: 'What is the primary benefit of a database index?', options: ['Reduces storage space', 'Speeds up data retrieval', 'Encrypts data', 'Creates backups automatically'], ans: 1 },
        code: 'Write a SQL query to create an index on the `email` column of a `users` table.'
      },
      'Authentication (JWT)': {
        mcq: { q: 'What are the three parts of a JWT?', options: ['Header, Payload, Signature', 'User, Password, Salt', 'Token, Secret, Hash', 'Data, Key, Value'], ans: 0 },
        code: 'Write a Node.js function snippet that signs a payload into a JWT using a secret key.'
      },
      'GraphQL Fundamentals': {
        mcq: { q: 'What problem does GraphQL primarily solve compared to REST?', options: ['Slower database queries', 'Over-fetching and under-fetching', 'Lack of encryption', 'CSS styling issues'], ans: 1 },
        code: 'Write a GraphQL query to fetch a user\'s name and their list of friends.'
      },
      'Docker Containers': {
        mcq: { q: 'Which file defines the instructions to build a Docker image?', options: ['docker-compose.yml', '.dockerignore', 'Dockerfile', 'package.json'], ans: 2 },
        code: 'Write a simple Dockerfile for a Node.js application.'
      },
      'CI/CD Pipelines': {
        mcq: { q: 'What does CI stand for?', options: ['Continuous Integration', 'Code Inspection', 'Centralized Infrastructure', 'Computer Intelligence'], ans: 0 },
        code: 'Write a GitHub Actions YAML snippet to run `npm test` on push to main.'
      },
      'Next.js Routing': {
        mcq: { q: 'How do you create a dynamic route in Next.js App Router?', options: ['[id].js', 'id.js', 'dynamic-id.js', '_id.js'], ans: 0 },
        code: 'Write a Next.js file structure path for a dynamic blog post route.'
      },
      'Pandas Data Analysis': {
        mcq: { q: 'Which Pandas method is used to view the first 5 rows of a DataFrame?', options: ['first()', 'top()', 'head()', 'start()'], ans: 2 },
        code: 'Write a Pandas snippet to group a DataFrame `df` by "category" and calculate the mean.'
      },
      'Machine Learning Basics': {
        mcq: { q: 'Which of these is a supervised learning algorithm?', options: ['K-Means Clustering', 'Linear Regression', 'PCA', 'Autoencoders'], ans: 1 },
        code: 'Write a scikit-learn snippet to instantiate and fit a Random Forest Classifier.'
      },
      'Data Visualization': {
        mcq: { q: 'Which Python library is widely used for creating static visualizations?', options: ['NumPy', 'TensorFlow', 'Matplotlib', 'Keras'], ans: 2 },
        code: 'Write a matplotlib snippet to plot a simple line chart from two arrays x and y.'
      },
      'SQL for Data Science': {
        mcq: { q: 'Which SQL clause is used to filter records after a GROUP BY?', options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'], ans: 1 },
        code: 'Write a SQL query to find the top 3 highest paid employees in a department.'
      }
    };
    
    const fallback = {
      mcq: { q: 'What is the primary purpose of this skill?', options: ['Design', 'Development', 'Analysis', 'Testing'], ans: 1 },
      code: 'Write a brief code snippet or explanation demonstrating your knowledge of this skill.'
    };
    
    return challenges[skillTitle] || fallback;
  };

  const getSkillsToLearn = () => {
    const skillsDB = {
      'Frontend Developer': [
        { title: 'Advanced React Hooks', desc: 'Deep dive into useEffect, useCallback, and custom hooks.', url: 'https://react.dev/reference/react' },
        { title: 'CSS Grid & Flexbox', desc: 'Master modern CSS layout systems for responsive design.', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout' },
        { title: 'TypeScript Basics', desc: 'Add static typing to your JavaScript for better code quality.', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
        { title: 'Web Accessibility (a11y)', desc: 'Learn how to make your websites usable for everyone.', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' }
      ],
      'Backend Developer': [
        { title: 'Node.js Event Loop', desc: 'Understand the core of asynchronous programming in Node.', url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/' },
        { title: 'RESTful API Design', desc: 'Learn best practices for designing scalable REST APIs.', url: 'https://restfulapi.net/' },
        { title: 'Database Indexing', desc: 'Optimize your SQL queries for faster data retrieval.', url: 'https://use-the-index-luke.com/' },
        { title: 'Authentication (JWT)', desc: 'Secure your APIs using JSON Web Tokens.', url: 'https://jwt.io/introduction' }
      ],
      'Full Stack Developer': [
        { title: 'GraphQL Fundamentals', desc: 'Learn how to query exactly what you need with GraphQL.', url: 'https://graphql.org/learn/' },
        { title: 'Docker Containers', desc: 'Understand containerization for consistent environments.', url: 'https://docs.docker.com/get-started/' },
        { title: 'CI/CD Pipelines', desc: 'Automate your testing and deployment workflows.', url: 'https://docs.github.com/en/actions' },
        { title: 'Next.js Routing', desc: 'Master server-side rendering and static site generation.', url: 'https://nextjs.org/docs' }
      ],
      'Data Scientist': [
        { title: 'Pandas Data Analysis', desc: 'Master data manipulation and analysis with Python.', url: 'https://pandas.pydata.org/docs/getting_started/index.html' },
        { title: 'Machine Learning Basics', desc: 'Introduction to supervised and unsupervised learning.', url: 'https://scikit-learn.org/stable/tutorial/basic/tutorial.html' },
        { title: 'Data Visualization', desc: 'Create compelling charts using Matplotlib and Seaborn.', url: 'https://matplotlib.org/stable/tutorials/index.html' },
        { title: 'SQL for Data Science', desc: 'Advanced data extraction and aggregation techniques.', url: 'https://mode.com/sql-tutorial/' }
      ],
      "Don't know": [
        { title: 'Explore Web Development', desc: 'See if building websites and apps is the right path for you.', url: 'https://developer.mozilla.org/en-US/docs/Learn' },
        { title: 'Explore Data Science', desc: 'Discover how analyzing data can solve real-world problems.', url: 'https://www.kaggle.com/learn' },
        { title: 'Explore UI/UX Design', desc: 'Learn about creating beautiful, user-centric interfaces.', url: 'https://www.nngroup.com/articles/' },
        { title: 'Explore Cloud Computing', desc: 'Understand the basics of AWS, Azure, and cloud architecture.', url: 'https://aws.amazon.com/getting-started/' }
      ]
    };
    return skillsDB[role] || skillsDB["Don't know"];
  };

  const getRecommendedProjects = () => {
    const projectsDB = {
      'Frontend Developer': [
        { title: 'Personal Portfolio', desc: 'A perfect starting point. Build a responsive website to showcase your future work.' },
        { title: 'Interactive To-Do App', desc: 'Learn state management and CRUD operations with this classic beginner project.' },
        { title: 'Weather Dashboard', desc: 'Fetch data from an external API and display it beautifully.' },
        { title: 'E-commerce Storefront', desc: 'Build a shopping cart system with complex state and routing.' }
      ],
      'Backend Developer': [
        { title: 'REST API for E-commerce', desc: 'Build a secure API with authentication and database integration.' },
        { title: 'Real-time Chat Server', desc: 'Implement WebSockets for real-time bidirectional communication.' },
        { title: 'URL Shortener', desc: 'Create a scalable microservice to shorten and redirect URLs.' },
        { title: 'Authentication System', desc: 'Implement OAuth, JWT, and email verification.' }
      ],
      'Full Stack Developer': [
        { title: 'Full Stack Blog', desc: 'Create a complete blog with a React frontend and Node/Express backend.' },
        { title: 'Task Management Board', desc: 'Build a Kanban board with drag-and-drop and persistent storage.' },
        { title: 'Social Media Clone', desc: 'Implement user profiles, posts, and real-time notifications.' },
        { title: 'Food Delivery App', desc: 'Handle complex data flows between customers, restaurants, and drivers.' }
      ],
      'Data Scientist': [
        { title: 'Housing Price Predictor', desc: 'Train a regression model on a real-world dataset to predict prices.' },
        { title: 'Customer Segmentation', desc: 'Use clustering algorithms to group users based on purchasing behavior.' },
        { title: 'Sentiment Analysis', desc: 'Build an NLP model to classify movie reviews as positive or negative.' },
        { title: 'Stock Market Forecaster', desc: 'Use time-series analysis to predict future stock movements.' }
      ],
      "Don't know": [
        { title: 'HTML/CSS Landing Page', desc: 'Dip your toes into code by building a simple, static webpage.' },
        { title: 'Basic Data Analysis in Excel/Python', desc: 'Analyze a fun dataset (like sports stats) to see if you enjoy data.' },
        { title: 'Figma App Prototype', desc: 'Design a mobile app interface without writing a single line of code.' },
        { title: 'Simple Discord Bot', desc: 'Write a basic script to respond to messages in a chat server.' }
      ]
    };
    return projectsDB[role] || projectsDB["Don't know"];
  };

  const skills = roadmap?.phases?.map((phase) => ({
    title: `${phase.level}: ${phase.focus}`,
    desc: phase.skills?.join(', ') || '',
    url: 'https://developer.mozilla.org/'
  })) || getSkillsToLearn();
  const recommendedProjects = getRecommendedProjects();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const handleMCQAnswer = (idx) => {
    const challenge = getSkillChallenge(activeSkill);
    if (idx === challenge.mcq.ans) {
      setTestPhase('code');
    } else {
      alert("Incorrect answer. Please try again to proceed to the coding portion.");
    }
  };

  const handleOverallMCQAnswer = (idx) => {
    const questionsList = getOverallQuestions(role);
    let newScore = overallScore;
    if (idx === questionsList[overallQuestionIndex].ans) {
      newScore = overallScore + 1;
      setOverallScore(newScore);
    }
    
    if (overallQuestionIndex < questionsList.length - 1) {
      setOverallQuestionIndex(overallQuestionIndex + 1);
    } else {
      setTestPhase('overall-code');
    }
  };

  const handleSubmitAssessment = () => {
    if (!testCode.trim()) return;
    setIsSubmitting(true);
    // Simulate grading delay
    setTimeout(() => {
      setIsSubmitting(false);
      setTestPhase('result');
      setUserLevel(prev => prev + 1);
    }, 1500);
  };

  const closeTest = () => {
    setTestPhase(null);
    setTimeout(() => {
      setActiveSkill(null);
      setTestCode('');
      setIsSubmitting(false);
      setOverallQuestionIndex(0);
      setOverallScore(0);
    }, 500);
  };

  return (
    <motion.div 
      className="container" 
      style={{ paddingTop: '80px', paddingBottom: '120px', maxWidth: '800px' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Your <span className="text-gradient">Career Roadmap</span></h1>
        <p className="text-muted">Target Role: <strong style={{ color: 'var(--text-main)' }}>{role}</strong></p>
      </motion.div>

      {/* Current Level Section */}
      <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '32px', marginBottom: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1 }}>
          <Trophy size={200} color="var(--accent-primary)" />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-muted)' }}>Current Evaluated Level</h2>
        <div style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.05)', padding: '16px 32px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{userLevel > 0 ? `${role} (Level ${userLevel})` : 'Current Path'}</span>
        </div>
        
        {/* Progress Bar */}
        <div style={{ maxWidth: '400px', margin: '0 auto 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Level 0</span>
            <span>Level 1</span>
          </div>
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: userLevel > 0 ? '100%' : '10%' }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {userLevel > 0 ? 'You have reached Level 1!' : 'Take a test to establish your baseline level'}
          </p>
        </div>
        
        <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 24px', fontSize: '1.05rem' }}>
          Follow the roadmap phases below and submit assessments/projects to raise your level score.
        </p>
        
        <button 
          className="btn btn-primary" 
          style={{ padding: '14px 28px', fontSize: '1.1rem', opacity: userLevel > 0 ? 0.5 : 1 }}
          onClick={() => { if (userLevel === 0) setTestPhase('choose'); }}
          disabled={userLevel > 0}
        >
          {userLevel > 0 ? <><CheckCircle size={20} /> Ranked Up!</> : <><Play size={20} /> Take Skill Test to Level Up</>}
        </button>
      </motion.div>

      {/* Skills to Learn Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={24} color="var(--accent-secondary)" /> 
          Skills to Learn Next
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {skills.map((skill, index) => (
            <div key={index} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(139, 92, 246, 0.05)' }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: '8px' }}>{skill.title}</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>{skill.desc}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={skill.url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '8px 16px' }}>
                  Learn <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Projects Section */}
      <motion.div variants={itemVariants}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={24} color="var(--success)" /> 
          Recommended Projects for your Level
        </h3>
        
        <div className="grid-cols-2">
          {recommendedProjects.map((project, index) => (
            <div key={index} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0 }}>{project.title}</h4>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>{project.desc}</p>
              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <Link to="/projects" className="btn btn-secondary" style={{ width: '100%' }}>
                  View Project Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Multi-Phase Skill Assessment Modal */}
      {testPhase && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '600px', padding: '30px', position: 'relative', background: '#ffffff', color: '#1e293b', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          >
            <button onClick={closeTest} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            
            {testPhase === 'choose' && (
              <>
                <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.4rem', color: '#0f172a' }}>Select a Skill to Test</h3>
                <p style={{ marginBottom: '24px', color: '#64748b' }}>Take an overall role assessment, or choose a specific skill to test.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={() => { setActiveSkill('overall'); setTestPhase('overall-mcq'); }}
                    className="btn btn-primary"
                    style={{ textAlign: 'center', padding: '16px', fontSize: '1.05rem', background: '#3b82f6', color: '#ffffff', border: 'none', marginBottom: '16px' }}
                  >
                    Take Comprehensive Role Assessment
                  </button>

                  <h4 style={{ margin: '8px 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Or test an individual skill:</h4>
                  {skills.map(s => (
                    <button 
                      key={s.title}
                      onClick={() => { setActiveSkill(s.title); setTestPhase('mcq'); }}
                      className="btn btn-secondary"
                      style={{ textAlign: 'left', padding: '16px', fontSize: '1rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </>
            )}

            {testPhase === 'mcq' && activeSkill && activeSkill !== 'overall' && (
              <>
                <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.4rem', color: '#0f172a' }}>Part 1: Multiple Choice</h3>
                <p style={{ marginBottom: '24px', color: '#64748b' }}>Skill: <strong>{activeSkill}</strong></p>
                
                <h4 style={{ fontSize: '1.2rem', marginBottom: '24px', color: '#1e293b' }}>{getSkillChallenge(activeSkill).mcq.q}</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {getSkillChallenge(activeSkill).mcq.options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleMCQAnswer(idx)}
                      className="btn btn-secondary"
                      style={{ textAlign: 'left', padding: '16px', fontSize: '1rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {testPhase === 'overall-mcq' && (
              <>
                <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.4rem', color: '#0f172a' }}>Comprehensive Assessment</h3>
                <p style={{ marginBottom: '24px', color: '#64748b' }}>Question {overallQuestionIndex + 1} of {getOverallQuestions(role).length}</p>
                
                <h4 style={{ fontSize: '1.2rem', marginBottom: '24px', color: '#1e293b' }}>{getOverallQuestions(role)[overallQuestionIndex].q}</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {getOverallQuestions(role)[overallQuestionIndex].options.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleOverallMCQAnswer(idx)}
                      className="btn btn-secondary"
                      style={{ textAlign: 'left', padding: '16px', fontSize: '1rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {(testPhase === 'code' || testPhase === 'overall-code') && activeSkill && (
              <>
                <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.4rem', color: '#0f172a' }}>Part 2: Coding Challenge</h3>
                <p style={{ marginBottom: '24px', color: '#64748b' }}>{testPhase === 'overall-code' ? 'Role: ' + role : 'Skill: ' + activeSkill}</p>
                
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '24px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Prompt:</h4>
                  <p style={{ marginTop: '8px', marginBottom: 0, color: '#334155' }}>
                    {testPhase === 'overall-code' 
                      ? 'Provide a robust code snippet demonstrating a core concept relevant to your selected role.'
                      : getSkillChallenge(activeSkill).code}
                  </p>
                </div>
                
                <textarea 
                  className="input-field"
                  placeholder="Write your code snippet or explanation here..."
                  style={{ width: '100%', minHeight: '150px', fontFamily: 'monospace', padding: '16px', marginBottom: '24px', resize: 'vertical', background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1' }}
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                />
                
                <button 
                  onClick={handleSubmitAssessment} 
                  className="btn btn-primary" 
                  disabled={isSubmitting || !testCode.trim()}
                  style={{ width: '100%', padding: '14px', opacity: (isSubmitting || !testCode.trim()) ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Evaluating Code...' : 'Submit Final Assessment'}
                </button>
              </>
            )}

            {testPhase === 'result' && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle size={80} color="#22c55e" style={{ margin: '0 auto 20px' }} />
                </motion.div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#0f172a' }}>Assessment Passed!</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '24px', color: '#64748b' }}>
                  Great job! You answered the MCQ correctly and successfully demonstrated your coding knowledge for <strong>{activeSkill === 'overall' ? role : activeSkill}</strong>.
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '30px' }}>
                  Your overall employability level has increased!
                </p>
                <button onClick={closeTest} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                  Return to Roadmap
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default SkillRoadmap;
