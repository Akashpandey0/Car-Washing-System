import React, { useEffect, useState, useCallback } from 'react';
import { getMyCars, registerCar } from '../api/cars';
import { useAuth } from '../context/AuthContext';

const INITIAL = { licensePlate: '', make: '', model: '', year: '', color: '', country: '', type: '' };
const CAR_MAKES = ['Toyota','Honda','Ford','BMW','Mercedes','Audi','Hyundai','Kia','Nissan','Chevrolet','Volkswagen','Suzuki','Mahindra','Tata','Other'];
const CAR_MODELS = { Toyota:['Camry','Corolla','Fortuner','Innova','Yaris','Land Cruiser'], Honda:['City','Civic','Accord','CR-V','Jazz','WR-V'], Ford:['Mustang','F-150','Explorer','EcoSport','Endeavour'], BMW:['3 Series','5 Series','7 Series','X1','X3','X5'], Mercedes:['C-Class','E-Class','S-Class','GLA','GLC','GLE'], Audi:['A3','A4','A6','Q3','Q5','Q7'], Hyundai:['i10','i20','Verna','Creta','Tucson','Elantra'], Kia:['Seltos','Sonet','Carnival','Stinger'], Nissan:['Micra','Sunny','Terrano','X-Trail','GT-R'], Chevrolet:['Spark','Beat','Cruze','Trailblazer'], Volkswagen:['Polo','Vento','Tiguan','Passat'], Suzuki:['Swift','Baleno','Dzire','Vitara','Ertiga'], Mahindra:['Scorpio','XUV500','Thar','Bolero'], Tata:['Nexon','Harrier','Safari','Altroz'], Other:['Other'] };
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
const COLORS = ['White','Black','Silver','Grey','Red','Blue','Brown','Green','Yellow','Orange','Gold','Other'];
const COUNTRIES = ['India','USA','Germany','Japan','South Korea','UK','France','Italy','China','Other'];
const CAR_TYPES = ['SEDAN','SUV','HATCHBACK','COUPE','CONVERTIBLE','TRUCK','VAN'];
const TYPE_ICONS = { SEDAN:'🚗', SUV:'🚙', HATCHBACK:'🚘', COUPE:'🏎️', CONVERTIBLE:'🚗', TRUCK:'🚛', VAN:'🚐' };

export default function MyCars() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCars = useCallback(async () => {
    if (!user?.username) return;
    try { const res = await getMyCars(user.username); setCars(res.data); } catch { setCars([]); }
  }, [user?.username]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await registerCar({ ...form, year: parseInt(form.year) });
      setForm(INITIAL); setShowForm(false); fetchCars();
    } catch (err) {
      const d = err.response?.data;
      setError(typeof d === 'string' ? d : d?.message || 'Failed to register car.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>My Cars</h1>
          <p style={styles.pageSub}>{cars.length} vehicle{cars.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add New Car'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>🚗 Register New Vehicle</h3>
          {error && <div style={styles.error}>⚠️ {error}</div>}
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>License Plate *</label>
              <input style={styles.input} placeholder="e.g. MH12AB1234" value={form.licensePlate} onChange={e => setForm({ ...form, licensePlate: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Make *</label>
              <select style={styles.input} value={form.make} onChange={e => setForm({ ...form, make: e.target.value, model: '' })} required>
                <option value="">Select make</option>
                {CAR_MAKES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Model *</label>
              <select style={styles.input} value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required disabled={!form.make}>
                <option value="">Select model</option>
                {(CAR_MODELS[form.make] || []).map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Year *</label>
              <select style={styles.input} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Color *</label>
              <select style={styles.input} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} required>
                <option value="">Select color</option>
                {COLORS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Country *</label>
              <select style={styles.input} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Type *</label>
              <select style={styles.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                <option value="">Select type</option>
                {CAR_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button style={styles.submitBtn} type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Registering...' : '🚗 Register Car'}
          </button>
        </div>
      )}

      {cars.length === 0 && !showForm ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🚗</div>
          <h3 style={styles.emptyTitle}>No cars yet</h3>
          <p style={styles.emptySub}>Add your first vehicle to start booking washes</p>
          <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Add Your First Car</button>
        </div>
      ) : (
        <div style={styles.carsGrid}>
          {cars.map(car => (
            <div key={car.id} style={styles.carCard}>
              <div style={styles.carCardTop}>
                <div style={styles.carTypeIcon}>{TYPE_ICONS[car.type] || '🚗'}</div>
                <span style={styles.carTypeBadge}>{car.type}</span>
              </div>
              <div style={styles.carPlate}>{car.licensePlate}</div>
              <div style={styles.carName}>{car.year} {car.make} {car.model}</div>
              <div style={styles.carMeta}>
                <span style={styles.metaTag}>🎨 {car.color}</span>
                <span style={styles.metaTag}>🌍 {car.country}</span>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1e293b' },
  pageSub: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  addBtn: { background: 'linear-gradient(135deg, #4f46e5, #3730a3)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' },
  formCard: { background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', marginBottom: '28px', border: '1px solid #e2e8f0' },
  formTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', border: '1px solid #fecaca' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' },
  field: {},
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#1e293b', boxSizing: 'border-box', background: '#f8fafc' },
  submitBtn: { background: 'linear-gradient(135deg, #4f46e5, #3730a3)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' },
  carsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  carCard: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid #e2e8f0', transition: 'transform 0.2s, box-shadow 0.2s' },
  carCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  carTypeIcon: { fontSize: '32px' },
  carTypeBadge: { background: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  carPlate: { fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '4px', letterSpacing: '1px' },
  carName: { fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '12px' },
  carMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  metaTag: { background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  emptyTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  emptySub: { color: '#64748b', fontSize: '14px', marginBottom: '24px' },
};
