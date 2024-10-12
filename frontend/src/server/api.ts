'use client'
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 从 localStorage 中获取 token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 将 token 添加到请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;