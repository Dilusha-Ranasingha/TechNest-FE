import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import TutorialCard from '../common/TutorialCard';
import { useAuth } from '../../context/AuthContext';

function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [enrolledTutorials, setEnrolledTutorials] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/user/quizzes/tutorials',
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setTutorials(response.data);
      } catch (error) {
        console.error('Error fetching tutorials:', error.response?.data || error.message);
        Swal.fire({
          title: "Failed to load tutorials",
          text: error.response?.data?.message || "Check your network or token.",
          icon: "error",
          draggable: true
        });
      }
    };

    const fetchEnrollments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/quizzes/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const enrolledTutorials = response.data.map(progress => progress.tutorialId);
        setEnrolledTutorials(enrolledTutorials);
      } catch (error) {
        console.error('Error fetching enrollments:', error.response?.data || error.message);
        Swal.fire({
          title: "Failed to load enrollments",
          icon: "error",
          draggable: true
        });
      }
    };

    if (user && user.token) {
      fetchTutorials();
      fetchEnrollments();
    }
  }, [user, user.token]);

  const handleEnroll = async (tutorialId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/user/quizzes/tutorials/${tutorialId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEnrolledTutorials([...enrolledTutorials, tutorialId]);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Enrolled successfully",
        showConfirmButton: false,
        timer: 1500
      });
      navigate(`/tutorials/quiz/${tutorialId}`);
    } catch (error) {
      Swal.fire({
        title: "Failed to enroll",
        icon: "error",
        draggable: true
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-8">Available Tutorials</h2>
      {tutorials.length === 0 ? (
        <p className="text-gray-300 text-center">No tutorials available or failed to load.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              userRole={user?.role}
              onEnroll={handleEnroll}
              isEnrolled={enrolledTutorials.includes(tutorial.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tutorials;