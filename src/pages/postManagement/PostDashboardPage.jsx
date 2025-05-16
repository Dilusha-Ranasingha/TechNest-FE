import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../../services/postService';
import PostCard from '../../components/common/PostCard';
import PostForm from '../../components/post/PostForm';
import { useNavigate } from 'react-router-dom';

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">Post Dashboard</h1>
      <button
        onClick={() => setShowForm(true)}
        className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded mb-4"
      >
        Add Post
      </button>
      <button
        onClick={() => navigate('/postManagement/user-posts')}
        className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded mb-4 ml-2"
      >
        Manage My Posts
      </button>
      {showForm && <PostForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
      {posts.length === 0 ? (
        <p className="text-gray-400">No posts available.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
        ))
      )}
    </div>
  );
};

export default PostDashboardPage;