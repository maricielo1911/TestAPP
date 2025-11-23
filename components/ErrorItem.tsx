
import React, { useState, useCallback } from 'react';
import { DTC, Severity } from '../types';
import { getErrorCodeExplanation } from '../services/geminiService';
import Spinner from './shared/Spinner';

interface ErrorItemProps {
  error: DTC;
  onClear: (errorId: string) => void;
  setErrorLogs: React.Dispatch<React.SetStateAction<DTC[]>>;
}

const getSeverityStyles = (severity: Severity, isCleared: boolean) => {
    if (isCleared) return 'border-gray-700 opacity-60 bg-gray-700/50';
    
    switch (severity) {
        case 'critical':
            return 'border-red-500 bg-red-900/10 animate-pulse-slow shadow-[0_0_15px_rgba(239,68,68,0.2)]';
        case 'high':
            return 'border-orange-500 bg-orange-900/10';
        case 'medium':
            return 'border-yellow-600 bg-yellow-900/5';
        default:
            return 'border-gray-700 bg-gray-800';
    }
};

const getSeverityLabel = (severity: Severity) => {
    switch (severity) {
        case 'critical': return { text: 'CRÍTICO', color: 'text-red-500 bg-red-900/30 border-red-500' };
        case 'high': return { text: 'ALTO', color: 'text-orange-400 bg-orange-900/30 border-orange-500' };
        case 'medium': return { text: 'MEDIO', color: 'text-yellow-400 bg-yellow-900/30 border-yellow-600' };
        default: return { text: 'BAJO', color: 'text-gray-400 bg-gray-800 border-gray-600' };
    }
};

const ErrorItem: React.FC<ErrorItemProps> = ({ error, onClear, setErrorLogs }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGetExplanation = useCallback(async () => {
    setErrorLogs(prev => prev.map(e => e.id === error.id ? { ...e, isAiLoading: true } : e));
    const explanation = await getErrorCodeExplanation(error.code, error.description);
    setErrorLogs(prev => prev.map(e => e.id === error.id ? { ...e, aiExplanation: explanation, isAiLoading: false } : e));
    setIsExpanded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error.id, error.code, error.description, setErrorLogs]);
  
  const isCleared = !!error.clearedTimestamp;
  const severityStyle = getSeverityStyles(error.severity, isCleared);
  const severityLabel = getSeverityLabel(error.severity);

  return (
    <div className={`rounded-lg border transition-all duration-300 ${severityStyle}`}>
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                    <p className={`font-mono text-lg font-bold ${isCleared ? 'text-gray-400 line-through' : 'text-gray-100'}`}>{error.code}</p>
                    {!isCleared && (
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${severityLabel.color} font-bold tracking-wider`}>
                            {severityLabel.text}
                        </span>
                    )}
                </div>
                <p className="text-gray-300">{error.description}</p>
                <div className="flex gap-4 mt-2">
                    <p className="text-xs text-gray-500">Detectado: {error.timestamp.toLocaleTimeString('es-ES')}</p>
                    {isCleared && <p className="text-xs text-green-500">Borrado: {error.clearedTimestamp?.toLocaleTimeString('es-ES')}</p>}
                </div>
            </div>
            
            <div className="flex items-center gap-2 self-stretch sm:self-center">
                <button
                    onClick={handleGetExplanation}
                    disabled={error.isAiLoading || isCleared}
                    className="p-2 bg-indigo-600/60 hover:bg-indigo-600 text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed h-full flex items-center shadow-md border border-indigo-500/30 group relative overflow-hidden"
                    title="Analizar con Robot IA"
                >
                    {/* Robot Icon */}
                    {error.isAiLoading ? <Spinner size="sm"/> : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                            <rect width="18" height="10" x="3" y="11" rx="2" />
                            <circle cx="12" cy="5" r="2" />
                            <path d="M12 7v4" />
                            <line x1="8" x2="8" y1="16" y2="16" />
                            <line x1="16" x2="16" y1="16" y2="16" />
                        </svg>
                        <span className="ml-2 hidden lg:inline text-sm font-medium">Analizar IA</span>
                      </>
                    )}
                </button>
                 <button
                    onClick={() => onClear(error.id)}
                    disabled={isCleared}
                    className="p-2 bg-red-600/50 hover:bg-red-600/80 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-full flex items-center shadow-md"
                    title="Borrar Código"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
                 {error.aiExplanation && (
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors h-full flex items-center shadow-md">
                        {isExpanded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
        
        {/* Progress bar or additional visual cue for high severity */}
        {!isCleared && error.severity === 'critical' && (
             <div className="h-1 w-full bg-red-900/50 rounded-b-lg overflow-hidden">
                 <div className="h-full bg-red-500 animate-pulse w-full origin-left"></div>
             </div>
        )}

      {isExpanded && error.aiExplanation && (
        <div className="px-4 pb-4 border-t border-gray-700/50 bg-black/20">
           <div className="prose prose-invert prose-sm max-w-none mt-4 text-gray-300" dangerouslySetInnerHTML={{ __html: error.aiExplanation.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
      )}
      <style>{`
        @keyframes pulse-slow {
            0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.1); }
            50% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default ErrorItem;
