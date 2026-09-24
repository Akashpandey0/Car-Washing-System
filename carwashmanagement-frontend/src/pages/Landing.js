import React from 'react';
import { Link } from 'react-router-dom';

const SERVICES = [
  { icon: '💧', name: 'Basic Wash', price: '$9.99', desc: 'Exterior rinse & dry', color: '#dbeafe', accent: '#3b82f6' },
  { icon: '✨', name: 'Premium Wash', price: '$19.99', desc: 'Full exterior + wax', color: '#ede9fe', accent: '#8b5cf6' },
  { icon: '🪑', name: 'Interior Clean', price: '$29.99', desc: 'Deep interior vacuum & wipe', color: '#d1fae5', accent: '#10b981' },
  { icon: '🏆', name: 'Full Detail', price: '$49.99', desc: 'Complete inside & out', color: '#fef3c7', accent: '#f59e0b' },
];

const STEPS = [
  { icon: '📝', title: 'Register & Add Car', desc: 'Create your account and add your vehicle details' },
  { icon: '📅', title: 'Book a Service', desc: 'Choose a service and pick your preferred time slot' },
  { icon: '🧹', title: 'We Come to You', desc: 'A professional washer is assigned and arrives on time' },
  { icon: '✅', title: 'Pay & Get Receipt', desc: 'Pay securely via Stripe and download your PDF receipt' },
];

export default function Landing() {
  return (
    <div style={s.page}>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroBadge} className="landing-badge">🚿 Professional Car Wash Service</div>
          <h1 style={s.heroTitle} className="landing-title">
            Your Car Deserves<br /><span style={s.heroAccent}>The Best Care</span>
          </h1>
          <p style={s.heroSub} className="landing-sub">
            Book a professional car wash at your doorstep. Fast, reliable, and affordable.
          </p>
          <div style={s.heroActions} className="landing-actions">
            <Link to="/register" style={s.btnPrimary}>Get Started Free →</Link>
            <Link to="/login" style={s.btnSecondary}>Sign In</Link>
          </div>
          <div style={s.heroStats} className="landing-stats">
            {[['500+', 'Happy Customers'], ['1000+', 'Cars Washed'], ['50+', 'Expert Washers'], ['4.9★', 'Rating']].map(([n, l]) => (
              <div key={l} style={s.stat} className="landing-stat">
                <div style={s.statNum}>{n}</div>
                <div style={s.statLabel}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={s.heroCard} className="landing-hero-card">
          <div style={s.heroCardBadge}>● Live Booking</div>
          <div style={s.heroCardIcon}>🚗</div>
          <div style={s.heroCardTitle}>Premium Wash</div>
          <div style={s.heroCardSub}>Scheduled for Today, 3:00 PM</div>
          <div style={s.heroCardStatus}>✅ Washer Assigned</div>
          <div style={s.heroCardPrice}>$19.99</div>
        </div>
      </div>

      {/* Services */}
      <div style={s.section}>
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>Our Services</h2>
          <p style={s.sectionSub}>Choose the perfect wash package for your car</p>
        </div>
        <div style={s.servicesGrid}>
          {SERVICES.map(sv => (
            <div key={sv.name} style={{ ...s.serviceCard, background: sv.color }} className="landing-service-card">
              <div style={s.serviceIcon}>{sv.icon}</div>
              <div style={s.serviceName}>{sv.name}</div>
              <div style={s.serviceDesc}>{sv.desc}</div>
              <div style={{ ...s.servicePrice, color: sv.accent }}>{sv.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={s.stepsSection}>
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>How It Works</h2>
          <p style={s.sectionSub}>Get your car washed in 4 simple steps</p>
        </div>
        <div style={s.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={s.stepCard} className="landing-step-card">
              <div style={s.stepNum}>{i + 1}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={s.cta}>
        <h2 style={s.ctaTitle} className="landing-title">Ready to Get Started?</h2>
        <p style={s.ctaSub} className="landing-sub">Join hundreds of happy customers today</p>
        <div style={s.ctaActions}>
          <Link to="/register" style={s.ctaBtnPrimary} className="landing-cta-btn">Create Free Account</Link>
          <Link to="/login" style={s.ctaBtnSecondary}>Already have an account? Sign In</Link>
        </div>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.footerBrand}>🚿 CarWashPro</div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#f0f4ff', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 60%, #1e1b4b 100%)', padding: '80px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' },
  heroInner: { flex: 1, minWidth: '280px', maxWidth: '560px' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#a5b4fc', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '20px', border: '1px solid rgba(165,180,252,0.3)' },
  heroTitle: { fontSize: '52px', fontWeight: '800', color: '#fff', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-1px' },
  heroAccent: { color: '#a5b4fc' },
  heroSub: { fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '32px' },
  heroActions: { display: 'flex', gap: '14px', marginBottom: '48px', flexWrap: 'wrap' },
  btnPrimary: { background: '#fff', color: '#4f46e5', padding: '14px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textDecoration: 'none' },
  btnSecondary: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' },
  heroStats: { display: 'flex', gap: '32px', flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  statNum: { fontSize: '26px', fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginTop: '2px' },
  heroCard: { background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '28px', textAlign: 'center', minWidth: '200px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  heroCardBadge: { color: '#6ee7b7', fontSize: '12px', fontWeight: '600', marginBottom: '16px' },
  heroCardIcon: { fontSize: '48px', marginBottom: '12px' },
  heroCardTitle: { color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '6px' },
  heroCardSub: { color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginBottom: '12px' },
  heroCardStatus: { color: '#6ee7b7', fontSize: '13px', fontWeight: '600', marginBottom: '12px' },
  heroCardPrice: { color: '#fff', fontSize: '28px', fontWeight: '800' },
  section: { maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 20px' },
  sectionHead: { textAlign: 'center', marginBottom: '40px' },
  sectionTitle: { fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' },
  sectionSub: { fontSize: '16px', color: '#64748b' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  serviceCard: { borderRadius: '16px', padding: '28px 20px', textAlign: 'center' },
  serviceIcon: { fontSize: '36px', marginBottom: '12px' },
  serviceName: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' },
  serviceDesc: { fontSize: '13px', color: '#64748b', marginBottom: '12px' },
  servicePrice: { fontSize: '22px', fontWeight: '800' },
  stepsSection: { background: '#fff', margin: '40px 24px', borderRadius: '24px', padding: '60px 40px' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' },
  stepCard: { textAlign: 'center', padding: '24px 16px' },
  stepNum: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#3730a3)', color: '#fff', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  stepIcon: { fontSize: '36px', marginBottom: '12px' },
  stepTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  stepDesc: { fontSize: '13px', color: '#64748b', lineHeight: 1.6 },
  cta: { background: 'linear-gradient(135deg,#4f46e5,#3730a3)', margin: '40px 24px', borderRadius: '24px', padding: '60px 40px', textAlign: 'center' },
  ctaTitle: { fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  ctaSub: { fontSize: '16px', color: 'rgba(255,255,255,0.75)', marginBottom: '32px' },
  ctaActions: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnPrimary: { background: '#fff', color: '#4f46e5', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', textDecoration: 'none' },
  ctaBtnSecondary: { color: 'rgba(255,255,255,0.85)', padding: '14px 20px', borderRadius: '10px', fontWeight: '500', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' },
  footer: { textAlign: 'center', padding: '32px 24px', borderTop: '1px solid #e2e8f0', marginTop: '40px' },
  footerBrand: { fontSize: '18px', fontWeight: '800', color: '#4f46e5' },
};
