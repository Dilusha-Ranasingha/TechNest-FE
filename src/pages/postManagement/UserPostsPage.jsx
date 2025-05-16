import React, { useState, useEffect } from 'react';
import { getUserPosts, updatePost, deletePost } from '../../services/postService';
import PostCard from '../../components/common/PostCard';
import PostForm from '../../components/post/PostForm';
import '../../styles/userPostPageCss.css'; // Import your CSS file

const UserPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const data = await getUserPosts();
    setPosts(data.content || data); // Adjust based on Page object structure
  };

  const handleSave = () => {
    setEditingPost(null);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    try {
      // Optimistically remove the post from the state
      setPosts(posts.filter(post => post.id !== id));
      await deletePost(id);
      fetchPosts(); // Sync with backend to ensure consistency
    } catch (error) {
      console.error('Failed to delete post:', error);
      // Restore the post if deletion fails
      fetchPosts();
      alert(`Failed to delete the post (ID: ${id}). Please try again. Server error: ${error.message}`);
    }
  };

  return (
    <div className="user-posts-container">
      <h1 className="user-posts-title">My Posts</h1>
      {editingPost && (
        <PostForm post={editingPost} onSave={handleSave} onCancel={() => setEditingPost(null)} />
      )}
      {posts.map((post) => (
        <div key={post.id} className="user-post-card">
          <PostCard post={post} onUpdate={fetchPosts} />
          <div className="user-post-actions">
            <button
              onClick={() => setEditingPost(post)}
              className="edit-post-btn"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="delete-post-btn"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPostsPage;