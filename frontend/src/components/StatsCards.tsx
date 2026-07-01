import { useEffect } from 'react';
import { useAssetStore } from '../store/assetStore';

const cardStyle = (borderColor: string) => ({
  background: '#1e293b',
  borderRadius: 10,
  padding: '20px 24px',
  borderLeft: `4px solid ${borderColor}`,
});

const labelStyle = { color: '#94a3b8', fontSize: 13, marginBottom: 4 };
const valueStyle = { color: '#f1f5f9', fontSize: 28, fontWeight: 700 };

export default function StatsCards({ token }: { token: string }) {
  const { stats, fetchStats } = useAssetStore();

  useEffect(() => { fetchStats(token); }, [token]);

  if (!stats) return null;

  const cards = [
    { label: 'Total Assets', value: stats.total_assets, color: '#059669' },
    { label: 'Critical Risk', value: stats.critical_risk, color: '#ef4444' },
    { label: 'Inspection Due', value: stats.inspection_due, color: '#f59e0b' },
    { label: 'Avg Remaining Life', value: `${stats.avg_remaining_life}yrs`, color: '#3b82f6' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {cards.map(c => (
        <div key={c.label} style={cardStyle(c.color)}>
          <div style={labelStyle}>{c.label}</div>
          <div style={valueStyle}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
