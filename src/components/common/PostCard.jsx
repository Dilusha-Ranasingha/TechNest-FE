import React, { useState, useEffect } from 'react';
import { likePost, unlikePost, hasUserLikedPost, commentPost, sharePost, getPostComments } from '../../services/postService';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    fetchComments();
    checkIfLiked();
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const data = await getPostComments(post.id);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkIfLiked = async () => {
    try {
      const liked = await hasUserLikedPost(post.id);
      setHasLiked(liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (hasLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
      setHasLiked(!hasLiked); // Optimistically update the like status
      onUpdate(); // Refresh the post list to sync with backend
    } catch (error) {
      console.error('Error toggling like:', error);
      checkIfLiked(); // Revert to actual status if the request fails
      onUpdate();
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      await commentPost(post.id, comment);
      setComment('');
      onUpdate();
      fetchComments();
    }
  };

  const handleShare = async () => {
    await sharePost(post.id);
    onUpdate();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-bold text-cyan-400">{post.title}</h3>
      <p className="text-gray-300">{post.description}</p>
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="mt-2">
          {post.mediaUrls.map((url, index) => (
            <img key={index} src={url} alt="Post media" className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      )}
      <div className="mt-2 text-sm text-gray-400">
        <span>By {post.username} | {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mt-2 flex space-x-4">
        <button
          onClick={handleLikeToggle}
          className={`hover:text-cyan-300 ${hasLiked ? 'text-red-400' : 'text-cyan-400'}`} // Highlight if liked
        >
          {hasLiked ? 'Unlike' : 'Like'} ({post.likeCount})
        </button>
        <form onSubmit={handleComment} className="flex-1">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-1 bg-gray-700 text-white rounded"
          />
          <button type="submit" className="ml-2 text-cyan-400 hover:text-cyan-300">Comment</button>
        </form>
        <button onClick={handleShare} className="text-cyan-400 hover:text-cyan-300">Share ({post.shareCount})</button>
      </div>
      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="text-gray-300 text-sm border-t border-gray-700 pt-2 mt-2">
              {comment.content}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        )}
      </div>
      {isEditing && onUpdate && (
        <button onClick={() => setIsEditing(false)} className="mt-2 text-red-400 hover:text-red-300">Cancel Edit</button>
      )}
    </div>
  );
};

export default PostCard;