import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orders';
import { getMyCars } from '../api/cars';
import { getMyPayments } from '../api/payments';

export default function CustomerHome() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).catch(() => {});
    if (user?.username) {
      getMyCars(user.username).then(r => setCars(r.data)).catch(() => {});
    }
    getMyPayments().then(r => setPayments(r.data)).catch(() => {});
  }, [user?.username]);

  const pending = orders.filter(o => o.status === 'PENDING').length;
  const inProgress = orders.filter(o => o.status === 'IN_PROGRESS' || o.status === 'ASSIGNED').length;
  const completed = orders.filter(o => o.status === 'COMPLETED').length;
  const totalSpent = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + parseFloat(p.amount || 0), 0);

  const recentOrders = orders.slice(0, 3);

  const STATUS_COLORS = { PENDING: '#f59e0b', ASSIGNED: '#3b82f6', IN_PROGRESS: '#8b5cf6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
  const STATUS_BG = { PENDING: '#fef3c7', ASSIGNED: '#dbeafe', IN_PROGRESS: '#ede9fe', COMPLETED: '#d1fae5', CANCELLED: '#fee2e2' };

  return (
    <div style={s.page}>
      {/* Welcome Banner */}
      <div style={s.banner}>
        <div style={s.bannerLeft}>
          <div style={s.bannerGreet}>Good day, {user.username}! 👋</div>
          <h1 style={s.bannerTitle}>Welcome to Your Dashboard</h1>
          <p style={s.bannerSub}>Manage your cars, book washes and track your orders all in one place.</p>
          <Link to="/orders" style={s.bannerBtn}>🚿 Book a Wash Now</Link>
        </div>
        <div style={s.bannerIllustration}>🚗</div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { icon: '🚗', label: 'My Cars', value: cars.length, color: '#dbeafe', accent: '#3b82f6', to: '/cars' },
          { icon: '⏳', label: 'Pending Orders', value: pending, color: '#fef3c7', accent: '#f59e0b', to: '/orders' },
          { icon: '🔄', label: 'In Progress', value: inProgress, color: '#ede9fe', accent: '#8b5cf6', to: '/orders' },
          { icon: '✅', label: 'Completed', value: completed, color: '#d1fae5', accent: '#10b981', to: '/orders' },
          { icon: '💳', label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: '#fce7f3', accent: '#ec4899', to: '/payments' },
        ].map(stat => (
          <Link key={stat.label} to={stat.to} style={{ ...s.statCard, background: stat.color, textDecoration: 'none' }}>
            <div style={s.statIcon}>{stat.icon}</div>
            <div style={{ ...s.statValue, color: stat.accent }}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </Link>
        ))}
      </div>

      <div style={s.grid2}>
        {/* Recent Orders */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>Recent Orders</h3>
            <Link to="/orders" style={s.cardLink}>View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>📋</div>
              <p style={s.emptyText}>No orders yet</p>
              <Link to="/orders" style={s.emptyBtn}>Book Your First Wash</Link>
            </div>
          ) : (
            recentOrders.map(o => (
              <div key={o.id} style={s.orderRow}>
                <div>
                  <div style={s.orderTitle}>Order #{o.id} · {o.licensePlate}</div>
                  <div style={s.orderSub}>{o.serviceType?.replace(/_/g, ' ')} · {o.address}</div>
                </div>
                <span style={{ ...s.badge, background: STATUS_BG[o.status], color: STATUS_COLORS[o.status] }}>
                  {o.status?.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Quick Actions</h3>
          <div style={s.actionsGrid}>
            {[
              { to: '/cars', icon: '🚗', label: 'Add a Car', desc: 'Register a new vehicle', color: '#dbeafe' },
              { to: '/orders', icon: '📋', label: 'Book a Wash', desc: 'Schedule a service', color: '#d1fae5' },
              { to: '/payments', icon: '💳', label: 'Payments', desc: 'View payment history', color: '#ede9fe' },
              { to: '/cars', icon: '🔧', label: 'My Garage', desc: `${cars.length} car${cars.length !== 1 ? 's' : ''} registered`, color: '#fef3c7' },
            ].map(a => (
              <Link key={a.label} to={a.to} style={{ ...s.actionCard, background: a.color, textDecoration: 'none' }}>
                <div style={s.actionIcon}>{a.icon}</div>
                <div style={s.actionLabel}>{a.label}</div>
                <div style={s.actionDesc}>{a.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  banner: { background: 'linear-gradient(135deg,#4f46e5,#3730a3)', borderRadius: '20px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '20px' },
  bannerLeft: { flex: 1 },
  bannerGreet: { color: '#a5b4fc', fontSize: '14px', fontWeight: '600', marginBottom: '8px' },
  bannerTitle: { color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '10px' },
  bannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' },
  bannerBtn: { background: '#fff', color: '#4f46e5', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'inline-block' },
  bannerIllustration: { fontSize: '80px', opacity: 0.8 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '14px', padding: '20px 16px', textAlign: 'center', transition: 'transform 0.2s' },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statValue: { fontSize: '26px', fontWeight: '800', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b' },
  cardLink: { color: '#4f46e5', fontSize: '13px', fontWeight: '600', textDecoration: 'none' },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9', gap: '8px' },
  orderTitle: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  orderSub: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
  empty: { textAlign: 'center', padding: '32px 0' },
  emptyIcon: { fontSize: '40px', marginBottom: '8px' },
  emptyText: { color: '#64748b', fontSize: '14px', marginBottom: '12px' },
  emptyBtn: { background: '#eef2ff', color: '#4f46e5', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' },
  actionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  actionCard: { borderRadius: '12px', padding: '16px', cursor: 'pointer' },
  actionIcon: { fontSize: '24px', marginBottom: '8px' },
  actionLabel: { fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' },
  actionDesc: { fontSize: '12px', color: '#64748b' },
};
