import api from './api';

export const getAllPosts = async (page = 0, size = 10) => {
  const response = await api.get('/posts', { params: { page, size } });
  return response.data;
};

export const getUserPosts = async (page = 0, size = 10) => {
  const response = await api.get('/posts/user', { params: { page, size } });
  return response.data;
};

export const createPost = async (postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('description', postData.description);
  if (postData.mediaFiles && Array.isArray(postData.mediaFiles)) { // Check if mediaFiles is an array
    postData.mediaFiles.forEach((file, index) => {
      formData.append(`mediaFiles[${index}]`, file);
    });
  }
  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updatePost = async (id, postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('description', postData.description);
  if (postData.mediaFiles && Array.isArray(postData.mediaFiles)) {
    postData.mediaFiles.forEach((file, index) => {
      formData.append(`mediaFiles[${index}]`, file);
    });
  }
  const response = await api.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deletePost = async (id) => {
  await api.delete(`/posts/${id}`);
};

export const likePost = async (id) => {
  await api.post(`/posts/${id}/like`, { postId: id });
};

export const commentPost = async (id, content) => {
  await api.post(`/posts/${id}/comment`, { content });
};

export const sharePost = async (id) => {
  await api.post(`/posts/${id}/share`, { postId: id });
};

// New function to fetch comments for a post
export const getPostComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};