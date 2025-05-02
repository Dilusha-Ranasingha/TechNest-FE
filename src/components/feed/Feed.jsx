import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

function Feed() {
  const [feedItems, setFeedItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        // Mocked API call (replace with actual endpoint when available)
        // const response = await axios.get(
        //   'http://localhost:8080/api/user/feed',
        //   { headers: { Authorization: `Bearer ${user.token}` } }
        // );
        // setFeedItems(response.data);

        // Mocked feed data for now
        const mockFeed = [
          { id: 1, message: "User John completed the Java Basics tutorial", timestamp: "2025-04-26 10:00 AM" },
          { id: 2, message: "New tutorial 'Advanced React' added", timestamp: "2025-04-26 09:30 AM" },
          { id: 3, message: "User Sarah scored 80 points in Python Basics", timestamp: "2025-04-25 03:15 PM" },
          { id: 4, message: "Community post: Tips for mastering JavaScript", timestamp: "2025-04-25 11:00 AM" },
        ];
        setFeedItems(mockFeed);
      } catch (error) {
        Swal.fire({
          title: "Failed to load feed",
          icon: "error",
          draggable: true
        });
      }
    };
    fetchFeed();
  }, [user.token]);

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h2 className="text-3xl font-bold text-cyan-400 mb-8">Community Feed</h2>
      {feedItems.length === 0 ? (
        <p className="text-gray-300 text-center">No updates available.</p>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-start space-x-4 transform hover:scale-101 transition-transform"
            >
              <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                {item.message.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-gray-300">{item.message}</p>
                <p className="text-sm text-gray-500 mt-1">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;