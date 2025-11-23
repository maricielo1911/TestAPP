
import React, { useState, useCallback } from 'react';
import ConnectScreen from './components/ConnectScreen';
import Dashboard from './components/Dashboard';
import Diagnostics from './components/Diagnostics';
import BottomNav from './components/BottomNav';
import ChatWidget from './components/ChatWidget';
import SettingsModal from './components/SettingsModal';
import { Page, CarMetrics, DTC, AppTheme } from './types';
import { mockObd2Service } from './services/mockObd2Service';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [vin, setVin] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [metrics, setMetrics] = useState<CarMetrics>({
    speed: 0,
    rpm: 0,
    coolantTemp: 0,
    fuelLevel: 0,
    voltage: 0,
  });
  const [errorLogs, setErrorLogs] = useState<DTC[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Theme State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>({
      primaryColor: '#06b6d4', // Default Cyan
      backgroundImage: '',
  });

  // Memoized callback to handle data stream from mock service
  const onDataReceived = useCallback((data: CarMetrics) => {
    setMetrics(data);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const connectedVin = await mockObd2Service.connect();
      setVin(connectedVin);
      setIsConnected(true);
      
      mockObd2Service.startDataStream(onDataReceived);

    } catch (error) {
      console.error("Failed to connect:", error);
      alert("Error al conectar con el dispositivo OBD2. Por favor, intente nuevamente.");
    } finally {
        setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    mockObd2Service.stopDataStream();
    setIsConnected(false);
    setVin(null);
    setCurrentPage(Page.Dashboard);
    setMetrics({ speed: 0, rpm: 0, coolantTemp: 0, fuelLevel: 0, voltage: 0 });
    setErrorLogs([]);
  };

  // Function to convert hex to rgba for shadow utility
  const getRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r} ${g} ${b} / ${alpha}`;
  }

  // Inject Dynamic CSS for the Theme
  const themeStyles = `
    :root {
        --primary: ${theme.primaryColor};
    }
    .text-theme { color: var(--primary) !important; }
    .bg-theme { background-color: var(--primary) !important; }
    .bg-theme-soft { background-color: ${theme.primaryColor}20 !important; }
    .border-theme { border-color: var(--primary) !important; }
    .hover-text-theme:hover { color: var(--primary) !important; }
    .hover-bg-theme:hover { background-color: var(--primary) !important; }
    .shadow-theme { box-shadow: 0 10px 15px -3px rgb(${getRgba(theme.primaryColor, 0.3)}) !important; }
    
    /* Global scrollbar tint */
    ::-webkit-scrollbar-thumb {
        background: #4a5568; 
    }
    ::-webkit-scrollbar-thumb:hover {
        background: var(--primary);
    }
  `;

  if (!isConnected) {
    return (
        <>
            <style>{themeStyles}</style>
            <ConnectScreen onConnect={handleConnect} isConnecting={isConnecting} />
            <div className="fixed top-4 right-4 z-50">
               <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-500 hover:text-white transition-colors bg-gray-800 rounded-full border border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
               </button>
            </div>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} currentTheme={theme} onUpdateTheme={setTheme} />
        </>
    );
  }

  return (
    <>
    <style>{themeStyles}</style>
    <div 
        className="min-h-screen bg-gray-900 font-sans flex flex-col antialiased bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-500"
        style={{ backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none' }}
    >
      {/* Dark overlay if image is present to ensure readability */}
      {theme.backgroundImage && <div className="absolute inset-0 bg-gray-900/80 pointer-events-none z-0"></div>}

      <header className="bg-gray-800/80 backdrop-blur-md p-3 flex justify-between items-center border-b border-gray-700/50 sticky top-0 z-20 shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-theme drop-shadow-sm">Monitor ECU</h1>
          <p className="text-xs text-gray-400">VIN: {vin}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Configuración"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button
            onClick={handleDisconnect}
            className="bg-red-600/90 hover:bg-red-700 text-white font-bold p-2 rounded-full transition-colors flex items-center gap-2 backdrop-blur-sm"
            aria-label="Desconectar OBD2"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" x2="22" y1="2" y2="22"></line>
                <path d="M8.5 16.5a5 5 0 0 1 7 0"></path>
                <path d="M2 8.82a15 15 0 0 1 4.17-2.65"></path>
                <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"></path>
                <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"></path>
                <path d="M5 13.25a10 10 0 0 1 5.27-2.7"></path>
            </svg>
            </button>
        </div>
      </header>

      <main className="flex-grow p-4 pb-24 z-10 relative">
        {currentPage === Page.Dashboard && <Dashboard metrics={metrics} />}
        {currentPage === Page.Diagnostics && <Diagnostics errorLogs={errorLogs} setErrorLogs={setErrorLogs} />}
      </main>

      <ChatWidget metrics={metrics} errorLogs={errorLogs} vin={vin} />

      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} currentTheme={theme} onUpdateTheme={setTheme} />
    </div>
    </>
  );
};

export default App;
