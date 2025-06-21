import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 border-t border-slate-700 mt-10 shadow-inner"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-white">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="font-semibold"
        >
          © {new Date().getFullYear()} EduSync LMS
        </motion.span>{' '}
        — All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
