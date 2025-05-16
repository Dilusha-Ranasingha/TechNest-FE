import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../../services/postService';
import PostCard from '../../components/common/PostCard';
import PostForm from '../../components/post/PostForm';
import { useNavigate } from 'react-router-dom';
import '../../styles/postDashboardPageCss.css'; // Import your CSS file

const PostDashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data.content || data); // Adjust based on Page object structure
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchPosts();
  };

  if (loading) return <div className="container mx-auto p-4 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-400">{error}</div>;

  return (
    <div className="post-dashboard-container">
      <h1 className="post-dashboard-title">Post Dashboard</h1>
      <div className="post-dashboard-actions">
        <button
          onClick={() => setShowForm(true)}
          className="post-dashboard-btn"
        >
          Add Post
        </button>
      </div>
      {showForm && (
        <div className="post-dashboard-form-wrapper">
          <PostForm onSave={handleSave} onCancel={() => setShowForm(false)} />
        </div>
      )}
      <div className="post-dashboard-cards">
        {posts.length === 0 ? (
          <p className="post-dashboard-empty">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div className="post-dashboard-card" key={post.id}>
              <PostCard post={post} onUpdate={fetchPosts} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostDashboardPage;