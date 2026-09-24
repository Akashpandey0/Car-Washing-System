import React, { useEffect, useState } from 'react';
import { getWasherOrders, updateOrderStatus } from '../api/orders';

const STATUS_COLORS = { PENDING: '#f59e0b', ASSIGNED: '#3b82f6', IN_PROGRESS: '#8b5cf6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
const STATUS_BG = { PENDING: '#fef3c7', ASSIGNED: '#dbeafe', IN_PROGRESS: '#ede9fe', COMPLETED: '#d1fae5', CANCELLED: '#fee2e2' };
const NEXT_STATUS = { ASSIGNED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' };
const NEXT_LABEL = { ASSIGNED: '▶ Start Job', IN_PROGRESS: '✅ Mark Complete' };

// Commission rates per service type (% of order amount washer earns)
const COMMISSION_RATES = {
  BASIC_WASH: 0.40,       // 40% washer | 60% platform
  PREMIUM_WASH: 0.45,     // 45% washer | 55% platform
  INTERIOR_CLEAN: 0.45,   // 45% washer | 55% platform
  FULL_DETAIL: 0.50,      // 50% washer | 50% platform
};

const getCommission = (serviceType, amount) => {
  const rate = COMMISSION_RATES[serviceType] || 0.60;
  return (parseFloat(amount || 0) * rate).toFixed(2);
};

const getCommissionRate = (serviceType) => {
  return ((COMMISSION_RATES[serviceType] || 0.60) * 100).toFixed(0);
};

export default function WasherOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try { const res = await getWasherOrders(); setOrders(res.data); } catch { setOrders([]); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); fetchOrders(); } catch {}
  };

  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalEarnings = completedOrders.reduce((sum, o) => sum + parseFloat(getCommission(o.serviceType, o.amount)), 0);

  const stats = {
    assigned: orders.filter(o => o.status === 'ASSIGNED').length,
    inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
    completed: completedOrders.length,
  };

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>My Jobs</h1>
          <p style={styles.pageSub}>Manage your assigned wash jobs</p>
        </div>
        <div style={styles.earningsBadge}>
          <div style={styles.earningsLabel}>Total Earnings</div>
          <div style={styles.earningsValue}>${totalEarnings.toFixed(2)}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          ['🔵', 'Assigned', stats.assigned, '#dbeafe', '#3b82f6'],
          ['🟣', 'In Progress', stats.inProgress, '#ede9fe', '#8b5cf6'],
          ['🟢', 'Completed', stats.completed, '#d1fae5', '#10b981'],
          ['💰', 'Earned', `$${totalEarnings.toFixed(2)}`, '#fef3c7', '#f59e0b'],
        ].map(([icon, label, val, bg, color]) => (
          <div key={label} style={{ ...styles.statCard, background: bg }}>
            <div style={styles.statIcon}>{icon}</div>
            <div style={{ ...styles.statNum, color }}>{val}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Commission legend */}
      <div style={styles.commissionLegend}>
        <div style={styles.legendTitle}>💡 Commission Rates</div>
        <div style={styles.legendGrid}>
          {Object.entries(COMMISSION_RATES).map(([service, rate]) => (
            <div key={service} style={styles.legendItem}>
              <span style={styles.legendService}>{service.replace(/_/g, ' ')}</span>
              <span style={styles.legendRate}>{(rate * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🧹</div>
          <h3>No jobs assigned yet</h3>
          <p>Check back later for new assignments</p>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(o => {
            const commission = getCommission(o.serviceType, o.amount);
            const rate = getCommissionRate(o.serviceType);
            return (
              <div key={o.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.orderId}>Order #{o.id}</div>
                    <div style={styles.licensePlate}>{o.licensePlate}</div>
                  </div>
                  <span style={{ ...styles.badge, background: STATUS_BG[o.status], color: STATUS_COLORS[o.status] }}>
                    {o.status.replace('_', ' ')}
                  </span>
                </div>

                <div style={styles.serviceRow}>
                  <span style={styles.serviceType}>{o.serviceType?.replace(/_/g, ' ')}</span>
                  <div style={styles.amountBlock}>
                    <div style={styles.orderAmount}>Order: ${o.amount}</div>
                    <div style={styles.commissionAmount}>
                      Your cut ({rate}%):
                      <span style={styles.commissionValue}> ${commission}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.metaRow}>
                  <span>👤 {o.customerUsername}</span>
                  <span>📍 {o.address}</span>
                  <span>🕐 {o.scheduledTime ? new Date(o.scheduledTime).toLocaleString() : '-'}</span>
                </div>

                {/* Earnings breakdown for completed */}
                {o.status === 'COMPLETED' && (
                  <div style={styles.earningsBreakdown}>
                    <div style={styles.breakdownRow}>
                      <span>Order Amount</span><span>${parseFloat(o.amount).toFixed(2)}</span>
                    </div>
                    <div style={styles.breakdownRow}>
                      <span>Platform Fee ({100 - parseInt(rate)}%)</span>
                      <span style={{ color: '#ef4444' }}>-${(parseFloat(o.amount) - parseFloat(commission)).toFixed(2)}</span>
                    </div>
                    <div style={{ ...styles.breakdownRow, ...styles.breakdownTotal }}>
                      <span>Your Earnings</span>
                      <span style={{ color: '#10b981' }}>${commission}</span>
                    </div>
                  </div>
                )}

                {NEXT_STATUS[o.status] && (
                  <button
                    style={{ ...styles.actionBtn, background: o.status === 'ASSIGNED' ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#10b981,#059669)' }}
                    onClick={() => handleStatus(o.id, NEXT_STATUS[o.status])}>
                    {NEXT_LABEL[o.status]}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1e293b' },
  pageSub: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  earningsBadge: { background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '14px', padding: '14px 24px', textAlign: 'right' },
  earningsLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  earningsValue: { color: '#fff', fontSize: '28px', fontWeight: '800' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' },
  statCard: { borderRadius: '14px', padding: '18px 14px', textAlign: 'center' },
  statIcon: { fontSize: '22px', marginBottom: '6px' },
  statNum: { fontSize: '26px', fontWeight: '800', marginBottom: '2px' },
  statLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  commissionLegend: { background: '#fff', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  legendTitle: { fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '12px' },
  legendGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' },
  legendItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', padding: '8px 12px' },
  legendService: { fontSize: '12px', color: '#475569', fontWeight: '500' },
  legendRate: { fontSize: '13px', fontWeight: '800', color: '#10b981' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid #e2e8f0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  orderId: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  licensePlate: { fontSize: '20px', fontWeight: '800', color: '#1e293b', marginTop: '2px' },
  badge: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  serviceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' },
  serviceType: { background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  amountBlock: { textAlign: 'right' },
  orderAmount: { fontSize: '13px', color: '#64748b' },
  commissionAmount: { fontSize: '13px', color: '#374151', fontWeight: '600', marginTop: '2px' },
  commissionValue: { color: '#10b981', fontWeight: '800' },
  metaRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b', marginBottom: '12px' },
  earningsBreakdown: { background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px' },
  breakdownRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#374151', padding: '4px 0' },
  breakdownTotal: { fontWeight: '700', borderTop: '1px solid #a7f3d0', paddingTop: '8px', marginTop: '4px', fontSize: '14px' },
  actionBtn: { color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  empty: { textAlign: 'center', padding: '80px 20px', color: '#64748b' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
};
