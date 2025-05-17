import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserPosts, updatePost, deletePost } from '../../services/communityService';

const ManageCommunityPostsPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
  const [editTitle, setEditTitle] = useState(''); // State for the edited title
  const [editDescription, setEditDescription] = useState(''); // State for the edited description

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await getUserPosts(0, 10);
    setPosts(response.content);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  const handleEditClick = (post) => {
    // When "Edit" is clicked, set the post ID being edited and prefill the form with current values
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditDescription(post.description);
  };

  const handleUpdatePost = async (postId) => {
    if (editTitle.trim() && editDescription.trim()) {
      await updatePost(postId, { title: editTitle, description: editDescription });
      setEditingPostId(null); // Close the form after updating
      fetchPosts(); // Refresh the posts list
    } else {
      alert('Title and description cannot be empty.');
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null); // Close the form without saving
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Manage My Community Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            {editingPostId === post.id ? (
              // Show the edit form if this post is being edited
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                  required
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                  required
                />
                <button
                  onClick={() => handleUpdatePost(post.id)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // Show the post details if not being edited
              <>
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-gray-300">{post.description}</p>
                <p className="text-sm text-gray-400">
                  By {post.username} on {new Date(post.createdAt).toLocaleString()}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="text-blue-400 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No posts found.</p>
      )}
    </div>
  );
};

export default ManageCommunityPostsPage;