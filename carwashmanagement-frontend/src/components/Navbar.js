import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { logoutUser(); navigate('/'); setDrawerOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLinks = user?.role === 'CUSTOMER'
    ? [{ to: '/cars', label: '🚗 My Cars' }, { to: '/orders', label: '📋 My Orders' }, { to: '/payments', label: '💳 Payments' }]
    : user?.role === 'WASHER'
    ? [{ to: '/washer-orders', label: '🧹 My Jobs' }]
    : user?.role === 'ADMIN'
    ? [{ to: '/admin/cars', label: '🚗 All Cars' }, { to: '/admin/orders', label: '📋 All Orders' }, { to: '/admin/users', label: '👥 Users' }]
    : [];

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav style={s.nav}>
        <Link to="/" style={s.brand}>
          <span>🚿</span>
          <span>CarWash<span style={{ color: '#a5b4fc' }}>Pro</span></span>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop-links">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              style={{ ...s.link, ...(isActive(l.to) ? s.linkActive : {}) }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div style={s.right}>
          {user ? (
            <>
              <div style={s.userChip} className="nav-user-chip">
                <div style={s.avatar}>{user.username[0].toUpperCase()}</div>
                <div style={s.userInfo}>
                  <div style={s.userName}>{user.username}</div>
                  <div style={s.userRole}>{user.role}</div>
                </div>
              </div>
              <button style={s.logoutBtn} className="nav-logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.loginBtn} className="nav-login-btn">Login</Link>
              <Link to="/register" style={s.registerBtn} className="nav-register-btn">Register</Link>
            </>
          )}
          {/* Hamburger - always visible */}
          <button className="nav-hamburger" onClick={() => setDrawerOpen(true)}>☰</button>
        </div>
      </nav>

      {/* ── Overlay ── */}
      {drawerOpen && (
        <div style={s.overlay} onClick={() => setDrawerOpen(false)} />
      )}

      {/* ── Side Drawer ── */}
      <div style={{ ...s.drawer, transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        {/* Drawer Header */}
        <div style={s.drawerHeader}>
          <div style={s.drawerBrand}>🚿 CarWashPro</div>
          <button style={s.closeBtn} onClick={() => setDrawerOpen(false)}>✕</button>
        </div>

        {/* User info inside drawer */}
        {user && (
          <div style={s.drawerUser}>
            <div style={s.drawerAvatar}>{user.username[0].toUpperCase()}</div>
            <div>
              <div style={s.drawerUserName}>{user.username}</div>
              <div style={s.drawerUserRole}>{user.role}</div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div style={s.drawerLinks}>
          <div style={s.drawerSection}>Navigation</div>
          <Link to="/" style={{ ...s.drawerLink, ...(isActive('/') ? s.drawerLinkActive : {}) }}
            onClick={() => setDrawerOpen(false)}>
            🏠 Home
          </Link>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              style={{ ...s.drawerLink, ...(isActive(l.to) ? s.drawerLinkActive : {}) }}
              onClick={() => setDrawerOpen(false)}>
              {l.label}
            </Link>
          ))}
          {!user && (
            <>
              <div style={s.drawerSection}>Account</div>
              <Link to="/login" style={s.drawerLink} onClick={() => setDrawerOpen(false)}>🔑 Login</Link>
              <Link to="/register" style={s.drawerLink} onClick={() => setDrawerOpen(false)}>✏️ Register</Link>
            </>
          )}
        </div>

        {/* Logout at bottom */}
        {user && (
          <div style={s.drawerFooter}>
            <button style={s.drawerLogout} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const s = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', height: '64px', boxShadow: '0 4px 20px rgba(79,70,229,0.3)', position: 'sticky', top: 0, zIndex: 200 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '800', fontSize: '22px', letterSpacing: '-0.5px', textDecoration: 'none' },
  desktopLinks: { display: 'flex', alignItems: 'center', gap: '4px' },
  link: { color: 'rgba(255,255,255,0.8)', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s' },
  linkActive: { background: 'rgba(255,255,255,0.2)', color: '#fff' },
  right: { display: 'flex', alignItems: 'center', gap: '12px' },
  userChip: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px 6px 8px', borderRadius: '40px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#a5b4fc', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 },
  userInfo: {},
  userName: { color: '#fff', fontSize: '13px', fontWeight: '600', lineHeight: 1.2 },
  userRole: { color: '#a5b4fc', fontSize: '11px', fontWeight: '500' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  loginBtn: { color: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' },
  registerBtn: { background: '#fff', color: '#4f46e5', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', textDecoration: 'none' },
  hamburger: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '18px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', lineHeight: 1 },

  /* Overlay */
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, backdropFilter: 'blur(2px)' },

  /* Drawer */
  drawer: { position: 'fixed', top: 0, right: 0, width: '280px', height: '100vh', background: '#fff', zIndex: 400, boxShadow: '-8px 0 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' },
  drawerHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', background: 'linear-gradient(135deg, #4f46e5, #3730a3)', flexShrink: 0 },
  drawerBrand: { color: '#fff', fontWeight: '800', fontSize: '18px' },
  closeBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  drawerUser: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexShrink: 0 },
  drawerAvatar: { width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#3730a3)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px', flexShrink: 0 },
  drawerUserName: { fontWeight: '700', color: '#1e293b', fontSize: '15px' },
  drawerUserRole: { color: '#64748b', fontSize: '12px', fontWeight: '500', marginTop: '2px' },

  drawerLinks: { flex: 1, overflowY: 'auto', padding: '12px 12px' },
  drawerSection: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', padding: '12px 8px 6px' },
  drawerLink: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', color: '#374151', fontSize: '14px', fontWeight: '500', textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s' },
  drawerLinkActive: { background: '#eef2ff', color: '#4f46e5', fontWeight: '600' },

  drawerFooter: { padding: '16px 20px', borderTop: '1px solid #e2e8f0', flexShrink: 0 },
  drawerLogout: { width: '100%', padding: '12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'center' },
};
