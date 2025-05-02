import { useState, useEffect } from 'react';
import axios from 'axios';
import MyLibrary from './MyLibrary';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

function Dashboard() {
  const [activity, setActivity] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent activity (mocked for now, can be replaced with an API call)
        setActivity([
          { id: 1, message: "You enrolled in Java Basics", date: "2025-04-26" },
          { id: 2, message: "You completed an MCQ in Java Basics", date: "2025-04-26" },
        ]);

        // Fetch user's quiz progress
        const response = await axios.get('http://localhost:8080/api/user/quizzes/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        // Fetch tutorial details to get titles
        const tutorialsResponse = await axios.get('http://localhost:8080/api/user/quizzes/tutorials', {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        // Map progress data with tutorial titles and calculate score
        const enrichedProgress = response.data.map(progress => {
          const tutorial = tutorialsResponse.data.find(t => t.id === progress.tutorialId);
          return {
            ...progress,
            title: tutorial ? tutorial.title : 'Unknown Tutorial',
            score: progress.totalQuestions > 0 
              ? ((progress.correctAnswers / progress.totalQuestions) * 100).toFixed(2) 
              : 0
          };
        });

        setProgressData(enrichedProgress);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        Swal.fire({
          title: 'Failed to load dashboard data',
          icon: 'error',
          draggable: true
        });
      }
    };

    if (user && user.token) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-8">Dashboard</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Recent Activity</h3>
        {activity.length > 0 ? (
          <ul className="space-y-2">
            {activity.map((item) => (
              <li key={item.id} className="text-gray-300">
                {item.message} - <span className="text-gray-400">{item.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No recent activity available.</p>
        )}
      </div>
      <MyLibrary progressData={progressData} />
    </div>
  );
}

export default Dashboard;