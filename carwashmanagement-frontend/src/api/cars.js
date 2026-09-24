import api from './axios';

export const registerCar = (data) => api.post('/api/cars', data);
export const getMyCars = (username) => api.get(`/api/cars/owner/${username}`);
export const getAllCars = () => api.get('/api/cars');
export const getCarByPlate = (plate) => api.get(`/api/cars/${plate}`);
export const updateCar = (plate, data) => api.put(`/api/cars/${plate}`, data);
