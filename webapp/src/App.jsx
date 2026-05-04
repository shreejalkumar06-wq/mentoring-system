import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, LayoutDashboard, FileText, CheckCircle } from 'lucide-react';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Assessment from './pages/Assessment';
import Mentorship from './pages/Mentorship';
import Dashboard from './pages/Dashboard';
import SkillRoadmap from './pages/SkillRoadmap';
import ProjectSystem from './pages/ProjectSystem';
import JobsInterviews from './pages/JobsInterviews';
import AIChatAssistant from './components/AIChatAssistant';
import { AppProvider, useAppContext } from './context/AppContext';
import Spline3D from './components/Spline3D';

const Navigation = () => {
  const location = useLocation();
  const { logout } = useAppContext();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/roadmap', label: 'Roadmap', icon: FileText },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/jobs-interviews', label: 'Jobs & Mock', icon: CheckCircle },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '250px',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      boxShadow: '4px 0 24px rgba(0, 0, 0, 0.02)'
    }}>
      <div 
        onClick={() => {
          logout();
          window.location.href = '/';
        }}
        style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}
      >
        <motion.div 
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            filter: "drop-shadow(0px 8px 12px rgba(29, 78, 216, 0.3))" 
          }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            padding: '0 16px', 
            fontSize: '1.4rem', 
            fontWeight: 800, 
            color: 'var(--accent-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Briefcase size={26} />
          <span className="text-gradient" style={{ letterSpacing: '-0.5px' }}>Career Pilot AI</span>
        </motion.div>
      </div>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-main)',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 600 : 500
              }}
            >
              <Icon size={22} style={{ color: isActive ? 'white' : 'var(--text-muted)' }} />
              <span style={{ fontSize: '1rem' }}>{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { userData } = useAppContext();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={userData?.hasCompletedAssessment ? <Navigate to="/dashboard" replace /> : userData?.isLoggedIn ? <Navigate to="/assessment" replace /> : <Home />} />
        <Route path="/signup" element={userData?.isLoggedIn ? <Navigate to="/assessment" replace /> : <Signup />} />
        <Route path="/assessment" element={userData?.hasCompletedAssessment ? <Navigate to="/dashboard" replace /> : <Assessment />} />
        <Route path="/mentorship" element={userData?.hasCompletedAssessment ? <Navigate to="/dashboard" replace /> : <Mentorship />} />
        <Route path="/dashboard" element={!userData?.hasCompletedAssessment ? <Navigate to="/assessment" replace /> : <Dashboard />} />
        <Route path="/roadmap" element={!userData?.hasCompletedAssessment ? <Navigate to="/assessment" replace /> : <SkillRoadmap />} />
        <Route path="/projects" element={!userData?.hasCompletedAssessment ? <Navigate to="/assessment" replace /> : <ProjectSystem />} />
        <Route path="/jobs-interviews" element={!userData?.hasCompletedAssessment ? <Navigate to="/assessment" replace /> : <JobsInterviews />} />
      </Routes>
    </AnimatePresence>
  );
};

const MainLayout = () => {
  const location = useLocation();
  
  // Hide sidebar during onboarding flow
  const hiddenRoutes = ['/', '/signup', '/assessment', '/mentorship'];
  const hideSidebar = hiddenRoutes.includes(location.pathname);

  return (
    <div className="page-wrapper" style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
      {/* Global 3D Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'auto' }}>
        <Spline3D scene="https://prod.spline.design/vrCrzAatwcSn1sBK/scene.splinecode" />
      </div>
      {/* Light overlay to ensure text visibility */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(2px)' }}></div>

      
      {!hideSidebar && <Navigation />}
      
      <main style={{ 
        marginLeft: hideSidebar ? '0' : '250px', 
        flex: 1, 
        minHeight: '100vh', 
        width: hideSidebar ? '100%' : 'calc(100% - 250px)',
        transition: 'margin 0.3s ease'
      }}>
        <AnimatedRoutes />
        <AIChatAssistant />
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout />
      </Router>
    </AppProvider>
  );
}

export default App;
