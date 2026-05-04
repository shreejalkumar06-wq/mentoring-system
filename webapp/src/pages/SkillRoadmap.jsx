import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Briefcase, ArrowRight, BookOpen, Trophy, ExternalLink, X, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SkillRoadmap = () => {
  const { userData, updateUserData } = useAppContext();
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
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [identifiedGaps, setIdentifiedGaps] = useState([]);
  const [openTdbQuestions, setOpenTdbQuestions] = useState([]);

  useEffect(() => {
    // API mock removed
    setRoadmap(null);
  }, [userData.targetRole]);
  const role = userData.targetRole || 'Frontend Developer';

  const getOverallQuestions = (r) => {
    const questions = {
      'Frontend Developer': [
        { q: 'In React, what is the primary purpose of the useCallback hook?', options: ['To fetch data from an API', 'To memoize a callback function and prevent unnecessary re-renders', 'To manage global state', 'To directly mutate the DOM'], ans: 1, skill: 'Advanced React Hooks' },
        { q: 'Which CSS property is used to change the stacking order of elements?', options: ['z-index', 'position', 'display', 'float'], ans: 0, skill: 'CSS Fundamentals' },
        { q: 'What is a closure in JavaScript?', options: ['A function that is executed immediately', 'A method to close a browser window', 'A combination of a function bundled together with references to its surrounding state', 'A way to style hidden elements'], ans: 2, skill: 'JavaScript Core Concepts' }
      ],
      'Backend Developer': [
        { q: 'In Node.js, how does the event loop handle asynchronous operations?', options: ['By creating a new thread for each request', 'By offloading operations to the system kernel whenever possible', 'By blocking the main thread until the operation completes', 'By executing all asynchronous code synchronously'], ans: 1, skill: 'Node.js Event Loop' },
        { q: 'What is a primary characteristic of a RESTful API?', options: ['It maintains client state on the server between requests', 'It uses XML exclusively for data transfer', 'It is stateless, meaning each request contains all necessary information', 'It requires WebSockets for communication'], ans: 2, skill: 'RESTful API Design' },
        { q: 'Why might you use a database index?', options: ['To encrypt sensitive data', 'To automatically backup the database', 'To improve the speed of data retrieval operations', 'To compress the database size'], ans: 2, skill: 'Database Indexing' }
      ],
      'Data Scientist': [
        { q: 'In machine learning, what is the purpose of cross-validation?', options: ['To increase the training data size', 'To test the model\'s ability to predict new data that was not used in estimating it', 'To speed up the training process', 'To convert categorical variables into numerical values'], ans: 1, skill: 'Machine Learning Basics' },
        { q: 'Which Pandas method is commonly used to handle missing values by filling them?', options: ['dropna()', 'fillna()', 'replace()', 'isnull()'], ans: 1, skill: 'Pandas Data Analysis' },
        { q: 'What does a P-value indicate in hypothesis testing?', options: ['The probability of the null hypothesis being true', 'The probability of observing the data given the null hypothesis is true', 'The accuracy of the model', 'The variance of the sample'], ans: 1, skill: 'Statistical Analysis' }
      ],
      'Full Stack Developer': [
        { q: 'What is the primary advantage of using GraphQL over traditional REST APIs?', options: ['It is always faster', 'It automatically caches all requests', 'It prevents over-fetching and under-fetching of data by allowing the client to request exactly what it needs', 'It does not require a database'], ans: 2, skill: 'GraphQL Fundamentals' },
        { q: 'In a CI/CD pipeline, what does Continuous Integration primarily refer to?', options: ['Automatically deploying to production', 'Frequently committing code to a shared repository where it is automatically built and tested', 'Writing documentation for new features', 'Manually reviewing all pull requests'], ans: 1, skill: 'CI/CD Pipelines' },
        { q: 'What is the primary function of a Docker container?', options: ['To secure passwords', 'To act as a virtual machine with a full guest OS', 'To package an application and its dependencies into a standardized unit for software development', 'To host a database globally'], ans: 2, skill: 'Docker Containers' }
      ],
      "Don't know": [
        { q: 'What is the primary function of HTML in web development?', options: ['To style the webpage', 'To add interactivity', 'To define the structure and content of the webpage', 'To manage the database'], ans: 2, skill: 'Web Fundamentals' },
        { q: 'Which of the following is a backend programming language?', options: ['CSS', 'HTML', 'Python', 'React'], ans: 2, skill: 'Backend Fundamentals' },
        { q: 'What is a database?', options: ['A styling framework', 'An organized collection of structured information, or data', 'A type of web browser', 'A graphic design tool'], ans: 1, skill: 'Data Fundamentals' }
      ]
    };
    return questions[r] || questions["Don't know"];
  };

  const getProfessionalQuestions = (r) => {
    const questions = {
      'Frontend Developer': [
        { q: 'When optimizing Web Vitals, which metric does Server-Side Rendering (SSR) typically improve the most?', options: ['Cumulative Layout Shift (CLS)', 'First Contentful Paint (FCP)', 'Interaction to Next Paint (INP)', 'Time to First Byte (TTFB)'], ans: 1, skill: 'Web Performance' },
        { q: 'In a micro-frontend architecture, what is a common strategy for sharing state between loosely coupled applications?', options: ['Using a single Redux store', 'Custom browser events or a shared pub/sub event bus', 'Passing props through the DOM hierarchy', 'Using LocalStorage exclusively'], ans: 1, skill: 'System Architecture' },
      ],
      'Backend Developer': [
        { q: 'Which caching strategy is most appropriate for high-read, low-write data to minimize database hits?', options: ['Write-through cache', 'Cache-aside (Lazy loading)', 'Write-behind cache', 'No caching'], ans: 1, skill: 'System Architecture' },
        { q: 'In distributed systems, what does the CAP theorem state you must trade off during a network partition?', options: ['Consistency or Availability', 'Concurrency or Performance', 'Capacity or Authentication', 'Cost or Agility'], ans: 0, skill: 'Distributed Systems' }
      ]
    };
    const fallback = [
      { q: 'What is the most critical aspect of deploying a production-ready application?', options: ['Choosing the coolest framework', 'Implementing comprehensive monitoring and error tracking', 'Making sure the code is completely undocumented', 'Using only cutting-edge beta libraries'], ans: 1, skill: 'Production Readiness' },
      { q: 'In an Agile workflow, what is the primary purpose of a retrospective?', options: ['To blame team members for failures', 'To plan the next sprint', 'To reflect on the past sprint and identify areas for process improvement', 'To demonstrate the product to stakeholders'], ans: 2, skill: 'Agile Methodologies' }
    ];
    return questions[r] || fallback;
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

  const getDetailedRoadmap = (r) => {
    const roadmaps = {
      'Frontend Developer': {
        niche: 'Creative WebGL & 3D Web Architect',
        phases: [
          { level: 0, title: 'Web Fundamentals', skills: ['HTML5', 'CSS3', 'Vanilla JavaScript'] },
          { level: 1, title: 'Modern UI Engineering', skills: ['React', 'Tailwind CSS', 'State Management'] },
          { level: 2, title: 'Performance & Architecture', skills: ['Next.js SSR', 'Web Vitals Optimization', 'Micro-frontends'] },
          { level: 3, title: 'Creative WebGL & 3D Web Architect', skills: ['Three.js', 'WebGL Shaders', 'Advanced Animations', 'GLSL'] }
        ]
      },
      'Backend Developer': {
        niche: 'High-Concurrency Distributed Systems Architect',
        phases: [
          { level: 0, title: 'Server Fundamentals', skills: ['Node.js/Python', 'REST APIs', 'Basic SQL'] },
          { level: 1, title: 'Advanced Database & Caching', skills: ['PostgreSQL Tuning', 'Redis', 'GraphQL'] },
          { level: 2, title: 'Cloud & Infrastructure', skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines'] },
          { level: 3, title: 'High-Concurrency Distributed Systems Architect', skills: ['Event-driven Architecture', 'Kafka/RabbitMQ', 'System Design'] }
        ]
      },
      'Data Scientist': {
        niche: 'Generative AI & LLM Specialist',
        phases: [
          { level: 0, title: 'Data Analysis Basics', skills: ['Python', 'Pandas', 'Matplotlib'] },
          { level: 1, title: 'Machine Learning Core', skills: ['Scikit-Learn', 'Supervised/Unsupervised Learning', 'SQL'] },
          { level: 2, title: 'Deep Learning', skills: ['PyTorch/TensorFlow', 'Neural Networks', 'NLP'] },
          { level: 3, title: 'Generative AI & LLM Specialist', skills: ['Transformer Architectures', 'LLM Fine-tuning', 'RAG Pipelines'] }
        ]
      },
      'Full Stack Developer': {
        niche: 'Serverless Cloud Solutions Architect',
        phases: [
          { level: 0, title: 'Full Stack Basics', skills: ['MERN/PERN Stack', 'CRUD Operations', 'Auth'] },
          { level: 1, title: 'Advanced Full Stack', skills: ['Next.js', 'GraphQL', 'Prisma/ORMs'] },
          { level: 2, title: 'Cloud-Native Deployment', skills: ['AWS/GCP', 'Docker', 'Serverless Functions'] },
          { level: 3, title: 'Serverless Cloud Solutions Architect', skills: ['Edge Computing', 'Microservices', 'Infrastructure as Code'] }
        ]
      },
      "Don't know": {
         niche: 'General Tech Specialist',
         phases: [
           { level: 0, title: 'Tech Discovery', skills: ['Basic Web', 'Logic Building', 'Problem Solving'] },
           { level: 1, title: 'Core Programming', skills: ['Python/JS', 'Data Structures', 'Version Control'] },
           { level: 2, title: 'Domain Specialization', skills: ['Frontend/Backend/Data', 'Frameworks'] },
           { level: 3, title: 'General Tech Specialist', skills: ['System Architecture', 'Cross-domain Integration', 'Tech Leadership'] }
         ]
      }
    };
    
    return roadmaps[r] || roadmaps["Don't know"];
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

  const getCurrentQuestions = () => {
    if (activeSkill === 'opentdb') return openTdbQuestions;
    if (activeSkill === 'professional') return getProfessionalQuestions(role);
    return getOverallQuestions(role);
  };

  const fetchOpenTDB = async () => {
    setActiveSkill('opentdb');
    setTestPhase('opentdb-loading');
    try {
      // Category 18 = Science: Computers
      const res = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple');
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const formatted = data.results.map(q => {
          const options = [...q.incorrect_answers, q.correct_answer];
          options.sort(() => Math.random() - 0.5); // simple shuffle
          const ansIndex = options.indexOf(q.correct_answer);
          
          // Simple HTML decoder for entities like &quot;
          const decode = (str) => {
            const txt = document.createElement('textarea');
            txt.innerHTML = str;
            return txt.value;
          };

          return {
            q: decode(q.question),
            options: options.map(o => decode(o)),
            ans: ansIndex,
            skill: 'General Computer Science'
          };
        });
        setOpenTdbQuestions(formatted);
        setOverallQuestionIndex(0);
        setOverallScore(0);
        setTestPhase('overall-mcq');
      } else {
        alert("Could not load OpenTDB questions.");
        setTestPhase('choose');
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Open Trivia Database.");
      setTestPhase('choose');
    }
  };

  const handleOverallMCQAnswer = (idx) => {
    const questionsList = getCurrentQuestions();
    const currentQuestion = questionsList[overallQuestionIndex];
    
    if (idx === currentQuestion.ans) {
      setOverallScore(overallScore + 1);
    } else {
      if (currentQuestion.skill) {
        setIncorrectAnswers(prev => [...prev, currentQuestion.skill]);
      }
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
    
    // [API INTEGRATION POINT]: This is where we would use an API to evaluate the code snippet.
    // Example: const result = await api.post('/api/evaluate-code', { code: testCode, role: role });
    
    // Simulate grading delay
    setTimeout(() => {
      setIsSubmitting(false);
      setTestPhase('result');
      setUserLevel(prev => prev + 1);
      
      // Calculate final gaps based on MCQ and potential code evaluation.
      // We use the incorrect MCQ answers as our identified skill gaps.
      const newGaps = [...new Set(incorrectAnswers)];
      setIdentifiedGaps(newGaps);

      // Update global context so the dashboard sees the new score and gaps
      const currentScore = userData.levelScore || 0;
      const currentLevel = userData.currentLevel || 1;
      updateUserData({ 
        currentLevel: currentLevel + 1,
        levelScore: currentScore + 10, // Increase score by 10 points per passed test
        skillGaps: newGaps,
        testScores: [...(userData.testScores || []), { date: new Date().toISOString(), score: 10 }]
      });
      
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
      setIncorrectAnswers([]);
    }, 500);
  };

  const getIndustryTrends = (role) => {
    // [API INTEGRATION POINT]: Industry trends data would be fetched from a live API.
    // Example: const trends = await api.get(`/api/trends?role=${role}`);
    
    const trendsDB = {
      'Frontend Developer': [
        { trend: 'Server-Side Rendering & Next.js 14', impact: 'High', description: 'Shifting towards server components for improved performance and SEO.' },
        { trend: 'TypeScript Adoption', impact: 'Critical', description: 'Industry standard for large-scale applications; improves code maintainability.' },
        { trend: 'Micro-Frontends', impact: 'Medium', description: 'Splitting frontend monoliths into manageable, independently deployable pieces.' }
      ],
      'Backend Developer': [
        { trend: 'Serverless Architecture', impact: 'High', description: 'Using AWS Lambda or Vercel functions to reduce infrastructure management.' },
        { trend: 'GraphQL over REST', impact: 'Medium', description: 'Increasing preference for client-driven data fetching.' },
        { trend: 'Event-Driven Microservices', impact: 'High', description: 'Using Kafka or RabbitMQ for scalable, decoupled services.' }
      ],
      'Full Stack Developer': [
        { trend: 'Full-Stack Frameworks (Next.js, Remix)', impact: 'High', description: 'Blurring the line between frontend and backend boundaries.' },
        { trend: 'AI-Augmented Development', impact: 'Critical', description: 'Integrating LLMs (like GPT-4) into applications.' },
        { trend: 'Edge Computing', impact: 'Medium', description: 'Running code closer to the user to reduce latency.' }
      ],
      'Data Scientist': [
        { trend: 'Large Language Models (LLMs)', impact: 'Critical', description: 'Fine-tuning and deploying foundational generative models.' },
        { trend: 'MLOps', impact: 'High', description: 'Standardizing machine learning lifecycle, continuous training, and deployments.' },
        { trend: 'Explainable AI (XAI)', impact: 'Medium', description: 'Ensuring model decisions are transparent and understandable by humans.' }
      ],
      "Don't know": [
        { trend: 'AI & Automation', impact: 'Critical', description: 'Understanding how AI tools can enhance productivity across all tech roles.' },
        { trend: 'Cloud Native Technologies', impact: 'High', description: 'Applications are increasingly built natively for cloud environments.' }
      ]
    };
    
    return trendsDB[role] || trendsDB["Don't know"];
  };

  const getMockInterviewQuestions = (gaps) => {
    // [API INTEGRATION POINT]: AI-generated interview scenarios would be fetched dynamically based on gaps.
    // Example: const interviewQuestions = await api.post('/api/generate-interview', { gaps: gaps });
    
    if (!gaps || gaps.length === 0) {
      return [
        { q: "Tell me about a challenging project you've worked on recently.", hint: "Focus on your problem-solving process and the architecture." },
        { q: "How do you keep up with the latest industry trends?", hint: "Mention specific blogs, courses, or communities you follow actively." }
      ];
    }
    
    const mockDB = {
      'Advanced React Hooks': { q: "Can you explain a scenario where you would choose useCallback over useMemo?", hint: "Discuss function reference equality vs value memoization and re-renders." },
      'CSS Fundamentals': { q: "How would you implement a responsive layout without using a framework like Tailwind?", hint: "Discuss CSS Grid properties and media queries." },
      'JavaScript Core Concepts': { q: "Explain event delegation in JavaScript and why it is useful.", hint: "Discuss event bubbling and memory performance benefits." },
      'Node.js Event Loop': { q: "Can you describe the different phases of the Node.js event loop?", hint: "Mention timers, pending callbacks, poll, check, and close callbacks." },
      'RESTful API Design': { q: "How do you handle versioning in a RESTful API?", hint: "Discuss URI versioning vs Header versioning pros and cons." },
      'Database Indexing': { q: "What are the trade-offs of adding too many indexes to a database table?", hint: "Discuss read vs write performance impacts." },
      'Machine Learning Basics': { q: "Can you explain the difference between overfitting and underfitting?", hint: "Discuss bias-variance tradeoff and validation accuracy." },
      'Pandas Data Analysis': { q: "How do you handle large datasets in Pandas that don't fit into memory?", hint: "Mention chunking, optimized dtypes, or Dask." },
      'Statistical Analysis': { q: "How would you explain a p-value to a non-technical stakeholder?", hint: "Focus on practical significance vs statistical terminology." },
      'GraphQL Fundamentals': { q: "How do you handle N+1 query problems in GraphQL?", hint: "Discuss DataLoader and batching." },
      'Docker Containers': { q: "What is the difference between an Image and a Container in Docker?", hint: "Discuss static templates vs running instances." },
      'CI/CD Pipelines': { q: "How would you set up a basic CI pipeline for a Node.js application?", hint: "Mention GitHub Actions, installing dependencies, and running tests." },
      'Web Fundamentals': { q: "What is the difference between block and inline elements?", hint: "Discuss document flow and dimensional properties." },
      'Backend Fundamentals': { q: "Explain the difference between SQL and NoSQL databases.", hint: "Discuss structured vs unstructured data and horizontal scaling." },
      'Data Fundamentals': { q: "What is normalization in a database?", hint: "Discuss reducing data redundancy." }
    };
    
    return gaps.map(gap => mockDB[gap]).filter(Boolean);
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
        
        {/* Dynamic Skill Progress Bars */}
        <div style={{ maxWidth: '500px', margin: '0 auto 32px' }}>
          {(() => {
            const roadmapPhases = getDetailedRoadmap(role).phases;
            const currentPhase = roadmapPhases.find(p => p.level === userLevel) || roadmapPhases[roadmapPhases.length - 1];
            const colors = [
              'linear-gradient(90deg, #3b82f6, #60a5fa)', // Blue
              'linear-gradient(90deg, #10b981, #34d399)', // Green
              'linear-gradient(90deg, #f59e0b, #fbbf24)', // Orange
              'linear-gradient(90deg, #8b5cf6, #a78bfa)', // Purple
              'linear-gradient(90deg, #ec4899, #f472b6)', // Pink
            ];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '4px', textAlign: 'center' }}>
                  Skills required for {currentPhase.title}
                </h3>
                
                {/* Overall Progress Bar */}
                {(() => {
                  const allProgresses = currentPhase.skills.map(skill => {
                    const isGap = identifiedGaps.includes(skill);
                    return userLevel > currentPhase.level ? 100 : (isGap ? 15 : (userLevel > 0 ? 40 : 10));
                  });
                  const avgProgress = Math.round(allProgresses.reduce((a, b) => a + b, 0) / allProgresses.length);
                  return (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Overall Progress</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{avgProgress}%</span>
                      </div>
                      <div style={{ height: '14px', background: 'rgba(0,0,0,0.08)', borderRadius: '7px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${avgProgress}%` }}
                          transition={{ duration: 1, delay: 0.1 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, #1e293b, #475569)' }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {currentPhase.skills.map((skill, idx) => {
                  const isGap = identifiedGaps.includes(skill);
                  // Generate visual progress: 100% if past level, low if it's a gap, or a baseline starting point
                  const progress = userLevel > currentPhase.level ? 100 : (isGap ? 15 : (userLevel > 0 ? 40 : 10));
                  
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{skill}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{progress}%</span>
                      </div>
                      <div style={{ height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                          style={{ height: '100%', background: colors[idx % colors.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
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

      {/* Detailed Path to Expertise */}
      <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={24} color="var(--accent-secondary)" /> 
          Detailed Path to Expertise
        </h3>
        
        <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
          <p className="text-muted" style={{ marginBottom: '24px', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Based on your target of becoming a <strong>{role}</strong>, here is your specialized roadmap to reach the expert niche of <strong style={{ color: 'var(--accent-primary)' }}>{getDetailedRoadmap(role).niche}</strong>. Focus on mastering these skills at your current phase before moving to the next.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {getDetailedRoadmap(role).phases.map((phase, index) => {
              const isCurrent = userLevel === phase.level;
              const isPast = userLevel > phase.level;
              const isFuture = userLevel < phase.level;
              const roadmapPhases = getDetailedRoadmap(role).phases;
              
              return (
                <div key={index} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  {/* Timeline connector */}
                  {index < roadmapPhases.length - 1 && (
                     <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: '-20px', width: '2px', background: isPast ? 'var(--success)' : 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                  )}
                  
                  {/* Timeline dot */}
                  <div style={{ position: 'relative', zIndex: 1, marginTop: '4px' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      background: isCurrent ? 'var(--accent-primary)' : isPast ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${isCurrent ? 'var(--accent-secondary)' : isPast ? 'var(--success)' : 'rgba(255,255,255,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isPast || isCurrent ? '#fff' : 'var(--text-muted)'
                    }}>
                      {isPast ? <CheckCircle size={16} /> : <span style={{ fontWeight: 'bold' }}>{phase.level}</span>}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: '32px', opacity: isPast || isCurrent ? 1 : 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', color: isCurrent ? 'var(--accent-primary)' : isFuture ? 'var(--text-muted)' : 'var(--text-main)' }}>
                        {phase.title}
                      </h4>
                      {isCurrent && <span style={{ padding: '4px 10px', background: 'rgba(59,130,246,0.15)', color: 'var(--accent-primary)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500', border: '1px solid rgba(59,130,246,0.3)' }}>Current Level</span>}
                      {isPast && <span style={{ padding: '4px 10px', background: 'rgba(34,197,94,0.15)', color: 'var(--success)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500', border: '1px solid rgba(34,197,94,0.3)' }}>Completed</span>}
                      {phase.level === roadmapPhases[roadmapPhases.length - 1].level && (
                         <span style={{ padding: '4px 10px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500', border: '1px solid rgba(139,92,246,0.3)' }}>Expert Niche</span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {phase.skills.map((skill, sIdx) => (
                        <span key={sIdx} style={{ 
                          padding: '6px 14px', 
                          background: isPast ? 'rgba(34,197,94,0.08)' : isCurrent ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)', 
                          border: `1px solid ${isPast ? 'rgba(34,197,94,0.2)' : isCurrent ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.1)'}`, 
                          borderRadius: '20px', 
                          fontSize: '0.9rem',
                          color: isPast ? 'var(--success)' : isCurrent ? 'var(--text-main)' : 'var(--text-muted)'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Industry Trends & Mock Interview Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={24} color="var(--accent-primary)" /> 
          Industry Trends & Targeted Mock Interview
        </h3>
        
        {identifiedGaps.length > 0 ? (
          <div style={{ marginBottom: '1.5rem', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--error)' }}>
            <h4 style={{ margin: 0, color: 'var(--error)', marginBottom: '8px' }}>Identified Skill Gaps from Assessment</h4>
            <p className="text-muted" style={{ margin: 0 }}>Based on your recent test, we noticed you could brush up on: <strong>{identifiedGaps.join(', ')}</strong></p>
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem', padding: '16px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
            <h4 style={{ margin: 0, color: 'var(--success)', marginBottom: '8px' }}>Assessment Status</h4>
            <p className="text-muted" style={{ margin: 0 }}>Take the comprehensive assessment to identify your specific skill gaps and get targeted mock interview questions.</p>
          </div>
        )}

        <div className="grid-cols-2">
          {/* Trends Column */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
               Current {role} Trends
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              <em>[API INTEGRATION]: Live trends would be fetched here via <code>api.get('/industry-trends')</code></em>
            </p>
            {getIndustryTrends(role).map((trend, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{trend.trend}</strong>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: trend.impact === 'Critical' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)', color: trend.impact === 'Critical' ? '#fca5a5' : '#93c5fd' }}>{trend.impact}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{trend.description}</p>
              </div>
            ))}
          </div>

          {/* Mock Interview Column */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
               Targeted Mock Interview
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              <em>[API INTEGRATION]: AI questions would be fetched via <code>api.post('/generate-interview', &#123; gaps &#125;)</code></em>
            </p>
            {getMockInterviewQuestions(identifiedGaps).length > 0 ? getMockInterviewQuestions(identifiedGaps).map((q, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: '500' }}>Q: {q.q}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>💡 Hint: {q.hint}</p>
              </div>
            )) : (
               <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Take the assessment to generate questions targeting your weak points.</p>
               </div>
            )}
            
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <Link to="/jobs-interviews" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Practice Full Mock Interview <ArrowRight size={16} />
                </Link>
            </div>
          </div>
        </div>
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

                  <button 
                    onClick={() => { setActiveSkill('professional'); setTestPhase('overall-mcq'); }}
                    className="btn btn-primary"
                    style={{ textAlign: 'center', padding: '16px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', border: 'none', marginBottom: '16px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                  >
                    Take Professional Certification Test
                  </button>

                  <button 
                    onClick={fetchOpenTDB}
                    className="btn btn-primary"
                    style={{ textAlign: 'center', padding: '16px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', border: 'none', marginBottom: '16px', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
                  >
                    Take Open Trivia Database Challenge (Live API)
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
                <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.4rem', color: '#0f172a' }}>
                  {activeSkill === 'opentdb' ? 'Open Trivia Challenge' : (activeSkill === 'professional' ? 'Professional Certification' : 'Comprehensive Assessment')}
                </h3>
                <p style={{ marginBottom: '24px', color: '#64748b' }}>
                  Question {overallQuestionIndex + 1} of {getCurrentQuestions().length}
                </p>
                
                <h4 style={{ fontSize: '1.2rem', marginBottom: '24px', color: '#1e293b' }}>
                  {getCurrentQuestions()[overallQuestionIndex].q}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {getCurrentQuestions()[overallQuestionIndex].options.map((opt, idx) => (
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
                      ? (activeSkill === 'professional' 
                          ? `[PROFESSIONAL CHALLENGE]: Write a highly optimized, production-grade architectural design or advanced code snippet for a scalable ${role} feature.`
                          : activeSkill === 'opentdb'
                          ? `[TRIVIA BONUS]: Write a small "Hello World" or any cool snippet of code that shows off your passion for ${role}.`
                          : `Provide a robust, production-ready code snippet demonstrating a core concept relevant to ${role}. (e.g., A custom React hook, a complete Express route with error handling, etc.)`)
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
                  Great job! You answered the MCQ correctly and successfully demonstrated your coding knowledge for <strong>{activeSkill === 'overall' || activeSkill === 'professional' || activeSkill === 'opentdb' ? role : activeSkill}</strong>.
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
