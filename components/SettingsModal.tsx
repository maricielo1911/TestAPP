
import React, { useState, useRef } from 'react';
import Modal from './shared/Modal';
import { AppTheme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onUpdateTheme: (theme: AppTheme) => void;
}

const COLORS = [
  { name: 'Cian (Por Defecto)', value: '#06b6d4' },
  { name: 'Rojo Racing', value: '#ef4444' },
  { name: 'Verde Neón', value: '#22c55e' },
  { name: 'Púrpura Digital', value: '#a855f7' },
  { name: 'Naranja Sport', value: '#f97316' },
];

const BACKGROUNDS = [
  { name: 'Oscuro Simple', value: '' },
  { name: 'Garaje Cyberpunk', value: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Carretera Nocturna', value: 'https://images.unsplash.com/photo-1495539406979-bf617527023e?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Abstracto Tech', value: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onUpdateTheme }) => {
  const [localTheme, setLocalTheme] = useState<AppTheme>(currentTheme);
  const [customBg, setCustomBg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateTheme(localTheme);
    onClose();
  };

  const handleCustomBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomBg(e.target.value);
      setLocalTheme(prev => ({ ...prev, backgroundImage: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLocalTheme(prev => ({ ...prev, backgroundImage: result }));
        setCustomBg('Imagen cargada desde dispositivo');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Personalización Visual">
      <div className="p-4 space-y-6">
        
        {/* Color Picker */}
        <div>
          <h3 className="text-gray-300 font-medium mb-3">Color de Acento</h3>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setLocalTheme(prev => ({ ...prev, primaryColor: color.value }))}
                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                  localTheme.primaryColor === color.value ? 'border-white ring-2 ring-gray-400' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                 {localTheme.primaryColor === color.value && <span className="text-white font-bold drop-shadow-md">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Background Picker */}
        <div>
          <h3 className="text-gray-300 font-medium mb-3">Fondo de Aplicación</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
             {BACKGROUNDS.map((bg, idx) => (
               <button
                  key={idx}
                  onClick={() => {
                      setLocalTheme(prev => ({ ...prev, backgroundImage: bg.value }));
                      setCustomBg('');
                  }}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    localTheme.backgroundImage === bg.value ? 'border-theme' : 'border-gray-700'
                  }`}
               >
                 {bg.value ? (
                     <img src={bg.value} alt={bg.name} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                 ) : (
                     <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500 text-xs">Sin Fondo</div>
                 )}
                 <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] py-1 text-center truncate px-1">
                     {bg.name}
                 </div>
               </button>
             ))}
          </div>
          
          <div className="space-y-3 mt-4 border-t border-gray-700 pt-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Opción 1: Subir imagen de dispositivo</label>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                />
                <button 
                    onClick={triggerFileInput}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded border border-gray-600 flex items-center justify-center gap-2 text-sm transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    Subir Foto / Archivo
                </button>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Opción 2: URL de imagen</label>
                <input 
                    type="text" 
                    value={customBg}
                    placeholder="https://..."
                    onChange={handleCustomBgChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-theme"
                />
              </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
            <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancelar</button>
            <button 
                onClick={handleSave} 
                className="px-6 py-2 bg-theme text-gray-900 font-bold rounded shadow-lg shadow-theme/20 hover:opacity-90 transition-opacity text-sm"
            >
                Guardar Cambios
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
