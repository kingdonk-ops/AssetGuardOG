import { create } from 'zustand';
import axios from 'axios';
import type { Asset, Inspection, AssetStats, Alert } from '../types';

function api(token: string | null) {
  return axios.create({
    baseURL: '/api',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

interface AssetState {
  assets: Asset[];
  inspections: Inspection[];
  alerts: Alert[];
  stats: AssetStats | null;
  loading: boolean;
  fetchAssets: (token: string) => Promise<void>;
  fetchInspections: (token: string, assetId?: string) => Promise<void>;
  fetchStats: (token: string) => Promise<void>;
  fetchAlerts: (token: string) => Promise<void>;
  submitAsset: (token: string, data: any) => Promise<void>;
  submitInspection: (token: string, data: any) => Promise<void>;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  inspections: [],
  alerts: [],
  stats: null,
  loading: false,

  fetchAssets: async (token: string) => {
    set({ loading: true });
    const { data } = await api(token).get('/assets');
    set({ assets: data, loading: false });
  },

  fetchInspections: async (token: string, assetId?: string) => {
    const params = assetId ? { asset_id: assetId } : {};
    const { data } = await api(token).get('/inspections', { params });
    set({ inspections: data });
  },

  fetchStats: async (token: string) => {
    const { data } = await api(token).get('/assets/stats');
    set({ stats: data });
  },

  fetchAlerts: async (token: string) => {
    const { data } = await api(token).get('/alerts');
    set({ alerts: data });
  },

  submitAsset: async (token: string, assetData: any) => {
    await api(token).post('/assets', assetData);
    const { data } = await api(token).get('/assets');
    set({ assets: data });
  },

  submitInspection: async (token: string, inspectionData: any) => {
    await api(token).post('/inspections', inspectionData);
    const { data } = await api(token).get('/inspections');
    set({ inspections: data });
  },
}));
