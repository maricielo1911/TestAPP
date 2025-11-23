
import React from 'react';
import Spinner from './shared/Spinner';

interface ConnectScreenProps {
  onConnect: () => void;
  isConnecting: boolean;
}

const ConnectScreen: React.FC<ConnectScreenProps> = ({ onConnect, isConnecting }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-center">
      <div className="w-24 h-24 mb-6 text-theme drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"/>
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <path d="M12 12h4"/>
            <path d="M8 18v-4h4v4h4v-4h-2.5"/>
            <path d="M8 12v-4h4v4"/>
         </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Monitor ECU de Auto</h1>
      <p className="text-gray-400 max-w-sm mb-8">
        Conéctese a su adaptador OBD2 WiFi para comenzar a monitorear los datos en vivo y el diagnóstico de su vehículo.
      </p>

      {isConnecting ? (
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <p className="text-theme mt-4 animate-pulse font-medium">Conectando al Dispositivo OBD2...</p>
          <p className="text-gray-500 text-sm mt-1">Leyendo VIN y seleccionando protocolo...</p>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="bg-theme hover:opacity-90 text-gray-900 font-bold py-3 px-6 rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-theme"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" x2="12.01" y1="20" y2="20"></line>
          </svg>
          <span>Conectar al Vehículo</span>
        </button>
      )}
    </div>
  );
};

export default ConnectScreen;
