import api from './api';

export const getAllPosts = async (page = 0, size = 10) => {
  const response = await api.get('/community/posts', {
    params: { page, size },
  });
  return response.data;
};

export const getUserPosts = async (page = 0, size = 10) => {
  const response = await api.get('/community/posts/user', {
    params: { page, size },
  });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/community/posts', postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`/community/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  await api.delete(`/community/posts/${id}`);
};

export const addComment = async (postId, commentData) => {
  const response = await api.post(`/community/posts/${postId}/comments`, commentData);
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await api.put(`/community/comments/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId) => {
  await api.delete(`/community/comments/${commentId}`);
};

export const getCommentsByPostId = async (postId) => {
  const response = await api.get(`/community/posts/${postId}/comments`);
  return response.data;
};