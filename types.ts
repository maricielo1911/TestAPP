
export enum Page {
  Dashboard = 'dashboard',
  Diagnostics = 'diagnostics',
}

export interface CarMetrics {
  speed: number;
  rpm: number;
  coolantTemp: number;
  fuelLevel: number;
  voltage: number;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface DTC {
  id: string;
  code: string;
  description: string;
  timestamp: Date;
  clearedTimestamp?: Date;
  aiExplanation?: string;
  isAiLoading?: boolean;
  severity: Severity;
}

export type WidgetType = 'speed' | 'rpm' | 'coolantTemp' | 'fuelLevel' | 'voltage';

export interface WidgetConfig {
    id: WidgetType;
    name: string;
    max: number;
    unit: string;
}

export interface AppTheme {
  primaryColor: string; // Hex code
  backgroundImage: string; // URL
}
