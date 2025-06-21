import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
  });
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      // Get the current user's ID from localStorage
      const userId = localStorage.getItem('userId');
      
      // Prepare the payload with proper data types
      const payload = {
        title: form.title || null,
        description: form.description || null,
        mediaUrl: form.mediaUrl || null,
        instructorId: userId ? userId : null
      };

      console.log('Sending course creation request with payload:', payload);
      
      // Make the API request
      const response = await api.post('/Course', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Course created successfully:', response.data);
      
      // Reset the form and refresh the course list
      setForm({ title: '', description: '', mediaUrl: '' });
      await fetchCourses();
      
      // Show success message
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.title || 
                         'Failed to create course. Please check your input and try again.';
      
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/Course/${courseId}`);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. See console for details.');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 text-center">
        Manage Courses
      </h2>

      {/* Create Course Form */}
      <motion.form
        onSubmit={handleCreateCourse}
        className="space-y-4 mb-12 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl shadow-lg border dark:border-slate-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-300">
          Create New Course
        </h3>
        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 rounded border border-blue-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full px-4 py-2 rounded border border-blue-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Media URL"
          className="w-full px-4 py-2 rounded border border-blue-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.mediaUrl}
          onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
        />
        <button
          type="submit"
          className="w-full block mx-auto bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-900 hover:to-blue-600 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md"
        >
          ➕ Create Course
        </button>
      </motion.form>

      {/* Course Cards */}
      {courses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-slate-300">No courses found.</p>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {courses.map((course) => (
            <motion.div
              key={course.courseId}
              className="bg-white dark:bg-slate-800 p-5 border border-blue-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                {course.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                {course.description || 'No description'}
              </p>

              <div className="flex justify-between">
                <Link
                  to={`/courses/edit/${course.courseId}`}
                  className="text-sm text-blue-800 dark:text-blue-300 border-2 border-blue-800 dark:border-blue-300 rounded px-3 py-1 font-semibold hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => setCourseToDelete(course)}
                  className="text-sm text-red-600 border-2 border-red-600 hover:bg-red-50 dark:hover:bg-red-900 px-3 py-1 rounded shadow-sm transition font-medium"
                >
                  🗑 Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md shadow-xl border border-blue-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-blue-800 dark:text-white">
              Confirm Delete
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Are you sure you want to delete <strong>{courseToDelete.title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setCourseToDelete(null)}
                className="text-sm text-slate-600 hover:text-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(courseToDelete.courseId)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition font-medium"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CoursesPage;
