import api from './axios';

export const createOrder = (data) => api.post('/api/orders', data);
export const getMyOrders = () => api.get('/api/orders/customer');
export const getWasherOrders = () => api.get('/api/orders/washer');
export const getAllOrders = () => api.get('/api/orders');
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status`, null, { params: { status } });
export const assignWasher = (id, washerUsername) => api.put(`/api/orders/${id}/assign`, null, { params: { washerUsername } });
