
import React from 'react';
import Modal from './shared/Modal';
import { WidgetType } from '../types';

interface WidgetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidgets: WidgetType[];
  toggleWidget: (widget: WidgetType) => void;
}

const WIDGETS_AVAILABLE: { id: WidgetType; name: string; icon: React.ReactNode }[] = [
  { id: 'speed', name: 'Velocidad', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg> },
  { id: 'rpm', name: 'RPM', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg> },
  { id: 'coolantTemp', name: 'Temp. Refrigerante', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg> },
  { id: 'fuelLevel', name: 'Nivel Combustible', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3h7l-3 7h3l-7 11v-9h-4zM4.78 2.82a.5.5 0 0 0-.7.64L6.4 8l-2.6 4.36a.5.5 0 0 0 .63.71l2.76-1.55.02.01L9.6 13l-2.7 4.5a.5.5 0 0 0 .65.7l2.85-1.6.02.01L12.8 18l-2.7 4.5a.5.5 0 0 0 .65.7l2.85-1.6.02.01L16 23l2.82-4.7a.5.5 0 0 0-.64-.71L15.4 19l2.6-4.36a.5.5 0 0 0-.63-.71l-2.76 1.55-.02-.01L12.2 14l2.7-4.5a.5.5 0 0 0-.65-.7l-2.85 1.6-.02-.01L9 9l2.7-4.5a.5.5 0 0 0-.65-.7L8.2 5.4l-.02-.01L5.4 3.8a.5.5 0 0 0-.62-.98Z"/></svg> },
  { id: 'voltage', name: 'Voltaje Batería', icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-theme" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
];

const WidgetSelector: React.FC<WidgetSelectorProps> = ({ isOpen, onClose, activeWidgets, toggleWidget }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Personalizar Tablero">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
          {WIDGETS_AVAILABLE.map((widget) => (
            <button
              key={widget.id}
              onClick={() => toggleWidget(widget.id)}
              className={`p-4 rounded-lg text-center transition-all duration-200 border-2 ${
                activeWidgets.includes(widget.id)
                  ? 'bg-theme-soft border-theme shadow-theme'
                  : 'bg-gray-700 border-gray-600 hover:border-theme'
              }`}
            >
              <div className="mx-auto mb-2 flex items-center justify-center h-8">{widget.icon}</div>
              <p className="font-medium text-gray-200">{widget.name}</p>
            </button>
          ))}
        </div>
    </Modal>
  );
};

export default WidgetSelector;
