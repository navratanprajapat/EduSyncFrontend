import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const StudentAssessmentListPage = () => {
  const { courseId } = useParams();
  const [assessments, setAssessments] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;

    const fetchAssessments = async () => {
      try {
        const res = await api.get('/Assessments');
        const filtered = res.data.filter(a => a.courseId === courseId);
        setAssessments(filtered);
      } catch (err) {
        console.error('Failed to fetch assessments', err);
      }
    };

    const fetchCourseTitle = async () => {
      try {
        const res = await api.get(`/Course/${courseId}`);
        setCourseTitle(res.data.title || 'Course');
      } catch (err) {
        console.error('Course title fetch failed', err);
      }
    };

    fetchCourseTitle();
    fetchAssessments();
  }, [courseId]);

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 text-center">
        Assessments for: {courseTitle}
      </h2>

      {assessments.length === 0 ? (
        <p className="text-center text-blue-700 dark:text-blue-300">
          No assessments found for this course.
        </p>
      ) : (
        <motion.ul
          className="grid gap-6 md:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {assessments.map((a) => (
            <motion.li
              key={a.assessmentId}
              className="p-5 bg-blue-50 dark:bg-slate-800 rounded-2xl shadow-md border border-blue-100 dark:border-slate-700 transition hover:shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                {a.title}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                🎯 Max Score: {a.maxScore}
              </p>

              <button
                onClick={() => navigate(`/student/assessments/${a.assessmentId}/take`)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white py-2 rounded-md text-sm font-semibold transition shadow"
              >
                Take Assessment
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default StudentAssessmentListPage;
