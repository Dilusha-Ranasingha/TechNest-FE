import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrationActivity, setRegistrationActivity] = useState([]);
  const [enrollmentActivity, setEnrollmentActivity] = useState([]);
  const [tutorialsWithEnrollment, setTutorialsWithEnrollment] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activityTab, setActivityTab] = useState('userActivity');
  const [tab, setTab] = useState('users');
  const [emailSearchQuery, setEmailSearchQuery] = useState('');
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    if (!user || !user.token) {
      navigate('/admin/login');
      return;
    }

    const fetchRegistrationActivity = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/admin/registration-activity', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRegistrationActivity(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/admin/login');
        } else {
          Swal.fire({
            title: "Failed to load registration activity",
            icon: "error",
            draggable: true
          });
        }
      }
    };

    const fetchEnrollmentActivity = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/quizzes/enrollment-activity', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setEnrollmentActivity(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/admin/login');
        } else {
          Swal.fire({
            title: "Failed to load enrollment activity",
            icon: "error",
            draggable: true
          });
        }
      }
    };

    const fetchTutorialsWithEnrollment = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/quizzes/tutorials-with-enrollment-count', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTutorialsWithEnrollment(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/admin/login');
        } else {
          Swal.fire({
            title: "Failed to load tutorials with enrollment count",
            icon: "error",
            draggable: true
          });
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/admin/users', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setAllUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/admin/login');
        } else {
          Swal.fire({
            title: "Failed to load users",
            icon: "error",
            draggable: true
          });
        }
      }
    };

    fetchRegistrationActivity();
    fetchEnrollmentActivity();
    fetchTutorialsWithEnrollment();
    fetchUsers();
  }, [user, navigate]);

  // Prepare data for the registration activity graph
  const prepareRegistrationChartData = () => {
    const now = new Date('2025-05-17T13:45:00+05:30'); // Current date and time
    let filteredActivity = [...registrationActivity];

    if (timeFilter !== 'all') {
      const daysToSubtract = {
        '3months': 90,
        '2months': 60,
        'month': 30,
        'week': 7
      }[timeFilter];

      const cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - daysToSubtract);

      filteredActivity = filteredActivity.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate >= cutoffDate;
      });
    }

    const registrationsByDate = filteredActivity.reduce((acc, activity) => {
      const date = new Date(activity.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(registrationsByDate).sort((a, b) => new Date(a) - new Date(b));
    const counts = sortedDates.map(date => registrationsByDate[date]);

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'User Registrations',
          data: counts,
          borderColor: 'rgba(34, 211, 238, 1)', // Cyan-400
          backgroundColor: 'rgba(34, 211, 238, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  // Prepare data for the enrollment activity graph
  const prepareEnrollmentChartData = () => {
    const now = new Date('2025-05-17T13:45:00+05:30'); // Current date and time
    let filteredActivity = [...enrollmentActivity];

    if (timeFilter !== 'all') {
      const daysToSubtract = {
        '3months': 90,
        '2months': 60,
        'month': 30,
        'week': 7
      }[timeFilter];

      const cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - daysToSubtract);

      filteredActivity = filteredActivity.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate >= cutoffDate;
      });
    }

    const enrollmentsByDate = filteredActivity.reduce((acc, activity) => {
      const date = new Date(activity.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(enrollmentsByDate).sort((a, b) => new Date(a) - new Date(b));
    const counts = sortedDates.map(date => enrollmentsByDate[date]);

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Quiz Enrollments',
          data: counts,
          borderColor: 'rgba(236, 72, 153, 1)', // Pink-400
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  // Filter users or admins based on the active tab and search queries
  const filteredData = allUsers
    .filter(u => u.role.toLowerCase() === (tab === 'users' ? 'user' : 'admin'))
    .filter(u => {
      const emailQuery = emailSearchQuery.toLowerCase();
      const nameQuery = nameSearchQuery.toLowerCase();
      const emailMatch = emailSearchQuery ? u.email.toLowerCase().includes(emailQuery) : true;
      const nameMatch = nameSearchQuery ? (
        tab === 'users'
          ? `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(nameQuery)
          : (u.fullName || '').toLowerCase().includes(nameQuery)
      ) : true;
      return emailMatch && nameMatch;
    });

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-cyan-400 mb-8">Admin Dashboard</h2>

      {/* Activity Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActivityTab('userActivity')}
          className={`px-4 py-2 rounded ${activityTab === 'userActivity' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          User Activity
        </button>
        <button
          onClick={() => setActivityTab('userTutorialActivity')}
          className={`px-4 py-2 rounded ${activityTab === 'userTutorialActivity' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          User Tutorial Activity
        </button>
      </div>

      {/* Time Filter Buttons (shown in both tabs for consistency) */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setTimeFilter('all')}
          className={`px-4 py-2 rounded ${timeFilter === 'all' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          All Time
        </button>
        <button
          onClick={() => setTimeFilter('3months')}
          className={`px-4 py-2 rounded ${timeFilter === '3months' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Last 3 Months
        </button>
        <button
          onClick={() => setTimeFilter('2months')}
          className={`px-4 py-2 rounded ${timeFilter === '2months' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Two Months
        </button>
        <button
          onClick={() => setTimeFilter('month')}
          className={`px-4 py-2 rounded ${timeFilter === 'month' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Last Month
        </button>
        <button
          onClick={() => setTimeFilter('week')}
          className={`px-4 py-2 rounded ${timeFilter === 'week' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Last Week
        </button>
      </div>

      {/* User Activity Section */}
      {activityTab === 'userActivity' && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">User Registration Activity Analysis</h3>

          {/* Registration Graph */}
          {registrationActivity.length > 0 ? (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
              <Line
                data={prepareRegistrationChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top', labels: { color: 'white' } },
                    title: { display: true, text: 'Daily User Registrations', color: 'white', font: { size: 16 } },
                    tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.7)', titleColor: 'white', bodyColor: 'white' }
                  },
                  scales: {
                    x: { 
                      ticks: { color: 'white' }, 
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      title: { display: true, text: 'Date', color: 'white' }
                    },
                    y: { 
                      ticks: { color: 'white', beginAtZero: true }, 
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      title: { display: true, text: 'Registrations', color: 'white' }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <p className="text-gray-400">No registration activity available.</p>
          )}

          {/* Recent Registration Activity Table */}
          {registrationActivity.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-gray-300 mb-4">Recent Registration Activity (Last 10)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
                  <thead>
                    <tr className="text-gray-300">
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Role</th>
                      <th className="p-4 text-left">Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrationActivity.slice(0, 10).map((activity, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="p-4">{activity.email}</td>
                        <td className="p-4">{activity.role}</td>
                        <td className="p-4">{new Date(activity.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <br />

          {/* Tabs and Search for Users/Admins (Under User Activity only) */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setTab('users')}
                  className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Users
                </button>
                <button
                  onClick={() => setTab('admins')}
                  className={`px-4 py-2 rounded ${tab === 'admins' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Admins
                </button>
              </div>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={emailSearchQuery}
                  onChange={(e) => setEmailSearchQuery(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                  type="text"
                  placeholder={`Search by ${tab === 'users' ? 'name' : 'full name'}...`}
                  value={nameSearchQuery}
                  onChange={(e) => setNameSearchQuery(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Users/Admins Table */}
            {filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
                  <thead>
                    <tr className="text-gray-300">
                      <th className="p-4 text-left">ID</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Role</th>
                      <th className="p-4 text-left">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="border-t border-gray-700">
                        <td className="p-4">{item.id}</td>
                        <td className="p-4">{item.email}</td>
                        <td className="p-4">{item.role}</td>
                        <td className="p-4">
                          {item.role === 'ADMIN' ? item.fullName || '-' : `${item.firstName || '-'} ${item.lastName || '-'}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No {tab} found.</p>
            )}
          </div>
        </div>
      )}

      {/* User Tutorial Activity Section */}
      {activityTab === 'userTutorialActivity' && (
        <>
          {/* Quiz Enrollment Activity Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">Quiz Enrollment Activity Analysis</h3>
            
            {/* Enrollment Graph */}
            {enrollmentActivity.length > 0 ? (
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
                <Line
                  data={prepareEnrollmentChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top', labels: { color: 'white' } },
                      title: { display: true, text: 'Daily Quiz Enrollments', color: 'white', font: { size: 16 } },
                      tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.7)', titleColor: 'white', bodyColor: 'white' }
                    },
                    scales: {
                      x: { 
                        ticks: { color: 'white' }, 
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        title: { display: true, text: 'Date', color: 'white' }
                      },
                      y: { 
                        ticks: { color: 'white', beginAtZero: true }, 
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        title: { display: true, text: 'Enrollments', color: 'white' }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-400">No enrollment activity available.</p>
            )}

            {/* Recent Enrollment Activity Table */}
            {enrollmentActivity.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold text-gray-300 mb-4">Recent Enrollment Activity (Last 10)</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
                    <thead>
                      <tr className="text-gray-300">
                        <th className="p-4 text-left">User Email</th>
                        <th className="p-4 text-left">User ID</th>
                        <th className="p-4 text-left">Tutorial Title</th>
                        <th className="p-4 text-left">Tutorial ID</th>
                        <th className="p-4 text-left">Enrolled At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollmentActivity.slice(0, 10).map((activity, index) => (
                        <tr key={index} className="border-t border-gray-700">
                          <td className="p-4">{activity.userEmail}</td>
                          <td className="p-4">{activity.userId}</td>
                          <td className="p-4">{activity.tutorialTitle}</td>
                          <td className="p-4">{activity.tutorialId}</td>
                          <td className="p-4">{new Date(activity.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Tutorials with Enrollment Count Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">Tutorials Enrollment Overview</h3>
            {tutorialsWithEnrollment.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
                  <thead>
                    <tr className="text-gray-300">
                      <th className="p-4 text-left">Tutorial ID</th>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-left">Description</th>
                      <th className="p-4 text-left">Enrolled Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutorialsWithEnrollment.map((tutorial, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="p-4">{tutorial.id}</td>
                        <td className="p-4">{tutorial.title}</td>
                        <td className="p-4">{tutorial.description}</td>
                        <td className="p-4">{tutorial.enrollmentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No tutorials available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;