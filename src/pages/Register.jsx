import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Password: '',
    Role: 'Student',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Ensure form data matches backend expectations
      const registrationData = {
        name: form.Name,
        email: form.Email,
        password: form.Password,
        role: form.Role
      };
      
      const response = await api.post('/Auth/register', registrationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess('Registration successful! You can now log in.');
      
      // Clear form
      setForm({
        Name: '',
        Email: '',
        Password: '',
        Role: 'Student',
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white">
            <h2 className="text-3xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-blue-100">Join <span className="text-blue-200">Edu</span><span className="text-white">Sync</span> today</p>
          </div>
          
          <div className="px-6 py-5">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 text-green-600 p-3 rounded-lg border border-green-200 text-sm">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-0.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.Name}
                  onChange={(e) => setForm({ ...form, Name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition duration-200 outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-0.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.Email}
                  onChange={(e) => setForm({ ...form, Email: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition duration-200 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-0.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.Password}
                  onChange={(e) => setForm({ ...form, Password: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition duration-200 outline-none"
                  placeholder="Choose a secure password"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-0.5">
                  Role
                </label>
                <select
                  id="role"
                  value={form.Role}
                  onChange={(e) => setForm({ ...form, Role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition duration-200 outline-none cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </motion.button>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          {new Date().getFullYear()} EduSync. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
