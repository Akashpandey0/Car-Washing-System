import React, { useEffect, useState } from 'react';
import { getAllUsers, adminRegister, deleteUser } from '../api/auth';

const ROLES = ['CUSTOMER', 'WASHER', 'ADMIN'];
const INITIAL = { username: '', password: '', email: '', role: 'WASHER' };
const ROLE_COLORS = { CUSTOMER: '#3b82f6', WASHER: '#10b981', ADMIN: '#ef4444' };
const ROLE_BG = { CUSTOMER: '#dbeafe', WASHER: '#d1fae5', ADMIN: '#fee2e2' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(INITIAL);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = () => { getAllUsers().then(r => setUsers(r.data)).catch(() => {}); };
  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setMsg(''); setError('');
    try {
      await adminRegister(form.role, { username: form.username, password: form.password, email: form.email });
      setMsg(`✅ User "${form.username}" created as ${form.role}.`);
      setForm(INITIAL); setShowForm(false); fetchUsers();
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'string' ? d : d?.message || 'Failed to create user.');
    }
  };

  const handleDelete = async (username) => {
    if (!window.confirm(`Delete washer "${username}"? This cannot be undone.`)) return;
    setMsg(''); setError(''); setDeletingId(username);
    try {
      await deleteUser(username);
      setMsg(`✅ Washer "${username}" deleted.`);
      fetchUsers();
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'string' ? d : d?.message || 'Failed to delete user.');
    } finally { setDeletingId(null); }
  };

  const filtered = users.filter(u =>
    (roleFilter === 'ALL' || u.role === roleFilter) &&
    (u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = ROLES.reduce((acc, r) => ({ ...acc, [r]: users.filter(u => u.role === r).length }), {});

  return (
    <div className="page-wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-sub">{users.length} total users</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Create User'}
        </button>
      </div>

      {msg && <div className="alert-success">{msg}</div>}
      {error && <div className="alert-error">⚠️ {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {ROLES.map(r => (
          <div key={r} style={{ ...s.statCard, background: ROLE_BG[r] }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: ROLE_COLORS[r], marginBottom: '4px' }}>{counts[r] || 0}</div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', letterSpacing: '1px' }}>{r}S</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: '24px' }}>
          <h3 style={s.formTitle}>➕ Create New User</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div>
                <label className="label">Role</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ROLES.map(r => (
                    <button key={r} type="button"
                      style={{ ...s.roleBtn, ...(form.role === r ? { border: `2px solid ${ROLE_COLORS[r]}`, background: ROLE_BG[r], color: ROLE_COLORS[r] } : {}) }}
                      onClick={() => setForm({ ...form, role: r })}>
                      {r === 'CUSTOMER' ? '👤' : r === 'WASHER' ? '🧹' : '⚙️'} {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Username</label>
                <input className="input" placeholder="Enter username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="user@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Set password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            <button style={s.submitBtn} type="submit">Create User</button>
          </form>
        </div>
      )}

      <div style={s.tableCard}>
        <div style={s.tableHeader}>
          <input style={s.search} placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="filter-row" style={{ margin: 0 }}>
            {['ALL', ...ROLES].map(r => (
              <button key={r} className={`filter-btn ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="table-responsive">
          <table style={s.table}>
            <thead>
              <tr>
                {['ID', 'Username', 'Email', 'Role', 'Status', 'Action'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ ...s.tr, background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={s.td}><span style={s.idBadge}>{u.id}</span></td>
                  <td style={s.td}>
                    <div style={s.userCell}>
                      <div style={{ ...s.avatar, background: ROLE_BG[u.role], color: ROLE_COLORS[u.role] }}>
                        {u.username[0].toUpperCase()}
                      </div>
                      <span style={s.username}>{u.username}</span>
                    </div>
                  </td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}>
                    <span style={{ ...s.roleBadge, background: ROLE_BG[u.role], color: ROLE_COLORS[u.role] }}>
                      {u.role === 'CUSTOMER' ? '👤' : u.role === 'WASHER' ? '🧹' : '⚙️'} {u.role}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={{ color: u.active ? '#10b981' : '#ef4444', fontWeight: '600', fontSize: '13px' }}>
                      {u.active ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td style={s.td}>
                    {u.role === 'WASHER' ? (
                      <button style={s.deleteBtn} onClick={() => handleDelete(u.username)} disabled={deletingId === u.username}>
                        {deletingId === u.username ? '⏳' : '🗑️ Delete'}
                      </button>
                    ) : (
                      <span style={{ color: '#cbd5e1' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={s.empty}>No users found.</div>}
      </div>
    </div>
  );
}

const s = {
  addBtn: { background: 'linear-gradient(135deg,#4f46e5,#3730a3)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' },
  statCard: { borderRadius: '14px', padding: '20px', textAlign: 'center' },
  formTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  roleBtn: { padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: '#64748b', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { background: 'linear-gradient(135deg,#4f46e5,#3730a3)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginTop: '8px' },
  tableCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' },
  search: { padding: '8px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', width: '240px', background: '#f8fafc' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#1e293b' },
  idBadge: { background: '#eef2ff', color: '#4f46e5', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 },
  username: { fontWeight: '600', color: '#1e293b' },
  roleBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  deleteBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
};
