import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWasherOrders, updateOrderStatus } from '../api/orders';

const COMMISSION_RATES = {
  BASIC_WASH: 0.40,
  PREMIUM_WASH: 0.45,
  INTERIOR_CLEAN: 0.45,
  FULL_DETAIL: 0.50,
};

const getCommission = (serviceType, amount) => {
  const rate = COMMISSION_RATES[serviceType] || 0.60;
  return (parseFloat(amount || 0) * rate);
};

export default function WasherHome() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => getWasherOrders().then(r => setOrders(r.data)).catch(() => {});
  useEffect(() => { fetchOrders(); }, []);

  const assigned = orders.filter(o => o.status === 'ASSIGNED');
  const inProgress = orders.filter(o => o.status === 'IN_PROGRESS');
  const completed = orders.filter(o => o.status === 'COMPLETED');
  const totalEarnings = completed.reduce((sum, o) => sum + getCommission(o.serviceType, o.amount), 0);
  const pendingEarnings = [...assigned, ...inProgress].reduce((sum, o) => sum + getCommission(o.serviceType, o.amount), 0);

  const STATUS_COLORS = { ASSIGNED: '#3b82f6', IN_PROGRESS: '#8b5cf6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
  const STATUS_BG = { ASSIGNED: '#dbeafe', IN_PROGRESS: '#ede9fe', COMPLETED: '#d1fae5', CANCELLED: '#fee2e2' };
  const NEXT = { ASSIGNED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' };
  const NEXT_LABEL = { ASSIGNED: '▶ Start', IN_PROGRESS: '✅ Complete' };

  const handleStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); fetchOrders(); } catch {}
  };

  return (
    <div style={s.page}>
      {/* Banner */}
      <div style={s.banner}>
        <div>
          <div style={s.bannerGreet}>Welcome back, {user.username}! 🧹</div>
          <h1 style={s.bannerTitle}>Washer Dashboard</h1>
          <p style={s.bannerSub}>Manage your assigned jobs and track your earnings.</p>
        </div>
        <div style={s.bannerIllustration}>🧹</div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {[
          { icon: '🔵', label: 'Assigned', value: assigned.length, color: '#dbeafe', accent: '#3b82f6' },
          { icon: '🟣', label: 'In Progress', value: inProgress.length, color: '#ede9fe', accent: '#8b5cf6' },
          { icon: '✅', label: 'Completed', value: completed.length, color: '#d1fae5', accent: '#10b981' },
          { icon: '💰', label: 'Total Earned', value: `$${totalEarnings.toFixed(2)}`, color: '#fef3c7', accent: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{ ...s.statCard, background: stat.color }}>
            <div style={s.statIcon}>{stat.icon}</div>
            <div style={{ ...s.statValue, color: stat.accent }}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={s.grid2}>
        {/* Active Jobs */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>Active Jobs</h3>
            <Link to="/washer-orders" style={s.cardLink}>View All →</Link>
          </div>
          {[...assigned, ...inProgress].length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>🧹</div>
              <p style={s.emptyText}>No active jobs right now</p>
            </div>
          ) : (
            [...assigned, ...inProgress].slice(0, 4).map(o => (
              <div key={o.id} style={s.jobRow}>
                <div style={s.jobLeft}>
                  <div style={s.jobTitle}>Order #{o.id} · {o.licensePlate}</div>
                  <div style={s.jobSub}>📍 {o.address}</div>
                  <div style={s.jobSub}>👤 {o.customerUsername}</div>
                </div>
                <div style={s.jobRight}>
                  <span style={{ ...s.badge, background: STATUS_BG[o.status], color: STATUS_COLORS[o.status] }}>
                    {o.status.replace('_', ' ')}
                  </span>
                  {NEXT[o.status] && (
                    <button style={s.actionBtn} onClick={() => handleStatus(o.id, NEXT[o.status])}>
                      {NEXT_LABEL[o.status]}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div>
          <div style={{ ...s.card, marginBottom: '16px' }}>
            <h3 style={s.cardTitle}>Today's Summary</h3>
            <div style={s.summaryGrid}>
              <div style={s.summaryItem}>
                <div style={s.summaryValue}>{assigned.length}</div>
                <div style={s.summaryLabel}>Pending Jobs</div>
              </div>
              <div style={s.summaryItem}>
                <div style={s.summaryValue}>{inProgress.length}</div>
                <div style={s.summaryLabel}>In Progress</div>
              </div>
              <div style={s.summaryItem}>
                <div style={s.summaryValue}>{completed.length}</div>
                <div style={s.summaryLabel}>Done Today</div>
              </div>
            </div>
          </div>
          <div style={{ ...s.card, background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>TOTAL EARNINGS</div>
            <div style={{ color: '#fff', fontSize: '40px', fontWeight: '800', marginBottom: '4px' }}>${totalEarnings.toFixed(2)}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '12px' }}>from {completed.length} completed job{completed.length !== 1 ? 's' : ''}</div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginBottom: '6px' }}>
                <span>Pending earnings</span><span>${pendingEarnings.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                <span>Confirmed earnings</span><span>${totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  banner: { background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '20px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '20px' },
  bannerGreet: { color: '#a7f3d0', fontSize: '14px', fontWeight: '600', marginBottom: '8px' },
  bannerTitle: { color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '10px' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.6 },
  bannerIllustration: { fontSize: '80px', opacity: 0.8 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '14px', padding: '20px 16px', textAlign: 'center' },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: '800', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b' },
  cardLink: { color: '#10b981', fontSize: '13px', fontWeight: '600', textDecoration: 'none' },
  jobRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #f1f5f9', gap: '8px' },
  jobLeft: { flex: 1 },
  jobTitle: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  jobSub: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  jobRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
  actionBtn: { background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '32px 0' },
  emptyIcon: { fontSize: '40px', marginBottom: '8px' },
  emptyText: { color: '#64748b', fontSize: '14px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '16px' },
  summaryItem: { textAlign: 'center', background: '#f8fafc', borderRadius: '10px', padding: '14px' },
  summaryValue: { fontSize: '24px', fontWeight: '800', color: '#1e293b' },
  summaryLabel: { fontSize: '11px', color: '#64748b', fontWeight: '600', marginTop: '2px' },
};
