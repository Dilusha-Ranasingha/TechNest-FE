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
    await deletePost(id);
    fetchPosts();
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