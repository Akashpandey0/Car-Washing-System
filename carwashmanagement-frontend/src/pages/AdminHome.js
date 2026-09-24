import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllOrders } from '../api/orders';
import { getAllCars } from '../api/cars';
import { getAllUsers } from '../api/auth';

// Same commission rates as washer — platform keeps the rest
const COMMISSION_RATES = {
  BASIC_WASH: 0.40,
  PREMIUM_WASH: 0.45,
  INTERIOR_CLEAN: 0.45,
  FULL_DETAIL: 0.50,
};

const getPlatformFee = (serviceType, amount) => {
  const washerRate = COMMISSION_RATES[serviceType] || 0.60;
  return parseFloat(amount || 0) * (1 - washerRate);
};

const getWasherPayout = (serviceType, amount) => {
  const rate = COMMISSION_RATES[serviceType] || 0.60;
  return parseFloat(amount || 0) * rate;
};

const STATUS_COLORS = { PENDING: '#f59e0b', ASSIGNED: '#3b82f6', IN_PROGRESS: '#8b5cf6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
const STATUS_BG = { PENDING: '#fef3c7', ASSIGNED: '#dbeafe', IN_PROGRESS: '#ede9fe', COMPLETED: '#d1fae5', CANCELLED: '#fee2e2' };

export default function AdminHome() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllOrders().then(r => setOrders(r.data)).catch(() => {});
    getAllCars().then(r => setCars(r.data)).catch(() => {});
    getAllUsers().then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const pending = orders.filter(o => o.status === 'PENDING').length;
  const inProgress = orders.filter(o => o.status === 'IN_PROGRESS' || o.status === 'ASSIGNED').length;
  const cancelled = orders.filter(o => o.status === 'CANCELLED').length;
  const customers = users.filter(u => u.role === 'CUSTOMER').length;
  const washers = users.filter(u => u.role === 'WASHER').length;
  const recentOrders = [...orders].reverse().slice(0, 5);

  // Earnings calculations
  const totalRevenue = completedOrders.reduce((s, o) => s + parseFloat(o.amount || 0), 0);
  const totalWasherPayout = completedOrders.reduce((s, o) => s + getWasherPayout(o.serviceType, o.amount), 0);
  const totalPlatformEarnings = completedOrders.reduce((s, o) => s + getPlatformFee(o.serviceType, o.amount), 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Per-service breakdown
  const serviceBreakdown = Object.keys(COMMISSION_RATES).map(service => {
    const serviceOrders = completedOrders.filter(o => o.serviceType === service);
    const revenue = serviceOrders.reduce((s, o) => s + parseFloat(o.amount || 0), 0);
    const platformFee = serviceOrders.reduce((s, o) => s + getPlatformFee(o.serviceType, o.amount), 0);
    return { service, count: serviceOrders.length, revenue, platformFee };
  }).filter(s => s.count > 0);

  return (
    <div style={s.page}>
      {/* Banner */}
      <div style={s.banner}>
        <div>
          <div style={s.bannerGreet}>Admin Panel ⚙️</div>
          <h1 style={s.bannerTitle}>Welcome, {user.username}!</h1>
          <p style={s.bannerSub}>Here's a complete overview of your car wash platform.</p>
        </div>
        <div style={s.bannerRight}>
          <div style={s.bannerEarning}>
            <div style={s.bannerEarningLabel}>Platform Earnings</div>
            <div style={s.bannerEarningValue}>${totalPlatformEarnings.toFixed(2)}</div>
            <div style={s.bannerEarningNote}>from {completedOrders.length} completed orders</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={s.statsGrid}>
        {[
          { icon: '📋', label: 'Total Orders', value: orders.length, color: '#dbeafe', accent: '#3b82f6', to: '/admin/orders' },
          { icon: '⏳', label: 'Pending', value: pending, color: '#fef3c7', accent: '#f59e0b', to: '/admin/orders' },
          { icon: '🔄', label: 'In Progress', value: inProgress, color: '#ede9fe', accent: '#8b5cf6', to: '/admin/orders' },
          { icon: '✅', label: 'Completed', value: completedOrders.length, color: '#d1fae5', accent: '#10b981', to: '/admin/orders' },
          { icon: '🚗', label: 'Total Cars', value: cars.length, color: '#fce7f3', accent: '#ec4899', to: '/admin/cars' },
          { icon: '👤', label: 'Customers', value: customers, color: '#dbeafe', accent: '#3b82f6', to: '/admin/users' },
          { icon: '🧹', label: 'Washers', value: washers, color: '#d1fae5', accent: '#10b981', to: '/admin/users' },
          { icon: '❌', label: 'Cancelled', value: cancelled, color: '#fee2e2', accent: '#ef4444', to: '/admin/orders' },
        ].map(stat => (
          <Link key={stat.label} to={stat.to} style={{ ...s.statCard, background: stat.color, textDecoration: 'none' }}>
            <div style={s.statIcon}>{stat.icon}</div>
            <div style={{ ...s.statValue, color: stat.accent }}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Earnings Overview */}
      <div style={s.earningsRow}>
        {[
          { icon: '💰', label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, sub: 'All completed orders', color: 'linear-gradient(135deg,#4f46e5,#3730a3)' },
          { icon: '🏦', label: 'Platform Earnings', value: `$${totalPlatformEarnings.toFixed(2)}`, sub: 'After washer payouts', color: 'linear-gradient(135deg,#10b981,#059669)' },
          { icon: '🧹', label: 'Washer Payouts', value: `$${totalWasherPayout.toFixed(2)}`, sub: 'Paid to washers', color: 'linear-gradient(135deg,#f59e0b,#d97706)' },
          { icon: '📊', label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, sub: 'Per completed order', color: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
        ].map(e => (
          <div key={e.label} style={{ ...s.earningCard, background: e.color }}>
            <div style={s.earningIcon}>{e.icon}</div>
            <div style={s.earningValue}>{e.value}</div>
            <div style={s.earningLabel}>{e.label}</div>
            <div style={s.earningSub}>{e.sub}</div>
          </div>
        ))}
      </div>

      <div style={s.grid2}>
        {/* Recent Orders */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>Recent Orders</h3>
            <Link to="/admin/orders" style={s.cardLink}>View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={s.empty}><div style={s.emptyIcon}>📋</div><p style={s.emptyText}>No orders yet</p></div>
          ) : (
            recentOrders.map(o => (
              <div key={o.id} style={s.orderRow}>
                <div>
                  <div style={s.orderTitle}>Order #{o.id} · {o.licensePlate}</div>
                  <div style={s.orderSub}>👤 {o.customerUsername} · {o.serviceType?.replace(/_/g, ' ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ ...s.badge, background: STATUS_BG[o.status], color: STATUS_COLORS[o.status] }}>
                    {o.status?.replace('_', ' ')}
                  </span>
                  <div style={s.orderAmount}>${parseFloat(o.amount || 0).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Earnings by Service */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Earnings by Service</h3>
          {serviceBreakdown.length === 0 ? (
            <div style={s.empty}><div style={s.emptyIcon}>📊</div><p style={s.emptyText}>No completed orders yet</p></div>
          ) : (
            <div style={{ marginTop: '12px' }}>
              {/* Commission legend */}
              <div style={s.commissionNote}>
                Platform keeps: Basic 60% · Premium 55% · Interior 55% · Full Detail 50%
              </div>
              {serviceBreakdown.map(sb => (
                <div key={sb.service} style={s.serviceBreakRow}>
                  <div style={s.serviceBreakLeft}>
                    <div style={s.serviceBreakName}>{sb.service.replace(/_/g, ' ')}</div>
                    <div style={s.serviceBreakCount}>{sb.count} order{sb.count !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={s.serviceBreakRight}>
                    <div style={s.serviceBreakRevenue}>Revenue: ${sb.revenue.toFixed(2)}</div>
                    <div style={s.serviceBreakFee}>Platform: <span style={{ color: '#10b981', fontWeight: '700' }}>${sb.platformFee.toFixed(2)}</span></div>
                  </div>
                </div>
              ))}
              <div style={s.serviceBreakTotal}>
                <span>Total Platform Earnings</span>
                <span style={{ color: '#10b981', fontWeight: '800', fontSize: '16px' }}>${totalPlatformEarnings.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={s.card}>
        <h3 style={{ ...s.cardTitle, marginBottom: '16px' }}>Quick Actions</h3>
        <div style={s.actionsGrid}>
          {[
            { to: '/admin/orders', icon: '📋', label: 'Manage Orders', desc: `${orders.length} total orders`, color: '#dbeafe' },
            { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: `${users.length} registered users`, color: '#d1fae5' },
            { to: '/admin/cars', icon: '🚗', label: 'All Cars', desc: `${cars.length} vehicles`, color: '#ede9fe' },
            { to: '/admin/users', icon: '🧹', label: 'Washers', desc: `${washers} active washers`, color: '#fef3c7' },
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
  );
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  banner: { background: 'linear-gradient(135deg,#1e1b4b,#3730a3)', borderRadius: '20px', padding: '36px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '20px', flexWrap: 'wrap' },
  bannerGreet: { color: '#a5b4fc', fontSize: '14px', fontWeight: '600', marginBottom: '8px' },
  bannerTitle: { color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: '14px' },
  bannerRight: {},
  bannerEarning: { background: 'rgba(255,255,255,0.12)', borderRadius: '14px', padding: '20px 28px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' },
  bannerEarningLabel: { color: '#a5b4fc', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' },
  bannerEarningValue: { color: '#fff', fontSize: '36px', fontWeight: '800', marginBottom: '4px' },
  bannerEarningNote: { color: 'rgba(255,255,255,0.65)', fontSize: '12px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' },
  statCard: { borderRadius: '14px', padding: '18px 14px', textAlign: 'center', transition: 'transform 0.2s' },
  statIcon: { fontSize: '22px', marginBottom: '6px' },
  statValue: { fontSize: '24px', fontWeight: '800', marginBottom: '4px' },
  statLabel: { fontSize: '11px', fontWeight: '600', color: '#475569' },
  earningsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' },
  earningCard: { borderRadius: '16px', padding: '20px', color: '#fff' },
  earningIcon: { fontSize: '28px', marginBottom: '10px' },
  earningValue: { fontSize: '26px', fontWeight: '800', marginBottom: '4px' },
  earningLabel: { fontSize: '13px', fontWeight: '700', marginBottom: '2px' },
  earningSub: { fontSize: '11px', opacity: 0.75 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b' },
  cardLink: { color: '#4f46e5', fontSize: '13px', fontWeight: '600', textDecoration: 'none' },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9', gap: '8px' },
  orderTitle: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  orderSub: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  orderAmount: { fontSize: '13px', fontWeight: '700', color: '#10b981', marginTop: '4px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
  empty: { textAlign: 'center', padding: '32px 0' },
  emptyIcon: { fontSize: '40px', marginBottom: '8px' },
  emptyText: { color: '#64748b', fontSize: '14px' },
  commissionNote: { fontSize: '11px', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px' },
  serviceBreakRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
  serviceBreakLeft: {},
  serviceBreakName: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  serviceBreakCount: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  serviceBreakRight: { textAlign: 'right' },
  serviceBreakRevenue: { fontSize: '12px', color: '#64748b' },
  serviceBreakFee: { fontSize: '13px', color: '#374151', marginTop: '2px' },
  serviceBreakTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', marginTop: '4px', borderTop: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' },
  actionCard: { borderRadius: '12px', padding: '16px', cursor: 'pointer' },
  actionIcon: { fontSize: '24px', marginBottom: '8px' },
  actionLabel: { fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' },
  actionDesc: { fontSize: '12px', color: '#64748b' },
};
