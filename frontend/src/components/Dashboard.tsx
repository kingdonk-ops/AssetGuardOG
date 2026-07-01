import { useEffect } from 'react';
import { useAssetStore } from '../store/assetStore';
import StatsCards from './StatsCards';
import AssetForm from './AssetForm';
import AssetList from './AssetList';
import InspectionForm from './InspectionForm';
import AlertFeed from './AlertFeed';

export default function Dashboard({ token }: { token: string }) {
  const { fetchAssets, fetchStats, fetchAlerts, loading } = useAssetStore();

  useEffect(() => {
    fetchAssets(token);
    fetchStats(token);
    fetchAlerts(token);
  }, [token]);

  if (loading) return <div style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>Loading...</div>;

  return (
    <div>
      <StatsCards token={token} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <AssetForm token={token} />
        <InspectionForm token={token} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <AssetList token={token} />
        <AlertFeed token={token} />
      </div>
    </div>
  );
}
