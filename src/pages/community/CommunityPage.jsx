import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAllPosts,
  createPost,
  addComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from '../../services/communityService';

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [commentPostId, setCommentPostId] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    const response = await getAllPosts(0, 10);
    const postsWithComments = await Promise.all(
      response.content.map(async (post) => {
        const comments = await getCommentsByPostId(post.id);
        // Map userId and username robustly for every comment
        const mappedComments = comments.map((c) => ({
          ...c,
          userId: c.userId ?? c.userid ?? c.user_id ?? c.authorId ?? '', // fallback for various backend keys
          username: c.username ?? c.userEmail ?? c.email ?? c.authorEmail ?? '',
        }));
        return { ...post, comments: mappedComments };
      })
    );
    setPosts(postsWithComments);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    await createPost({ title, description });
    setTitle('');
    setDescription('');
    setShowForm(false);
    fetchPosts();
  };

  const handleAddComment = async (postId) => {
    if (!commentContent.trim()) return;
    try {
      const response = await addComment(postId, { content: commentContent });
      const newComment = {
        ...response,
        userId: user.id,
        username: user.email,
      };
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
      setCommentContent('');
      setCommentPostId(null);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== commentId),
              }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleUpdateComment = async (commentId, postId) => {
    if (!editingCommentContent.trim()) return;
    try {
      await updateComment(commentId, { content: editingCommentContent });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, content: editingCommentContent }
                    : c
                ),
              }
            : post
        )
      );
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Community</h1>

      {user && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white p-2 rounded mb-4"
        >
          Ask Question
        </button>
      )}

      {showForm && (
        <form onSubmit={handleCreatePost} className="bg-gray-800 p-4 rounded mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Submit
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-red-500 text-white p-2 rounded ml-2"
          >
            Cancel
          </button>
        </form>
      )}

      {posts.map((post) => (
        <div key={post.id} className="bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold">{post.title}</h3>
          <p className="text-gray-300">{post.description}</p>
          <p className="text-sm text-gray-400">
            By {post.username} on {new Date(post.createdAt).toLocaleString()}
          </p>

          {user && (
            <button
              onClick={() => setCommentPostId(post.id)}
              className="text-blue-400 mt-2"
            >
              Add Answer
            </button>
          )}

          <div className="mt-2">
            {post.comments?.length > 0 ? (
              post.comments.map((comment) => {
                // Always use String() for comparison to avoid type mismatch
                const isOwnComment = user && String(comment.userId) === String(user.id);
                return (
                  <div key={comment.id} className="bg-gray-700 p-2 rounded mt-2">
                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                          className="w-full p-2 mb-2 bg-gray-800 text-white rounded"
                        />
                        <button
                          onClick={() => handleUpdateComment(comment.id, post.id)}
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
                      <>
                        <p>{comment.content}</p>
                        <p className="text-sm text-gray-400">
                          By {comment.username} on {new Date(comment.createdAt).toLocaleString()}
                        </p>
                        {isOwnComment && (
                          <div className="mt-1">
                            <button
                              onClick={() => handleDeleteComment(comment.id, post.id)}
                              className="text-red-400 mr-2"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleEditComment(comment.id, comment.content)}
                              className="text-blue-400"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400">No answers yet.</p>
            )}
          </div>

          {commentPostId === post.id && (
            <div className="mt-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add an answer..."
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Submit Answer
              </button>
              <button
                onClick={() => setCommentPostId(null)}
                className="bg-red-500 text-white p-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommunityPage;