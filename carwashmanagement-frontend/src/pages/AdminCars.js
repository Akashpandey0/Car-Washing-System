import React, { useEffect, useState } from 'react';
import { getAllCars } from '../api/cars';

const TYPE_ICONS = { SEDAN:'🚗', SUV:'🚙', HATCHBACK:'🚘', COUPE:'🏎️', CONVERTIBLE:'🚗', TRUCK:'🚛', VAN:'🚐' };

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { getAllCars().then(r => setCars(r.data)).catch(() => {}); }, []);

  const filtered = cars.filter(c =>
    c.licensePlate?.toLowerCase().includes(search.toLowerCase()) ||
    c.customerUsername?.toLowerCase().includes(search.toLowerCase()) ||
    c.make?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wide">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>All Cars</h1>
          <p style={styles.pageSub}>{cars.length} vehicles registered</p>
        </div>
        <input style={styles.search} placeholder="🔍 Search by plate, owner, make..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}><div style={styles.emptyIcon}>🚗</div><p>No cars found.</p></div>
      ) : (
          <div className="table-responsive">
          <table style={styles.table}>
            <thead>
              <tr>
                {['#', 'Type', 'License Plate', 'Make & Model', 'Year', 'Color', 'Country', 'Owner'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ ...styles.tr, background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={styles.td}><span style={styles.idBadge}>{c.id}</span></td>
                  <td style={styles.td}><span style={styles.typeIcon}>{TYPE_ICONS[c.type] || '🚗'}</span></td>
                  <td style={styles.td}><span style={styles.plate}>{c.licensePlate}</span></td>
                  <td style={styles.td}><div style={styles.makeModel}>{c.make} {c.model}</div></td>
                  <td style={styles.td}>{c.year}</td>
                  <td style={styles.td}><span style={styles.colorDot}>{c.color}</span></td>
                  <td style={styles.td}>{c.country}</td>
                  <td style={styles.td}><span style={styles.owner}>{c.customerUsername}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1e293b' },
  pageSub: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  search: { padding: '10px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '300px', background: '#fff', color: '#1e293b' },
  tableCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#1e293b' },
  idBadge: { background: '#eef2ff', color: '#4f46e5', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' },
  typeIcon: { fontSize: '20px' },
  plate: { fontWeight: '700', color: '#1e293b', letterSpacing: '0.5px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '13px' },
  makeModel: { fontWeight: '600', color: '#1e293b' },
  colorDot: { fontSize: '13px', color: '#475569' },
  owner: { background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '60px', color: '#64748b' },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
};
