import React from 'react';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';
import CustomerHome from './CustomerHome';
import WasherHome from './WasherHome';
import AdminHome from './AdminHome';

export default function Home() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  if (user.role === 'CUSTOMER') return <CustomerHome />;
  if (user.role === 'WASHER') return <WasherHome />;
  if (user.role === 'ADMIN') return <AdminHome />;
  return <Landing />;
}
