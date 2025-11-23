
import React, { useState, useCallback } from 'react';
import { DTC } from '../types';
import { mockObd2Service } from '../services/mockObd2Service';
import ErrorItem from './ErrorItem';
import Spinner from './shared/Spinner';

interface DiagnosticsProps {
    errorLogs: DTC[];
    setErrorLogs: React.Dispatch<React.SetStateAction<DTC[]>>;
}

const Diagnostics: React.FC<DiagnosticsProps> = ({ errorLogs, setErrorLogs }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    setErrorLogs([]); // Clear previous results
    try {
      // In a real app, this would get errors from the OBD2 adapter
      const newErrors = await mockObd2Service.scanForErrors();
      setErrorLogs(newErrors);
    } catch (error) {
      console.error("Failed to scan for errors:", error);
    } finally {
      setIsScanning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearError = useCallback(async (errorId: string) => {
    const errorToClear = errorLogs.find(e => e.id === errorId);
    if (!errorToClear) return;
    
    await mockObd2Service.clearError(errorToClear.code);
    
    setErrorLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === errorId ? { ...log, clearedTimestamp: new Date() } : log
      )
    );
  }, [errorLogs, setErrorLogs]);

  const handleExportLogs = () => {
    if (errorLogs.length === 0) {
      alert("No hay registros de error para exportar.");
      return;
    }

    let logContent = "Registro de Diagnóstico del Auto\n";
    logContent += `Exportado el: ${new Date().toLocaleString('es-ES')}\n\n`;

    errorLogs.forEach(log => {
      logContent += `----------------------------------------\n`;
      logContent += `Código: ${log.code} [${log.severity.toUpperCase()}]\n`;
      logContent += `Descripción: ${log.description}\n`;
      logContent += `Detectado: ${log.timestamp.toLocaleString('es-ES')}\n`;
      if (log.clearedTimestamp) {
          logContent += `Borrado: ${log.clearedTimestamp.toLocaleString('es-ES')}\n`;
      }
      if (log.aiExplanation) {
          logContent += `Explicación IA:\n${log.aiExplanation.replace(/\*/g, '')}\n`;
      }
      logContent += `----------------------------------------\n\n`;
    });

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_error_auto_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-200 drop-shadow-md">Diagnóstico</h2>
        <div className="flex gap-2">
            <button
                onClick={handleExportLogs}
                disabled={isScanning || errorLogs.length === 0}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                <span>Exportar</span>
            </button>
            <button
                onClick={handleScan}
                disabled={isScanning}
                className="bg-theme hover:opacity-90 text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-theme"
            >
                {isScanning ? <Spinner size="sm" /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                  </svg>
                )}
                <span>{isScanning ? 'Escaneando...' : 'Escanear Errores'}</span>
            </button>
        </div>
      </div>
      
      {isScanning && (
          <div className="text-center py-10">
              <p className="text-theme animate-pulse font-medium">Comunicando con la ECU...</p>
          </div>
      )}

      {!isScanning && errorLogs.length === 0 && (
          <div className="text-center py-16 px-4 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700">
              <h3 className="text-xl font-medium text-gray-300">Sin Errores Detectados</h3>
              <p className="text-gray-500 mt-2">Haga clic en "Escanear Errores" para verificar códigos de falla en la ECU.</p>
          </div>
      )}
      
      <div className="space-y-4">
        {errorLogs.map(error => (
          <ErrorItem key={error.id} error={error} onClear={handleClearError} setErrorLogs={setErrorLogs} />
        ))}
      </div>
    </div>
  );
};

export default Diagnostics;
