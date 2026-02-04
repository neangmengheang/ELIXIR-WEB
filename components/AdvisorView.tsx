
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { getAdvisorResponse } from '../services/geminiService';

interface AdvisorViewProps {
  lang: 'en' | 'km';
  initialQuestion?: string;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({ lang, initialQuestion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: TRANSLATIONS.introMessage[lang],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getAdvisorResponse(history, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || "I apologize, but I couldn't process that request.",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  useEffect(() => {
      if (initialQuestion && !hasInitialized.current) {
          hasInitialized.current = true;
          handleSend(initialQuestion);
      }
  }, [initialQuestion]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`flex max-w-[85%] items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {!isUser && (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-indigo-700 mb-1">
                                    AI
                                </div>
                            )}

                            <div className={`px-4 py-3 shadow-sm text-[15px] leading-relaxed relative ${
                                isUser 
                                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                                : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm'
                            }`}>
                                <p className="whitespace-pre-wrap font-battambang">{msg.text}</p>
                                <span className={`text-[9px] block mt-1 opacity-60 text-right ${isUser ? 'text-indigo-100' : 'text-slate-400'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {loading && (
                 <div className="flex justify-start pl-8">
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex space-x-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed relative to container but looks fixed on mobile */}
        <div className="mt-2 bg-slate-50 pt-2">
            <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
                <div className="flex-1 bg-white rounded-full border border-slate-200 flex items-center px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSend(input);
                        }}
                        placeholder={TRANSLATIONS.askAnything[lang]}
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 text-sm font-battambang py-1"
                    />
                </div>
                <button 
                    onClick={() => handleSend(input)}
                    disabled={loading || !input.trim()}
                    className="bg-indigo-600 disabled:bg-slate-300 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                        <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  );
};
