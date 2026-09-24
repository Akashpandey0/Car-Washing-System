import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

const ROLES = ['CUSTOMER', 'WASHER'];

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', email: '', role: 'CUSTOMER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await register(form.role, { username: form.username, password: form.password, email: form.email });
      const msg = typeof res.data === 'string' ? res.data : 'Registration successful!';
      setSuccess(msg);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'string' ? d : d?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>🚿 CarWashPro</div>
          <h2 style={styles.leftTitle}>Join Us Today!</h2>
          <p style={styles.leftSub}>Create your account and start enjoying professional car wash services</p>
          <div style={styles.roleCards}>
            <div style={styles.roleCard}>
              <div style={styles.roleCardIcon}>👤</div>
              <div style={styles.roleCardTitle}>Customer</div>
              <div style={styles.roleCardDesc}>Book washes, track orders, pay securely</div>
            </div>
            <div style={styles.roleCard}>
              <div style={styles.roleCardIcon}>🧹</div>
              <div style={styles.roleCardTitle}>Washer</div>
              <div style={styles.roleCardDesc}>Accept jobs, update status, earn money</div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Fill in your details to get started</p>
          {error && <div style={styles.error}>⚠️ {error}</div>}
          {success && <div style={styles.successMsg}>✅ {success}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>I am a</label>
              <div className="role-group">
                {ROLES.map(r => (
                  <button key={r} type="button"
                    className="role-btn"
                    style={form.role === r ? { border: '2px solid #10b981', background: '#f0fdf4', color: '#10b981' } : {}}
                    onClick={() => setForm({ ...form, role: r })}>
                    {r === 'CUSTOMER' ? '👤' : '🧹'} {r}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.input} placeholder="Choose a username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Create a strong password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button style={styles.submitBtn} className="btn-full" type="submit" disabled={loading}>
              {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p style={styles.footer}>Already have an account? <Link to="/login" style={styles.link}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  leftContent: { maxWidth: '360px' },
  logo: { color: '#a7f3d0', fontSize: '20px', fontWeight: '700', marginBottom: '32px' },
  leftTitle: { color: '#fff', fontSize: '36px', fontWeight: '800', marginBottom: '12px' },
  leftSub: { color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 },
  roleCards: { display: 'flex', flexDirection: 'column', gap: '12px' },
  roleCard: { background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.2)' },
  roleCardIcon: { fontSize: '24px', marginBottom: '6px' },
  roleCardTitle: { color: '#fff', fontWeight: '700', fontSize: '14px', marginBottom: '4px' },
  roleCardDesc: { color: 'rgba(255,255,255,0.75)', fontSize: '12px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' },
  subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '28px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid #fecaca' },
  successMsg: { background: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid #bbf7d0' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#1e293b', boxSizing: 'border-box', transition: 'border 0.2s' },
  submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', marginTop: '8px', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
  link: { color: '#10b981', fontWeight: '600' },
};
