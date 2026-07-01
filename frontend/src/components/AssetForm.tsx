import { useState } from 'react';
import { useAssetStore } from '../store/assetStore';

const types = ['pipeline', 'vessel', 'tank', 'valve', 'pump', 'compressor', 'heat_exchanger', 'column'];

const s = {
  box: { background: '#1e293b', borderRadius: 10, padding: 24, border: '1px solid #334155' },
  heading: { color: '#059669', fontSize: 16, fontWeight: 600, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  label: { color: '#94a3b8', fontSize: 12, marginBottom: 4, display: 'block' },
  input: { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
  btn: { marginTop: 16, padding: '10px 20px', background: '#059669', border: 'none', borderRadius: 6, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' },
};

export default function AssetForm({ token }: { token: string }) {
  const submitAsset = useAssetStore(s => s.submitAsset);
  const [form, setForm] = useState({
    asset_name: '', asset_type: 'pipeline', material: '', design_life_years: 20,
    corrosion_allowance_mm: 3, current_thickness_mm: 10, min_required_thickness_mm: 5,
    operating_pressure: 10, operating_temperature: 100,
    install_date: new Date().toISOString().slice(0, 16),
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitAsset(token, { ...form, install_date: new Date(form.install_date).toISOString() });
  };

  return (
    <form style={s.box} onSubmit={handleSubmit}>
      <div style={s.heading}>Register Asset</div>
      <div style={s.grid}>
        <div><label style={s.label}>Asset Name</label><input style={s.input} name="asset_name" value={form.asset_name} onChange={handleChange} required /></div>
        <div><label style={s.label}>Type</label>
          <select style={s.select} name="asset_type" value={form.asset_type} onChange={handleChange}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div><label style={s.label}>Material</label><input style={s.input} name="material" value={form.material} onChange={handleChange} required /></div>
        <div><label style={s.label}>Design Life (yrs)</label><input style={s.input} name="design_life_years" type="number" value={form.design_life_years} onChange={handleChange} /></div>
        <div><label style={s.label}>Corrosion Allowance (mm)</label><input style={s.input} name="corrosion_allowance_mm" type="number" step="0.1" value={form.corrosion_allowance_mm} onChange={handleChange} /></div>
        <div><label style={s.label}>Current Thickness (mm)</label><input style={s.input} name="current_thickness_mm" type="number" step="0.1" value={form.current_thickness_mm} onChange={handleChange} /></div>
        <div><label style={s.label}>Min Required Thickness (mm)</label><input style={s.input} name="min_required_thickness_mm" type="number" step="0.1" value={form.min_required_thickness_mm} onChange={handleChange} /></div>
        <div><label style={s.label}>Operating Pressure (bar)</label><input style={s.input} name="operating_pressure" type="number" step="0.1" value={form.operating_pressure} onChange={handleChange} /></div>
        <div><label style={s.label}>Operating Temp (°C)</label><input style={s.input} name="operating_temperature" type="number" step="0.1" value={form.operating_temperature} onChange={handleChange} /></div>
        <div><label style={s.label}>Install Date</label><input style={s.input} name="install_date" type="datetime-local" value={form.install_date} onChange={handleChange} /></div>
      </div>
      <button style={s.btn} type="submit">Add Asset</button>
    </form>
  );
}
