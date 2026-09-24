import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders, createOrder, updateOrderStatus } from '../api/orders';
import { getMyCars } from '../api/cars';
import { refundByOrderId } from '../api/payments';
import { useAuth } from '../context/AuthContext';

const SERVICE_PRICES = { BASIC_WASH: 9.99, PREMIUM_WASH: 19.99, FULL_DETAIL: 49.99, INTERIOR_CLEAN: 29.99 };
const SERVICE_LABELS = { BASIC_WASH: 'Basic Wash — $9.99', PREMIUM_WASH: 'Premium Wash — $19.99', FULL_DETAIL: 'Full Detail — $49.99', INTERIOR_CLEAN: 'Interior Clean — $29.99' };
const INITIAL = { licensePlate: '', serviceType: 'BASIC_WASH', scheduledTime: '', address: '', specialInstructions: '', amount: SERVICE_PRICES.BASIC_WASH };
const STATUS_COLORS = { PENDING: '#f59e0b', ASSIGNED: '#3b82f6', IN_PROGRESS: '#8b5cf6', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
const STATUS_BG = { PENDING: '#fef3c7', ASSIGNED: '#dbeafe', IN_PROGRESS: '#ede9fe', COMPLETED: '#d1fae5', CANCELLED: '#fee2e2' };

const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');

  const fetchOrders = useCallback(async () => {
    try { const res = await getMyOrders(); setOrders(res.data); } catch { setOrders([]); }
  }, []);

  useEffect(() => {
    fetchOrders();
    if (user?.username) {
      getMyCars(user.username).then(r => setCars(r.data)).catch(() => {});
    }
  }, [fetchOrders, user?.username]);

  const handleServiceChange = (serviceType) => setForm({ ...form, serviceType, amount: SERVICE_PRICES[serviceType] });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await createOrder({ ...form, amount: parseFloat(form.amount) });
      const order = res.data;
      setForm(INITIAL); setShowForm(false); fetchOrders();
      navigate(`/payments?orderId=${order.id}&amount=${order.amount}`);
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'string' ? d : d?.message || 'Failed to create order.');
    } finally { setLoading(false); }
  };

  const handleCancel = async (id, amount) => {
    if (!window.confirm('Cancel this order? If paid, a refund (excluding 8% tax) will be processed.')) return;
    try {
      await updateOrderStatus(id, 'CANCELLED');
      // attempt refund — only succeeds if payment was completed
      try {
        const res = await refundByOrderId(id);
        const refund = res.data;
        setCancelMsg(`Order cancelled. Refund of $${refund.refundAmount} processed (tax $${refund.taxAmount} deducted).`);
      } catch {
        setCancelMsg('Order cancelled. No payment found to refund.');
      }
      fetchOrders();
    } catch {}
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-sub">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Order'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 style={s.formTitle}>🚿 Book a Car Wash</h3>
          {error && <div className="alert-error">⚠️ {error}</div>}
          <div className="form-grid">
            <div className="field">
              <label className="label">Car (License Plate)</label>
              <select className="input" value={form.licensePlate} onChange={e => setForm({ ...form, licensePlate: e.target.value })} required>
                <option value="">Select car</option>
                {cars.map(c => <option key={c.id} value={c.licensePlate}>{c.licensePlate} — {c.make} {c.model}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Service Type</label>
              <select className="input" value={form.serviceType} onChange={e => handleServiceChange(e.target.value)}>
                {Object.keys(SERVICE_LABELS).map(s => <option key={s} value={s}>{SERVICE_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Amount</label>
              <input className="input input-readonly" value={`$${form.amount}`} readOnly />
            </div>
            <div className="field">
              <label className="label">Scheduled Time</label>
              <input className="input" type="datetime-local" value={form.scheduledTime} min={getMinDateTime()} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} required />
            </div>
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <label className="label">Special Instructions</label>
              <input className="input" value={form.specialInstructions} onChange={e => setForm({ ...form, specialInstructions: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Booking...' : '🚿 Book Now'}
          </button>
        </div>
      )}

      {cancelMsg && <div className="alert-success" style={{ marginBottom: '16px' }}>💰 {cancelMsg}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3 className="empty-title">No orders yet</h3>
          <p className="empty-sub">Book your first car wash service</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Order</button>
        </div>
      ) : (
        <div className="order-list">
          {orders.map(o => (
            <div key={o.id} className="order-card">
              <div className="order-card-top">
                <div>
                  <div style={s.orderId}>Order #{o.id}</div>
                  <div style={s.licensePlate}>{o.licensePlate}</div>
                </div>
                <span style={{ ...s.badge, background: STATUS_BG[o.status], color: STATUS_COLORS[o.status] }}>
                  {o.status?.replace('_', ' ')}
                </span>
              </div>
              <div style={s.serviceRow}>
                <span style={s.serviceTag}>{SERVICE_LABELS[o.serviceType] || o.serviceType}</span>
                <span style={s.amount}>${o.amount}</span>
              </div>
              <div className="order-meta">
                <span>📍 {o.address}</span>
                <span>🕐 {o.scheduledTime ? new Date(o.scheduledTime).toLocaleString() : '-'}</span>
                {o.washerUsername && <span>🧹 {o.washerUsername}</span>}
              </div>
              {o.status === 'PENDING' && (
                <button style={s.cancelBtn} onClick={() => handleCancel(o.id, o.amount)}>✕ Cancel Order</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  formTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  orderId: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  licensePlate: { fontSize: '20px', fontWeight: '800', color: '#1e293b', marginTop: '2px' },
  badge: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  serviceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' },
  serviceTag: { background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  amount: { fontSize: '20px', fontWeight: '800', color: '#1e293b' },
  cancelBtn: { marginTop: '12px', padding: '7px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
};
