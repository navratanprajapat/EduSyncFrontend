import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Custom NavLink component for active state styling
const CustomNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
          ? 'text-white bg-blue-700'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }`
    }
  >
    {children}
  </NavLink>
);

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
      className="bg-gray-900 shadow-lg px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-2xl font-bold text-white">
            <span className="text-blue-400">Edu</span>Sync
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {role === 'Instructor' && (
            <>
              <CustomNavLink to="/dashboard">Dashboard</CustomNavLink>
              <CustomNavLink to="/courses">Courses</CustomNavLink>
              <CustomNavLink to="/assessments">Assessments</CustomNavLink>
              <CustomNavLink to="/results">Results</CustomNavLink>
            </>
          )}

          {role === 'Student' && (
            <>
              <CustomNavLink to="/dashboard">Dashboard</CustomNavLink>
              <CustomNavLink to="/student/courses">Courses</CustomNavLink>
              <CustomNavLink to="/student/results">My Results</CustomNavLink>
            </>
          )}

          <CustomNavLink to="/profile">Profile</CustomNavLink>
        </div>

        {name && (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300 hidden sm:inline-block">
              Welcome, {name.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
