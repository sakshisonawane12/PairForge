import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true, // ← must be true for HttpOnly cookies
});

export const register = (data) => API.post("/api/auth/register", data);
export const login = (data) => API.post("/api/auth/login", data);
export const createRoom = (data) => API.post("/api/rooms/create", data);
export const getRoom = (code) => API.get(`/api/rooms/${code}`);
export const getMyRooms = () => API.get("/api/rooms/my-rooms");
export const getAllRooms = () => API.get("/api/rooms/all");
export const getChatHistory = (code) => API.get(`/api/rooms/${code}/messages`);
export const executeCode = (data) => API.post("/api/execute", data);
export const verifyRoomPassword = (code, password) =>
  API.post(`/api/rooms/${code}/verify`, { password });
export const saveSnapshot = (code, data) =>
  API.post(`/api/rooms/${code}/snapshot`, data);
export const getSnapshots = (code) => API.get(`/api/rooms/${code}/snapshots`);
export const getRoomFiles = (code) => API.get(`/api/rooms/${code}/files`);
export const createRoomFile = (code, data) =>
  API.post(`/api/rooms/${code}/files`, data);
export const updateRoomFile = (code, fileName, data) =>
  API.put(`/api/rooms/${code}/files/${fileName}`, data);
export const deleteRoomFile = (code, fileName) =>
  API.delete(`/api/rooms/${code}/files/${fileName}`);
export const getMyProfile = () => API.get("/api/users/profile");
export const updateProfile = (data) => API.put("/api/users/profile", data);
