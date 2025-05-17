import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { deleteComment, deletePost, updateComment } from '../../services/communityService';

const CommunityPostCard = ({ post, onDelete, onUpdate, onCommentDelete, onCommentUpdate }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
      onDelete(post.id);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
      onCommentDelete(commentId);
    }
  };

  const handleCommentUpdate = async (commentId, content) => {
    await updateComment(commentId, { content });
    onCommentUpdate(commentId, content);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-xl font-bold">{post.title}</h3>
      <p className="text-gray-300">{post.description}</p>
      <p className="text-sm text-gray-400">By {post.username} on {new Date(post.createdAt).toLocaleString()}</p>
      {user && post.userId === user.id && (
        <>
          <button onClick={handleDelete} className="text-red-400 ml-2">Delete</button>
          <button onClick={() => onUpdate(post)} className="text-blue-400 ml-2">Edit</button>
        </>
      )}
      <div className="mt-2">
        {post.comments && post.comments.map((comment) => (
          <div key={comment.id} className="bg-gray-700 p-2 rounded mt-2">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-400">By {comment.username} on {new Date(comment.createdAt).toLocaleString()}</p>
            {user && comment.userId === user.id && (
              <>
                <button onClick={() => handleCommentDelete(comment.id)} className="text-red-400 ml-2">Delete</button>
                <button onClick={() => handleCommentUpdate(comment.id, prompt('Update comment:', comment.content))} className="text-blue-400 ml-2">Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPostCard;