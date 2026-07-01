export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Asset {
  id: string;
  user_id: string;
  asset_name: string;
  asset_type: string;
  material: string;
  install_date: string;
  design_life_years: number;
  corrosion_allowance_mm: number;
  current_thickness_mm: number;
  min_required_thickness_mm: number;
  operating_pressure: number;
  operating_temperature: number;
  risk_level: string;
  status: string;
  created_at: string;
}

export interface Inspection {
  id: string;
  user_id: string;
  asset_id: string;
  inspection_date: string;
  inspection_type: string;
  inspector: string;
  findings: string | null;
  corrosion_rate_mm_yr: number | null;
  remaining_life_years: number | null;
  next_inspection_due: string | null;
  status: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  asset_id: string | null;
  title: string;
  alert_type: string;
  severity: string;
  status: string;
  description: string | null;
  created_at: string;
}

export interface AssetStats {
  total_assets: number;
  critical_risk: number;
  inspection_due: number;
  avg_remaining_life: number;
}

export interface AlertStats {
  total_active: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}
