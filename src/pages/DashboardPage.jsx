import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  BarChart2,
  LayoutGrid,
  UserCircle,
} from 'lucide-react';

const styles = {
  page: {
    padding: '32px 24px',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    marginBottom: 40,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(240,249,255,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(30, 58, 138, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
    padding: '24px 32px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '140px',
    height: '140px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0) 70%)',
    borderRadius: '0 0 0 100%',
    zIndex: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: 800,
    background: 'linear-gradient(to right, #1e40af, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 12,
    letterSpacing: '-0.02em',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 500,
    color: '#64748b',
    lineHeight: 1.6,
    marginBottom: 0,
  },
  nameHighlight: {
    fontWeight: 700,
    color: '#1e40af',
  },
  brandHighlight: {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 600,
  },
  timeGreeting: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 6,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  roleTag: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    background: 'linear-gradient(to right, #1e40af, #3b82f6)',
    color: 'white',
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 8,
    letterSpacing: '0.03em',
    boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)',
  },
  eduText: {
    color: '#3b82f6',
    fontWeight: 700,
  },
  syncText: {
    color: '#1e293b',
    fontWeight: 700,
  },
  dateText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  dateIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTextContent: {
    marginLeft: 6,
  },
  grid: {
    display: 'grid',
    gap: 24,
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    marginTop: 30,
  },
  cardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
    background: 'white',
    transition: 'all 0.3s ease',
    transform: 'perspective(1000px) rotateX(0deg)',
  },
  card: {
    padding: '28px 24px 24px',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    color: '#1e293b',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
  },
  cardHover: {
    transform: 'perspective(1000px) rotateX(2deg)',
    boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.12)',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 20,
    position: 'relative',
  },
  colorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, var(--main-color) 0%, var(--secondary-color) 100%)',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--main-color)',
    border: '2px solid var(--main-color)',
    marginTop: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
    background: 'linear-gradient(90deg, var(--main-color) 0%, var(--secondary-color) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
  },
  desc: {
    fontSize: 14,
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

};

const DashboardPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('name') || '');
    setRole(localStorage.getItem('role') || '');
  }, []);
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 18) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  const getCardColor = (index) => {
    const colors = [
      { main: '#3b82f6', secondary: '#60a5fa', border: '#dbeafe' },
      { main: '#8b5cf6', secondary: '#a78bfa', border: '#ede9fe' },
      { main: '#ec4899', secondary: '#f472b6', border: '#fce7f3' },
    ];
    return colors[index % colors.length];
  };

  const dashboardCards = {
    Instructor: [
      {
        to: '/courses',
        label: 'Manage Courses',
        icon: <BookOpen size={28} color="#fff" />,
        color: getCardColor(0),
      },
      {
        to: '/assessments',
        label: 'Manage Assessments',
        icon: <ClipboardCheck size={28} color="#fff" />,
        color: getCardColor(1),
      },
      {
        to: '/results',
        label: 'View Results',
        icon: <BarChart2 size={28} color="#fff" />,
        color: getCardColor(2),
      },
    ],
    Student: [
      {
        to: '/student/courses',
        label: 'Browse Courses',
        icon: <LayoutGrid size={28} color="#fff" />,
        color: getCardColor(0),
      },
      {
        to: '/student/results',
        label: 'My Results',
        icon: <BarChart2 size={28} color="#fff" />,
        color: getCardColor(1),
      },
      {
        to: '/profile',
        label: 'My Profile',
        icon: <UserCircle size={28} color="#fff" />,
        color: getCardColor(2),
      },
    ],
  };

  return (
    <div style={styles.page}>
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={styles.headerDecoration}></div>
        <div style={styles.headerContent}>
          <motion.p 
            style={styles.timeGreeting}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {getTimeBasedGreeting()}
          </motion.p>
          
          <motion.h1 
            style={styles.heading}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Welcome back, <span style={styles.nameHighlight}>{name || 'User'}</span>
          </motion.h1>
          
          <motion.p 
            style={styles.subheading}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Your <span style={styles.eduText}>Edu</span><span style={styles.syncText}>Sync</span> dashboard is ready.
            <span style={styles.roleTag}>{role || 'Student'}</span>
          </motion.p>
          
          <motion.div 
            style={styles.dateText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span style={styles.dateIcon}>📅</span>
            <span style={styles.dateTextContent}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </motion.div>
        </div>
      </motion.div>

      <div style={styles.grid}>
        {(dashboardCards[role] || []).map((item, i) => (
          <motion.div
            key={item.to}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            style={{
              ...styles.cardWrapper,
              '--main-color': item.color.main,
              '--secondary-color': item.color.secondary,
              '--border-color': item.color.border,
            }}
          >
            <Link
              to={item.to}
              style={styles.card}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, styles.cardHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, { 
                  transform: 'perspective(1000px) rotateX(0deg)', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)'
                })
              }
            >
              <div style={styles.colorBar}></div>

              <div style={styles.cardContent}>
                <div style={styles.iconContainer}>
                  {React.cloneElement(item.icon, { color: item.color.main, size: 26 })}
                </div>
                <div>
                  <h2 style={styles.label}>{item.label}</h2>
                  <p style={styles.desc}>Click to open</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
