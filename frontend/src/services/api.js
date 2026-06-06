import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/api/auth/register', data);
export const login = (data) => API.post('/api/auth/login', data);
export const createRoom = (data) => API.post('/api/rooms/create', data);
export const getRoom = (code) => API.get(`/api/rooms/${code}`);
export const getMyRooms = () => API.get('/api/rooms/my-rooms');
export const getChatHistory = (code) => API.get(`/api/rooms/${code}/messages`);
export const executeCode = (data) => API.post('/api/execute', data)