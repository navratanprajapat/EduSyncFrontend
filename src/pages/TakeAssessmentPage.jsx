import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const TakeAssessmentPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    if (!token) throw new Error('No authentication token found. Please log in again.');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const parseFormattedQuestions = (questionText) => {
    if (!questionText?.trim()) return [];
    const questionBlocks = questionText.split('\n\n').filter(b => b.trim() !== '');
    return questionBlocks.map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l !== '');
      if (lines.length < 3) return null;
      const question = lines[0].replace(/^Q\d+:\s*/, '');
      const options = lines.find(l => l.startsWith('Options:'))?.replace(/^Options:\s*/, '').split(',').map(o => o.trim());
      const answer = lines.find(l => l.startsWith('Answer:'))?.replace(/^Answer:\s*/, '').trim();
      if (!question || !options || !answer) return null;
      return { questionText: question, options, correctAnswer: answer };
    }).filter(Boolean);
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        const res = await api.get(`/Assessments/${id}`, { headers });
        setAssessment(res.data);
        let parsed = [];
        try {
          parsed = JSON.parse(res.data.question);
          if (!Array.isArray(parsed)) parsed = [];
        } catch {
          parsed = parseFormattedQuestions(res.data.question);
        }
        setQuestions(parsed);
        setStartTime(Date.now());
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You don’t have permission to access this assessment.');
        } else {
          setError(err.message || 'Failed to load assessment.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssessment();
  }, [id]);

  const handleOptionSelect = (qIndex, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    if (submitted || questions.length === 0) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const calculatedScore = Math.round((correct / questions.length) * assessment.maxScore);
    setScore(calculatedScore);
    setSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const resultData = {
      assessmentId: assessment.assessmentId,
      assessmentTitle: assessment.title,
      score: calculatedScore,
      maxScore: assessment.maxScore,
      timeTaken,
      attemptDate: new Date().toISOString(),
      questions: questions.length,
      correctAnswers: correct
    };
    try {
      const existing = JSON.parse(localStorage.getItem('userResults') || '[]');
      existing.push(resultData);
      localStorage.setItem('userResults', JSON.stringify(existing));
    } catch {}
    try {
      const headers = getAuthHeaders();
      await api.post('/Results', {
        assessmentId: assessment.assessmentId,
        userId: localStorage.getItem('userId'),
        score: calculatedScore,
        attemptDate: new Date().toISOString(),
        timeTaken,
      }, { headers });
      setResultSubmitted(true);
    } catch {
      setResultSubmitted(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded hover:from-red-700 hover:to-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500">
        {assessment.title}
      </h2>

      {submitted && (
        <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl shadow mb-6 text-center">
          <p className="text-lg text-green-600 dark:text-green-400 font-semibold">
            🎉 You scored <strong>{score}</strong> / {assessment.maxScore}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ⏱️ Time Taken: {Math.floor((Date.now() - startTime) / 1000)} seconds
          </p>
          {!resultSubmitted && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
              ℹ️ Result saved locally (backend submission may require instructor permissions)
            </p>
          )}
          <button
            onClick={() => navigate('/student/results')}
            className="mt-4 bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-900 hover:to-blue-600 text-white py-2 px-5 rounded-lg font-semibold shadow"
          >
            View My Results
          </button>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="text-center py-12 text-slate-600 dark:text-slate-400">
          <p className="text-lg mb-2">No questions found for this assessment.</p>
          <p className="text-sm">Please contact your instructor.</p>
        </div>
      ) : (
        <form className="space-y-6">
          {questions.map((q, index) => {
            const selected = answers[index];
            const isCorrect = selected === q.correctAnswer;
            return (
              <div
                key={index}
                className={`p-5 rounded-xl shadow border ${
                  submitted
                    ? isCorrect
                      ? 'bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700'
                      : 'bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700'
                    : 'bg-gradient-to-br from-white via-blue-50 to-blue-100 border-blue-200 dark:from-slate-800 dark:to-slate-700 dark:border-slate-700'
                }`}
              >
                <h3 className="font-medium mb-3 text-blue-800 dark:text-blue-300">
                  Q{index + 1}. {q.questionText}
                </h3>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className={`flex items-center gap-2 text-sm cursor-pointer ${
                        submitted && option === q.correctAnswer
                          ? 'text-green-700 dark:text-green-300'
                          : submitted && option === selected && option !== q.correctAnswer
                          ? 'text-red-600 dark:text-red-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        disabled={submitted}
                        checked={selected === option}
                        onChange={() => handleOptionSelect(index, option)}
                        className="accent-blue-600"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {submitted && selected !== q.correctAnswer && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Correct Answer: <strong>{q.correctAnswer}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </form>
      )}

      {!submitted && questions.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length === 0}
          className={`mt-8 mx-auto block px-6 py-2 rounded-lg font-semibold shadow transition ${
            Object.keys(answers).length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-900 hover:to-blue-600 text-white'
          }`}
        >
          Submit Assessment
        </button>
      )}
    </motion.div>
  );
};

export default TakeAssessmentPage;
