import api from './axios';

export const login = (role, data) => api.post(`/api/auth/login/${role}`, data);
export const register = (role, data) => api.post(`/api/auth/register/${role}`, data);
export const adminRegister = (role, data) => api.post(`/api/auth/admin/register/${role}`, data);
export const deleteUser = (username) => api.delete('/api/auth/delete', { data: username });
export const getAllUsers = () => api.get('/api/auth/users');
