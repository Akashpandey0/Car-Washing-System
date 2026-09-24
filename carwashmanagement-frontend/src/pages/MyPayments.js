import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyPayments, createCheckoutSession, downloadReceipt, verifyPayment } from '../api/payments';

const STATUS_COLORS = { PENDING: '#f59e0b', COMPLETED: '#10b981', FAILED: '#ef4444', REFUNDED: '#8b5cf6' };
const STATUS_BG = { PENDING: '#fef3c7', COMPLETED: '#d1fae5', FAILED: '#fee2e2', REFUNDED: '#ede9fe' };

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('success');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    if (params.get('cancelled')) { setNotice('Payment was cancelled.'); setNoticeType('error'); }
    if (params.get('success') && sessionId) {
      verifyPayment(sessionId)
        .then(() => { setNotice('✅ Payment successful! Your order has been paid.'); setNoticeType('success'); getMyPayments().then(r => setPayments(r.data)).catch(() => {}); })
        .catch(() => { setNotice('⚠️ Payment done but status update failed. Please refresh.'); setNoticeType('warning'); });
    } else {
      getMyPayments().then(r => setPayments(r.data)).catch(() => {});
    }
    if (params.get('orderId')) setOrderId(params.get('orderId'));
    if (params.get('amount')) setAmount(params.get('amount'));
  }, [location.search]);

  const handleCheckout = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await createCheckoutSession({
        orderId: parseInt(orderId),
        amount: parseFloat(amount),
        successUrl: `${window.location.origin}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payments?cancelled=true`,
      });
      window.location.href = res.data;
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'string' ? d : d?.message || 'Failed to create checkout session.');
    } finally { setLoading(false); }
  };

  const handleReceipt = async (paymentId) => {
    try {
      const res = await downloadReceipt(paymentId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `receipt_${paymentId}.pdf`; a.click();
    } catch {}
  };

  const totalPaid = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + parseFloat(p.amount || 0), 0);

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Payments</h1>
          <p style={styles.pageSub}>Manage your payments and receipts</p>
        </div>
        <div style={styles.totalCard}>
          <div style={styles.totalLabel}>Total Paid</div>
          <div style={styles.totalAmount}>${totalPaid.toFixed(2)}</div>
        </div>
      </div>

      {notice && <div style={noticeType === 'success' ? styles.successBanner : styles.errorBanner}>{notice}</div>}

      <div style={styles.payCard}>
        <h3 style={styles.cardTitle}>💳 Pay for an Order</h3>
        {error && <div style={styles.error}>⚠️ {error}</div>}
        <form onSubmit={handleCheckout} style={styles.payForm}>
          <div style={styles.field}>
            <label style={styles.label}>Order ID</label>
            <input style={styles.input} type="number" placeholder="Enter order ID" value={orderId} onChange={e => setOrderId(e.target.value)} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Amount ($)</label>
            <input style={styles.input} type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <button style={styles.payBtn} type="submit" disabled={loading}>
            {loading ? '⏳ Redirecting...' : '💳 Pay via Stripe'}
          </button>
        </form>
      </div>

      <h2 style={styles.sectionTitle}>Payment History</h2>
      {payments.length === 0 ? (
        <div style={styles.empty}><div style={styles.emptyIcon}>💳</div><p>No payments yet.</p></div>
      ) : (
        <div style={styles.list}>
          {payments.map(p => (
            <div key={p.id} style={styles.paymentCard}>
              <div style={styles.paymentLeft}>
                <div style={styles.paymentId}>Payment #{p.id}</div>
                <div style={styles.paymentOrder}>Order #{p.orderId}</div>
                {p.transactionId && <div style={styles.txn}>TXN: {p.transactionId?.slice(0, 20)}...</div>}
                <div style={styles.paymentDate}>{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
              </div>
              <div style={styles.paymentRight}>
                <div style={styles.paymentAmount}>${p.amount}</div>
                <span style={{ ...styles.statusBadge, background: STATUS_BG[p.status], color: STATUS_COLORS[p.status] }}>{p.status}</span>
                {p.status === 'REFUNDED' && p.refundAmount && (
                  <div style={styles.refundBox}>
                    <div style={styles.refundRow}><span>Paid</span><span>${parseFloat(p.amount).toFixed(2)}</span></div>
                    <div style={styles.refundRow}><span>Tax (8%)</span><span style={{ color: '#ef4444' }}>-${parseFloat(p.taxAmount || 0).toFixed(2)}</span></div>
                    <div style={{ ...styles.refundRow, fontWeight: '700', borderTop: '1px solid #a7f3d0', paddingTop: '6px', marginTop: '2px' }}>
                      <span>Refunded</span><span style={{ color: '#10b981' }}>${parseFloat(p.refundAmount).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                {p.status === 'COMPLETED' && (
                  <button style={styles.receiptBtn} onClick={() => handleReceipt(p.id)}>📄 Receipt</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '36px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1e293b' },
  pageSub: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  totalCard: { background: 'linear-gradient(135deg, #4f46e5, #3730a3)', borderRadius: '14px', padding: '16px 24px', textAlign: 'right' },
  totalLabel: { color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' },
  totalAmount: { color: '#fff', fontSize: '28px', fontWeight: '800' },
  successBanner: { background: '#d1fae5', color: '#065f46', padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', fontWeight: '500', border: '1px solid #a7f3d0' },
  errorBanner: { background: '#fee2e2', color: '#991b1b', padding: '14px 20px', borderRadius: '12px', marginBottom: '20px', fontWeight: '500', border: '1px solid #fecaca' },
  payCard: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', marginBottom: '28px', border: '1px solid #e2e8f0' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #fecaca' },
  payForm: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
  field: { flex: 1, minWidth: '140px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#1e293b', boxSizing: 'border-box', background: '#f8fafc' },
  payBtn: { background: 'linear-gradient(135deg, #4f46e5, #3730a3)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  paymentCard: { background: '#fff', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  paymentLeft: {},
  paymentId: { fontWeight: '700', color: '#1e293b', fontSize: '15px' },
  paymentOrder: { color: '#64748b', fontSize: '13px', marginTop: '2px' },
  txn: { color: '#94a3b8', fontSize: '11px', marginTop: '4px', fontFamily: 'monospace' },
  paymentDate: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
  paymentRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  paymentAmount: { fontSize: '22px', fontWeight: '800', color: '#1e293b' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  receiptBtn: { background: '#d1fae5', color: '#065f46', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  refundBox: { background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1e293b', minWidth: '160px' },
  refundRow: { display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '3px 0' },
  empty: { textAlign: 'center', padding: '60px', color: '#64748b' },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
};
