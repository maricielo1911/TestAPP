
import React, { useState } from 'react';
import { CarMetrics, WidgetType } from '../types';
import GaugeWidget from './GaugeWidget';
import WidgetSelector from './WidgetSelector';

interface DashboardProps {
  metrics: CarMetrics;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics }) => {
  const [activeWidgets, setActiveWidgets] = useState<WidgetType[]>(['speed', 'rpm', 'coolantTemp']);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const toggleWidget = (widgetId: WidgetType) => {
    setActiveWidgets(prev =>
      prev.includes(widgetId)
        ? prev.filter(w => w !== widgetId)
        : [...prev, widgetId]
    );
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-200 drop-shadow-md">Métricas en Vivo</h2>
        <button onClick={() => setIsSelectorOpen(true)} className="p-2 rounded-md bg-gray-700/80 hover:bg-gray-600 text-theme transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="14" rx="1"></rect>
              <rect width="7" height="7" x="3" y="14" rx="1"></rect>
            </svg>
        </button>
      </div>

      {activeWidgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeWidgets.includes('speed') && <GaugeWidget value={metrics.speed} type="speed" />}
          {activeWidgets.includes('rpm') && <GaugeWidget value={metrics.rpm} type="rpm" />}
          {activeWidgets.includes('coolantTemp') && <GaugeWidget value={metrics.coolantTemp} type="coolantTemp" />}
          {activeWidgets.includes('fuelLevel') && <GaugeWidget value={metrics.fuelLevel} type="fuelLevel" />}
          {activeWidgets.includes('voltage') && <GaugeWidget value={metrics.voltage} type="voltage" />}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700">
            <h3 className="text-xl font-medium text-gray-300">Tablero Vacío</h3>
            <p className="text-gray-500 mt-2">Haz clic en el icono de cuadrícula para agregar widgets.</p>
        </div>
      )}
      
      <WidgetSelector 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        activeWidgets={activeWidgets}
        toggleWidget={toggleWidget}
      />
    </div>
  );
};

export default Dashboard;
