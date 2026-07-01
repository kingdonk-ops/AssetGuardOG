import { useState } from 'react';
import { useAssetStore } from '../store/assetStore';

const types = ['visual', 'ultrasonic', 'radiographic', 'magnetic', 'eddy_current'];

const s = {
  box: { background: '#1e293b', borderRadius: 10, padding: 24, border: '1px solid #334155' },
  heading: { color: '#059669', fontSize: 16, fontWeight: 600, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 4, display: 'block' },
  input: { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
  btn: { padding: '10px 20px', background: '#059669', border: 'none', borderRadius: 6, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' },
};

export default function InspectionForm({ token }: { token: string }) {
  const { assets, submitInspection } = useAssetStore();
  const [form, setForm] = useState({
    asset_id: '', inspection_date: new Date().toISOString().slice(0, 16),
    inspection_type: 'visual', inspector: '', findings: '',
    corrosion_rate_mm_yr: 0, remaining_life_years: 0,
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitInspection(token, {
      ...form,
      corrosion_rate_mm_yr: parseFloat(form.corrosion_rate_mm_yr as any) || 0,
      remaining_life_years: parseFloat(form.remaining_life_years as any) || 0,
      inspection_date: new Date(form.inspection_date).toISOString(),
    });
  };

  return (
    <form style={s.box} onSubmit={handleSubmit}>
      <div style={s.heading}>Record Inspection</div>
      <div style={s.field}>
        <label style={s.label}>Asset</label>
        <select style={s.select} name="asset_id" value={form.asset_id} onChange={handleChange} required>
          <option value="">Select asset...</option>
          {assets.map(a => <option key={a.id} value={a.id}>{a.asset_name}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={s.label}>Inspection Type</label>
          <select style={s.select} name="inspection_type" value={form.inspection_type} onChange={handleChange}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div><label style={s.label}>Inspector</label><input style={s.input} name="inspector" value={form.inspector} onChange={handleChange} required /></div>
        <div><label style={s.label}>Corrosion Rate (mm/yr)</label><input style={s.input} name="corrosion_rate_mm_yr" type="number" step="0.001" value={form.corrosion_rate_mm_yr} onChange={handleChange} /></div>
        <div><label style={s.label}>Remaining Life (yrs)</label><input style={s.input} name="remaining_life_years" type="number" step="0.1" value={form.remaining_life_years} onChange={handleChange} /></div>
      </div>
      <div style={s.field}>
        <label style={s.label}>Findings</label>
        <textarea style={{ ...s.input, minHeight: 60, resize: 'vertical' }} name="findings" value={form.findings} onChange={handleChange} />
      </div>
      <div style={s.field}><label style={s.label}>Date</label><input style={s.input} name="inspection_date" type="datetime-local" value={form.inspection_date} onChange={handleChange} /></div>
      <button style={s.btn} type="submit">Record Inspection</button>
    </form>
  );
}
