import React, { useState, useEffect } from 'react';
import { getUserPosts, updatePost, deletePost } from '../../services/postService';
import PostCard from '../../components/common/PostCard';
import PostForm from '../../components/post/PostForm';

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">My Posts</h1>
      {editingPost ? (
        <PostForm post={editingPost} onSave={handleSave} onCancel={() => setEditingPost(null)} />
      ) : (
        <button
          onClick={() => setEditingPost({})}
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded mb-4"
        >
          Add New Post
        </button>
      )}
      {posts.map((post) => (
        <div key={post.id} className="mb-4">
          <PostCard post={post} onUpdate={fetchPosts} />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => setEditingPost(post)}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-600 hover:bg-red-500 text-white p-2 rounded"
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