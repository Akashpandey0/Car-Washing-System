import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const ROLES = ['CUSTOMER', 'WASHER', 'ADMIN'];

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '', role: 'CUSTOMER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await login(form.role, { username: form.username, password: form.password });
      loginUser(res.data);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (!err.response) setError('Cannot connect to server. Make sure the backend is running.');
      else {
        const d = err.response?.data;
        setError(typeof d === 'string' ? d : d?.message || 'Invalid credentials. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>🚿 CarWashPro</div>
          <h2 style={styles.leftTitle}>Welcome back!</h2>
          <p style={styles.leftSub}>Sign in to manage your car wash services</p>
          <div style={styles.features}>
            {['Book a wash anytime', 'Track order status live', 'Secure Stripe payments', 'Download PDF receipts'].map(f => (
              <div key={f} style={styles.feature}>✓ {f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 style={styles.title}>Sign In</h2>
          <p style={styles.subtitle}>Enter your credentials to continue</p>
          {error && <div style={styles.error}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Login As</label>
              <div className="role-group">
                {ROLES.map(r => (
                  <button key={r} type="button"
                    className="role-btn"
                    style={form.role === r ? { border: '2px solid #4f46e5', background: '#eef2ff', color: '#4f46e5' } : {}}
                    onClick={() => setForm({ ...form, role: r })}>
                    {r === 'CUSTOMER' ? '👤' : r === 'WASHER' ? '🧹' : '⚙️'} {r}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.input} className="input" placeholder="Enter username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} className="input" type="password" placeholder="Enter password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button style={styles.submitBtn} className="btn-full" type="submit" disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={styles.footer}>Don't have an account? <Link to="/register" style={styles.link}>Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  leftContent: { maxWidth: '360px' },
  logo: { color: '#a5b4fc', fontSize: '20px', fontWeight: '700', marginBottom: '32px' },
  leftTitle: { color: '#fff', fontSize: '36px', fontWeight: '800', marginBottom: '12px' },
  leftSub: { color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 },
  features: { display: 'flex', flexDirection: 'column', gap: '12px' },
  feature: { color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' },
  subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '28px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid #fecaca' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' },
  input: { width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#1e293b', boxSizing: 'border-box', transition: 'border 0.2s' },
  submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #3730a3)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', marginTop: '8px', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
  link: { color: '#4f46e5', fontWeight: '600' },
};
