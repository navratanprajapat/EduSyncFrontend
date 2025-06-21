import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem('role') || '');
      setName(localStorage.getItem('name') || '');
    };

    syncRole();
    window.addEventListener('storage', syncRole);
    return () => window.removeEventListener('storage', syncRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 shadow-md px-6 py-4 flex justify-between items-center rounded-b-xl"
    >
      <Link
        to="/dashboard"
        className="text-2xl font-extrabold"
      >
        <span className="text-blue-500">Edu</span><span className="text-white">Sync</span>
      </Link>
      <div className="flex items-center gap-5 text-sm font-semibold text-white">
        {role === 'Instructor' && (
          <>
            <Link to="/dashboard" className="hover:text-blue-700 dark:hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/courses" className="hover:text-blue-700 dark:hover:text-blue-400 transition">Courses</Link>
            <Link to="/assessments" className="hover:text-blue-700 dark:hover:text-blue-400 transition">Assessments</Link>
            <Link to="/results" className="hover:text-blue-700 dark:hover:text-blue-400 transition">Results</Link>
            <Link to="/students" className="hover:text-blue-700 dark:hover:text-blue-400 transition">Students</Link>
          </>
        )}

        {role === 'Student' && (
          <>
            <Link to="/dashboard" className="hover:text-blue-700 dark:hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/student/courses" className="hover:text-blue-700 dark:hover:text-blue-400 transition">Courses</Link>
            <Link to="/student/results" className="hover:text-blue-700 dark:hover:text-blue-400 transition">My Results</Link>
          </>
        )}

        {name && (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            className="ml-4 px-4 py-1.5 rounded-lg border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white font-medium transition shadow-md"
          >
            Logout
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
