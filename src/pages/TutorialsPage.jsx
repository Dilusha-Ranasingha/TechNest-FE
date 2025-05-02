import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import TutorialCard from '../components/common/TutorialCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function TutorialsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { action, tutorialId } = useParams(); // For routes like /tutorials/edit/:tutorialId or /tutorials/manage-mcqs/:tutorialId
  const [tutorials, setTutorials] = useState([]);
  const [enrollments, setEnrollments] = useState([]); // For users to track enrolled tutorials
  const [tutorialForm, setTutorialForm] = useState({ title: '', description: '' }); // For creating/updating tutorials
  const [mcqForm, setMcqForm] = useState({ question: '', options: ['', '', '', ''], correctAnswer: '' }); // For creating/updating MCQs
  const [mcqs, setMcqs] = useState([]); // For managing MCQs in a tutorial

  useEffect(() => {
    if (!user) {
      navigate(user?.role === 'ADMIN' ? '/admin/login' : '/user/login');
      return;
    }

    const fetchTutorials = async () => {
      try {
        const endpoint = user.role === 'ADMIN' ? '/api/admin/quizzes/tutorials' : '/api/user/quizzes/tutorials';
        const response = await axios.get(`http://localhost:8080${endpoint}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTutorials(response.data);
      } catch (error) {
        Swal.fire({
          title: 'Failed to load tutorials',
          icon: 'error',
          draggable: true
        });
      }
    };

    const fetchEnrollments = async () => {
      if (user.role === 'USER') {
        try {
          const response = await axios.get('http://localhost:8080/api/user/quizzes/dashboard', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const enrolledTutorials = response.data.map(progress => progress.tutorialId);
          setEnrollments(enrolledTutorials);
        } catch (error) {
          Swal.fire({
            title: 'Failed to load enrollments',
            icon: 'error',
            draggable: true
          });
        }
      }
    };

    const fetchMcqs = async () => {
      if (action === 'manage-mcqs' && tutorialId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/admin/quizzes/tutorials`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const tutorial = response.data.find(t => t.id === parseInt(tutorialId));
          setMcqs(tutorial?.mcqs || []);
        } catch (error) {
          Swal.fire({
            title: 'Failed to load MCQs',
            icon: 'error',
            draggable: true
          });
        }
      }
    };

    const fetchTutorialForEdit = async () => {
      if (action === 'edit' && tutorialId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/admin/quizzes/tutorials`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const tutorial = response.data.find(t => t.id === parseInt(tutorialId));
          if (tutorial) {
            setTutorialForm({ title: tutorial.title, description: tutorial.description });
          }
        } catch (error) {
          Swal.fire({
            title: 'Failed to load tutorial',
            icon: 'error',
            draggable: true
          });
        }
      }
    };

    fetchTutorials();
    fetchEnrollments();
    fetchMcqs();
    fetchTutorialForEdit();
  }, [user, navigate, action, tutorialId]);

  const handleTutorialSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = action === 'edit'
        ? `/api/admin/quizzes/tutorials/${tutorialId}`
        : '/api/admin/quizzes/tutorials';
      const method = action === 'edit' ? 'put' : 'post';
      const response = await axios[method](`http://localhost:8080${endpoint}`, tutorialForm, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      Swal.fire({
        title: action === 'edit' ? 'Tutorial Updated' : 'Tutorial Created',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true
      });
      navigate('/tutorials');
      setTutorials(prev => action === 'edit'
        ? prev.map(t => t.id === parseInt(tutorialId) ? response.data : t)
        : [...prev, response.data]);
    } catch (error) {
      Swal.fire({
        title: action === 'edit' ? 'Failed to update tutorial' : 'Failed to create tutorial',
        icon: 'error',
        draggable: true
      });
    }
  };

  const handleDeleteTutorial = async (tutorialId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/quizzes/tutorials/${tutorialId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTutorials(prev => prev.filter(t => t.id !== tutorialId));
    } catch (error) {
      Swal.fire({
        title: 'Failed to delete tutorial',
        icon: 'error',
        draggable: true
      });
    }
  };

  const handleEnroll = async (tutorialId) => {
    try {
      await axios.post(`http://localhost:8080/api/user/quizzes/tutorials/${tutorialId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEnrollments(prev => [...prev, tutorialId]);
      Swal.fire({
        title: 'Enrolled Successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true
      });
    } catch (error) {
      Swal.fire({
        title: 'Failed to enroll',
        icon: 'error',
        draggable: true
      });
    }
  };

  const handleMcqSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/admin/quizzes/tutorials/${tutorialId}/mcqs`, {
        question: mcqForm.question,
        options: mcqForm.options,
        correctAnswer: mcqForm.correctAnswer
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMcqs(prev => [...prev, response.data]);
      setMcqForm({ question: '', options: ['', '', '', ''], correctAnswer: '' });
      Swal.fire({
        title: 'MCQ Created',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true
      });
    } catch (error) {
      Swal.fire({
        title: 'Failed to create MCQ',
        icon: 'error',
        draggable: true
      });
    }
  };

  const handleDeleteMcq = async (mcqId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/quizzes/tutorials/${tutorialId}/mcqs/${mcqId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMcqs(prev => prev.filter(mcq => mcq.id !== mcqId));
      Swal.fire({
        title: 'MCQ Deleted',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        draggable: true
      });
    } catch (error) {
      Swal.fire({
        title: 'Failed to delete MCQ',
        icon: 'error',
        draggable: true
      });
    }
  };

  if (action === 'edit' || action === 'new') {
    return (
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">
          {action === 'edit' ? 'Edit Tutorial' : 'Create New Tutorial'}
        </h2>
        <form onSubmit={handleTutorialSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={tutorialForm.title}
              onChange={(e) => setTutorialForm({ ...tutorialForm, title: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
            <textarea
              id="description"
              value={tutorialForm.description}
              onChange={(e) => setTutorialForm({ ...tutorialForm, description: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
          >
            {action === 'edit' ? 'Update Tutorial' : 'Create Tutorial'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tutorials')}
            className="w-full mt-2 p-3 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  if (action === 'manage-mcqs') {
    return (
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Manage MCQs for Tutorial</h2>
        <button
          onClick={() => navigate('/tutorials')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Tutorials
        </button>
        {/* MCQ Creation Form */}
        <form onSubmit={handleMcqSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="mb-4">
            <label htmlFor="question" className="block text-gray-300 mb-2">Question</label>
            <input
              type="text"
              id="question"
              value={mcqForm.question}
              onChange={(e) => setMcqForm({ ...mcqForm, question: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          {mcqForm.options.map((option, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`option-${index}`} className="block text-gray-300 mb-2">Option {index + 1}</label>
              <input
                type="text"
                id={`option-${index}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...mcqForm.options];
                  newOptions[index] = e.target.value;
                  setMcqForm({ ...mcqForm, options: newOptions });
                }}
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
          ))}
          <div className="mb-4">
            <label htmlFor="correctAnswer" className="block text-gray-300 mb-2">Correct Answer</label>
            <input
              type="text"
              id="correctAnswer"
              value={mcqForm.correctAnswer}
              onChange={(e) => setMcqForm({ ...mcqForm, correctAnswer: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-cyan-500 text-white font-semibold hover:bg-cyan-600"
          >
            Add MCQ
          </button>
        </form>
        {/* MCQ List */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">MCQs</h3>
          {mcqs.length > 0 ? (
            <div className="space-y-4">
              {mcqs.map(mcq => (
                <div key={mcq.id} className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300"><strong>Question:</strong> {mcq.question}</p>
                  <p className="text-gray-300"><strong>Options:</strong> {mcq.options.join(', ')}</p>
                  <p className="text-gray-300"><strong>Correct Answer:</strong> {mcq.correctAnswer}</p>
                  <button
                    onClick={() => handleDeleteMcq(mcq.id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No MCQs found for this tutorial.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Tutorials</h2>
      {user.role === 'ADMIN' && (
        <Link
          to="/tutorials/new"
          className="inline-block mb-6 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
        >
          Create New Tutorial
        </Link>
      )}
      <div className="grid gap-6">
        {tutorials.length > 0 ? (
          tutorials.map(tutorial => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              userRole={user.role}
              onDelete={handleDeleteTutorial}
              onEnroll={handleEnroll}
              isEnrolled={enrollments.includes(tutorial.id)}
            />
          ))
        ) : (
          <p className="text-gray-400">No tutorials available.</p>
        )}
      </div>
    </div>
  );
}

export default TutorialsPage;