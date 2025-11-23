
import React, { useState, useRef, useEffect } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createChatSession } from '../services/geminiService';
import { CarMetrics, DTC } from '../types';
import Spinner from './shared/Spinner';

interface ChatWidgetProps {
    metrics: CarMetrics;
    errorLogs: DTC[];
    vin: string | null;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'model';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ metrics, errorLogs, vin }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', text: "¡Hola! Soy tu mecánico de IA. ¿Cómo puedo ayudarte con tu auto hoy?", sender: 'model' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    // We use a ref to persist the chat session across renders without recreating it
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Initialize chat session when opened
    useEffect(() => {
        if (isOpen && !chatSessionRef.current) {
            const contextString = `
                VIN: ${vin || 'Desconocido'}
                Velocidad: ${metrics.speed} km/h
                RPM: ${metrics.rpm}
                Temp. Refrigerante: ${metrics.coolantTemp}°C
                Nivel Combustible: ${metrics.fuelLevel}%
                Voltaje: ${metrics.voltage}V
                Códigos de Error Activos: ${errorLogs.length > 0 ? errorLogs.map(e => `${e.code}: ${e.description} (${e.severity})`).join(', ') : 'Ninguno'}
            `;
            chatSessionRef.current = createChatSession(contextString);
        }
    }, [isOpen, metrics, errorLogs, vin]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        if (!inputValue.trim()) return;
        
        const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            if (!chatSessionRef.current) {
                chatSessionRef.current = createChatSession("Contexto no disponible");
            }

            if (chatSessionRef.current) {
                const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({
                    message: userMsg.text
                });
                
                const responseText = result.text || "Tengo problemas para conectarme a la ECU en este momento.";
                
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    text: responseText,
                    sender: 'model'
                }]);
            } else {
                 setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    text: "El servicio de IA no está configurado. Por favor verifica tu clave API.",
                    sender: 'model'
                }]);
            }

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "Lo siento, encontré un error. Por favor intenta de nuevo.",
                sender: 'model'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const parseText = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
            
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-theme-soft flex items-center justify-center text-theme">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-100">Mecánico IA</h3>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                    En Línea
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900/95">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-theme text-gray-900 font-medium rounded-br-none shadow-theme' 
                                            : 'bg-gray-700 text-gray-200 rounded-bl-none border border-gray-600'
                                    }`}
                                >
                                   <span dangerouslySetInnerHTML={{ __html: parseText(msg.text) }} />
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-600">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pregunta sobre tu auto..."
                            className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:border-theme transition-colors"
                        />
                        <button 
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="bg-theme hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-theme"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button (Toggle) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-theme hover:opacity-90 text-gray-900'} w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 shadow-theme`}
            >
                {isOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;
