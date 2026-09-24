import api from './axios';

export const createCheckoutSession = (data) => api.post('/api/payments/create-checkout-session', data);
export const getMyPayments = () => api.get('/api/payments/customer');
export const getPaymentByOrder = (orderId) => api.get(`/api/payments/order/${orderId}`);
export const verifyPayment = (sessionId) => api.get(`/api/payments/verify?session_id=${sessionId}`);
export const refundByOrderId = (orderId) => api.post(`/api/payments/refund/order/${orderId}`);
export const downloadReceipt = (paymentId) => api.get(`/api/payments/${paymentId}/receipt`, { responseType: 'blob' });
