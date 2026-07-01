import { useEffect, useState } from 'react';
import { useAssetStore } from '../store/assetStore';
import axios from 'axios';
import type { Asset } from '../types';

const riskColors: Record<string, string> = {
  critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#059669',
};

const s = {
  box: { background: '#1e293b', borderRadius: 10, padding: 24, border: '1px solid #334155' },
  heading: { color: '#059669', fontSize: 16, fontWeight: 600, marginBottom: 16 },
  card: (risk: string) => ({
    background: '#0f172a',
    borderRadius: 8,
    padding: '14px 16px',
    marginBottom: 8,
    borderLeft: `4px solid ${riskColors[risk] || '#64748b'}`,
    cursor: 'pointer',
  }),
  name: { color: '#f1f5f9', fontSize: 14, fontWeight: 600 },
  meta: { color: '#64748b', fontSize: 12, marginTop: 2 },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid #1e293b' },
  detailItem: { label: { color: '#64748b', fontSize: 11 }, value: { color: '#e2e8f0', fontSize: 13, fontWeight: 500 } },
};

async function getAssetDetails(token: string, assetId: string) {
  try {
    const { data } = await axios.get(`/api/assets/${assetId}`, { headers: { Authorization: `Bearer ${token}` } });
    return data;
  } catch { return null; }
}

export default function AssetList({ token }: { token: string }) {
  const { assets, fetchAssets } = useAssetStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, any>>({});

  useEffect(() => { fetchAssets(token); }, [token]);

  const toggleExpand = async (asset: Asset) => {
    if (expanded === asset.id) { setExpanded(null); return; }
    setExpanded(asset.id);
    if (!details[asset.id]) {
      const d = await getAssetDetails(token, asset.id);
      setDetails(prev => ({ ...prev, [asset.id]: d }));
    }
  };

  return (
    <div style={s.box}>
      <div style={s.heading}>Assets ({assets.length})</div>
      {assets.map(a => (
        <div key={a.id} style={s.card(a.risk_level)} onClick={() => toggleExpand(a)}>
          <div style={s.name}>{a.asset_name}</div>
          <div style={s.meta}>{a.asset_type} · {a.material} · {a.status}</div>
          {expanded === a.id && details[a.id] && (
            <div style={s.detailGrid}>
              <div><div style={s.detailItem.label}>Thickness</div><div style={s.detailItem.value}>{details[a.id].current_thickness_mm} mm</div></div>
              <div><div style={s.detailItem.label}>Corrosion Rate</div><div style={s.detailItem.value}>{'0.00'} mm/yr</div></div>
              <div><div style={s.detailItem.label}>Remaining Life</div><div style={s.detailItem.value}>{'99.9'} yrs</div></div>
              <div><div style={s.detailItem.label}>Risk Level</div><div style={s.detailItem.value}>{details[a.id].risk_level}</div></div>
              <div><div style={s.detailItem.label}>Pressure</div><div style={s.detailItem.value}>{details[a.id].operating_pressure} bar</div></div>
              <div><div style={s.detailItem.label}>Temp</div><div style={s.detailItem.value}>{details[a.id].operating_temperature} °C</div></div>
            </div>
          )}
        </div>
      ))}
      {assets.length === 0 && <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 20 }}>No assets registered</div>}
    </div>
  );
}
