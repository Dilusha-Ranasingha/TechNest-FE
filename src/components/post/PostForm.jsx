import React, { useState } from 'react';
import { createPost, updatePost } from '../../services/postService';

const PostForm = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [mediaFiles, setMediaFiles] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { title, description, mediaFiles };
    try {
      if (post) {
        await updatePost(post.id, postData);
      } else {
        await createPost(postData);
      }
      onSave();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        maxLength={100}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        maxLength={1000}
        required
      />
      <input
        type="file"
        multiple
        onChange={(e) => setMediaFiles(Array.from(e.target.files) || null)} // Convert FileList to array
        className="mb-2"
        accept="image/*"
      />
      <div className="flex space-x-2">
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded">
          {post ? 'Update' : 'Add'} Post
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;