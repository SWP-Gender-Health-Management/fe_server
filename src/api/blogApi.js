import api from './api';

export const getAllBlogs = () => api.get('/blog/get-all-blogs');
export const getBlogsByAccount = (accountId, token) =>
  api.get(`/blog/get-blog-by-account/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
export const getBlogById = (blogId) =>
  api.get(`/blog/get-blog-by-id/${blogId}`);
