
import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

interface SecurityAssistantProps {
  passwordValue: string;
}

const SecurityAssistant: React.FC<SecurityAssistantProps> = ({ passwordValue }) => {
  const [tip, setTip] = useState<string>("Enter a password to get AI security tips.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (passwordValue.length > 2) {
        setLoading(true);
        const newTip = await GeminiService.getSecurityTip(passwordValue);
        setTip(newTip);
        setLoading(false);
      } else {
        setTip("Enter a password to get AI security tips.");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [passwordValue]);

  const getStrengthColor = () => {
    if (passwordValue.length === 0) return 'bg-slate-200';
    if (passwordValue.length < 6) return 'bg-rose-500';
    if (passwordValue.length < 10) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="mt-2 mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-start space-x-3">
      <div className="mt-1">
        <div className={`w-2 h-2 rounded-full ${getStrengthColor()} animate-pulse shadow-sm`}></div>
      </div>
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-400 mb-1">Security Assistant</p>
        <p className={`text-xs text-indigo-700 leading-relaxed ${loading ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
          {loading ? 'Analyzing security patterns...' : tip}
        </p>
      </div>
    </div>
  );
};

export default SecurityAssistant;
