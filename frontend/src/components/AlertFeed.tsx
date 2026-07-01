import { useEffect } from 'react';
import { useAssetStore } from '../store/assetStore';

const severityColors: Record<string, string> = {
  critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#059669',
};

const s = {
  box: { background: '#1e293b', borderRadius: 10, padding: 24, border: '1px solid #334155', maxHeight: 500, overflowY: 'auto' as const },
  heading: { color: '#059669', fontSize: 16, fontWeight: 600, marginBottom: 16 },
  item: (sev: string) => ({
    background: '#0f172a',
    borderRadius: 6,
    padding: '10px 14px',
    marginBottom: 6,
    borderLeft: `3px solid ${severityColors[sev] || '#64748b'}`,
  }),
  title: { color: '#f1f5f9', fontSize: 13, fontWeight: 500 },
  meta: { color: '#64748b', fontSize: 11, marginTop: 2 },
};

export default function AlertFeed({ token }: { token: string }) {
  const { alerts, fetchAlerts, loading } = useAssetStore();

  useEffect(() => { fetchAlerts(token); }, [token]);

  return (
    <div style={s.box}>
      <div style={s.heading}>Alerts ({alerts.length})</div>
      {alerts.map(a => (
        <div key={a.id} style={s.item(a.severity)}>
          <div style={s.title}>{a.title}</div>
          <div style={s.meta}>{a.alert_type} · {a.severity} · {new Date(a.created_at).toLocaleDateString()}</div>
        </div>
      ))}
      {alerts.length === 0 && <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 20 }}>No alerts</div>}
    </div>
  );
}
