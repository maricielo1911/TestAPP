
import React from 'react';
import { WidgetType, WidgetConfig } from '../types';

interface GaugeWidgetProps {
  value: number;
  type: WidgetType;
}

// Configuration for each type of widget
const WIDGET_CONFIGS: Record<WidgetType, WidgetConfig> = {
  speed: { id: 'speed', name: 'Velocidad', max: 240, unit: 'km/h' },
  rpm: { id: 'rpm', name: 'RPM', max: 8000, unit: 'RPM' },
  coolantTemp: { id: 'coolantTemp', name: 'Refrigerante', max: 120, unit: '°C' },
  fuelLevel: { id: 'fuelLevel', name: 'Combustible', max: 100, unit: '%' },
  voltage: { id: 'voltage', name: 'Voltaje', max: 16, unit: 'V' },
};

const GaugeWidget: React.FC<GaugeWidgetProps> = ({ value, type }) => {
  const config = WIDGET_CONFIGS[type];
  
  return (
    <div className="bg-gray-800/60 backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-700 hover:border-theme transition-colors flex flex-col items-center justify-center h-48 text-center group">
      <h3 className="text-base font-medium text-gray-300 mb-2 uppercase tracking-wider group-hover:text-theme transition-colors">{config.name}</h3>
      <p className="text-6xl font-mono text-white tracking-tight drop-shadow-md">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{config.unit}</p>
    </div>
  );
};

export default GaugeWidget;
