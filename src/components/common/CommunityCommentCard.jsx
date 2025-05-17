import React from 'react';

const CommunityCommentCard = ({ comment, onDelete, onUpdate }) => {
  return (
    <div className="bg-gray-700 p-2 rounded mt-2">
      <p>{comment.content}</p>
      <p className="text-sm text-gray-400">By {comment.username} on {new Date(comment.createdAt).toLocaleString()}</p>
      {onDelete && onUpdate && (
        <>
          <button onClick={onDelete} className="text-red-400 ml-2">Delete</button>
          <button onClick={onUpdate} className="text-blue-400 ml-2">Edit</button>
        </>
      )}
    </div>
  );
};

export default CommunityCommentCard;