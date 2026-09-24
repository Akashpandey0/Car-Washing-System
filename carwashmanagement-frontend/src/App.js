import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyCars from './pages/MyCars';
import MyOrders from './pages/MyOrders';
import MyPayments from './pages/MyPayments';
import WasherOrders from './pages/WasherOrders';
import AdminOrders from './pages/AdminOrders';
import AdminCars from './pages/AdminCars';
import AdminUsers from './pages/AdminUsers';

function GuestRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/cars" element={<ProtectedRoute roles={['CUSTOMER']}><MyCars /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute roles={['CUSTOMER']}><MyOrders /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute roles={['CUSTOMER']}><MyPayments /></ProtectedRoute>} />
          <Route path="/washer-orders" element={<ProtectedRoute roles={['WASHER']}><WasherOrders /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['ADMIN']}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/cars" element={<ProtectedRoute roles={['ADMIN']}><AdminCars /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
