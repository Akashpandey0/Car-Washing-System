import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, assignWasher } from '../api/orders';

const STATUS_COLORS = { PENDING: '#f59e0b', ASSIGNED: '#3b82f6', IN_PROGRESS: '#8b5cf6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
const STATUS_BG = { PENDING: '#fef3c7', ASSIGNED: '#dbeafe', IN_PROGRESS: '#ede9fe', COMPLETED: '#d1fae5', CANCELLED: '#fee2e2' };
const STATUSES = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [assignMap, setAssignMap] = useState({});
  const [filter, setFilter] = useState('ALL');

  const fetchOrders = async () => {
    try { const res = await getAllOrders(); setOrders(res.data); } catch { setOrders([]); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); fetchOrders(); } catch {}
  };

  const handleAssign = async (id) => {
    const washer = assignMap[id];
    if (!washer?.trim()) return;
    try { await assignWasher(id, washer); fetchOrders(); setAssignMap({ ...assignMap, [id]: '' }); } catch {}
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter(o => o.status === s).length }), {});

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>All Orders</h1>
          <p style={styles.pageSub}>{orders.length} total orders</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        {[['⏳', 'Pending', counts.PENDING, '#fef3c7', '#f59e0b'], ['🔵', 'Assigned', counts.ASSIGNED, '#dbeafe', '#3b82f6'], ['🟣', 'In Progress', counts.IN_PROGRESS, '#ede9fe', '#8b5cf6'], ['✅', 'Completed', counts.COMPLETED, '#d1fae5', '#10b981']].map(([icon, label, val, bg, color]) => (
          <div key={label} style={{ ...styles.statCard, background: bg }}>
            <div style={styles.statIcon}>{icon}</div>
            <div style={{ ...styles.statNum, color }}>{val}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div style={styles.filterRow}>
        {['ALL', ...STATUSES].map(s => (
          <button key={s} style={{ ...styles.filterBtn, ...(filter === s ? styles.filterBtnActive : {}) }} onClick={() => setFilter(s)}>
            {s.replace('_', ' ')} {s !== 'ALL' && `(${counts[s] || 0})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}><div style={styles.emptyIcon}>📋</div><p>No orders found.</p></div>
      ) : (
        <div style={styles.list}>
          {filtered.map(o => (
            <div key={o.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.cardLeft}>
                  <div style={styles.orderId}>Order #{o.id}</div>
                  <div style={styles.licensePlate}>{o.licensePlate}</div>
                  <div style={styles.customer}>👤 {o.customerUsername}</div>
                </div>
                <div style={styles.cardRight}>
                  <span style={{ ...styles.badge, background: STATUS_BG[o.status], color: STATUS_COLORS[o.status] }}>{o.status.replace('_', ' ')}</span>
                  <div style={styles.amount}>${o.amount}</div>
                </div>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.serviceTag}>{o.serviceType?.replace(/_/g, ' ')}</span>
                <span>📍 {o.address}</span>
                <span>🕐 {o.scheduledTime ? new Date(o.scheduledTime).toLocaleString() : '-'}</span>
                {o.washerUsername && <span>🧹 {o.washerUsername}</span>}
              </div>
              <div style={styles.actions}>
                <div style={styles.actionGroup}>
                  <label style={styles.actionLabel}>Update Status</label>
                  <select style={styles.select} value={o.status} onChange={e => handleStatus(o.id, e.target.value)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={styles.actionGroup}>
                  <label style={styles.actionLabel}>Assign Washer</label>
                  <div style={styles.assignRow}>
                    <input style={styles.assignInput} placeholder="Washer username" value={assignMap[o.id] || ''} onChange={e => setAssignMap({ ...assignMap, [o.id]: e.target.value })} />
                    <button style={styles.assignBtn} onClick={() => handleAssign(o.id)}>Assign</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '36px 24px' },
  header: { marginBottom: '24px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1e293b' },
  pageSub: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '14px', padding: '18px', textAlign: 'center' },
  statIcon: { fontSize: '22px', marginBottom: '6px' },
  statNum: { fontSize: '28px', fontWeight: '800', marginBottom: '2px' },
  statLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  filterBtn: { padding: '8px 16px', border: '2px solid #e2e8f0', borderRadius: '20px', background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  filterBtnActive: { border: '2px solid #4f46e5', background: '#eef2ff', color: '#4f46e5' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid #e2e8f0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  cardLeft: {},
  orderId: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  licensePlate: { fontSize: '20px', fontWeight: '800', color: '#1e293b', marginTop: '2px' },
  customer: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  badge: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  amount: { fontSize: '22px', fontWeight: '800', color: '#1e293b' },
  metaRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b', marginBottom: '16px', alignItems: 'center' },
  serviceTag: { background: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  actions: { display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid #f1f5f9' },
  actionGroup: { flex: 1, minWidth: '200px' },
  actionLabel: { display: 'block', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' },
  select: { width: '100%', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: '#f8fafc', color: '#1e293b' },
  assignRow: { display: 'flex', gap: '8px' },
  assignInput: { flex: 1, padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: '#f8fafc' },
  assignBtn: { padding: '8px 16px', background: 'linear-gradient(135deg,#4f46e5,#3730a3)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px', color: '#64748b' },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
};
