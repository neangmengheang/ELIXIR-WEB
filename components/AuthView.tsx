
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import Input from './Input';
import SecurityAssistant from './SecurityAssistant';
import { authService } from '../services/authService';

interface AuthViewProps {
  lang: 'en' | 'km';
  onAuthenticated: (userData: any) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ lang, onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        // For actual Supabase, this would trigger email verification or auto-login
        // For this demo/setup, we'll simulate a successful connection
        // const data = await authService.signUp(email, password, fullName);
        setTimeout(() => {
          onAuthenticated({ email, fullName: fullName || 'New User' });
        }, 1000);
      } else {
        // const data = await authService.signIn(email, password);
        setTimeout(() => {
          onAuthenticated({ email, fullName: 'Welcome Back' });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 mb-4 transform hover:rotate-6 transition-transform">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 font-inter">ELIXER</h1>
          <p className="text-slate-500 text-sm font-battambang mt-1">{TRANSLATIONS.subtitle[lang]}</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl border border-white/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 font-battambang">
              {mode === 'login' ? (lang === 'km' ? 'ចូលគណនី' : 'Welcome back') : (lang === 'km' ? 'បង្កើតគណនី' : 'Create account')}
            </h2>
            <p className="text-slate-500 text-sm font-battambang mt-1">
              {mode === 'login' ? (lang === 'km' ? 'សូមបញ្ចូលព័ត៌មានដើម្បីបន្ត' : 'Securely access your insurance hub') : (lang === 'km' ? 'ចុះឈ្មោះដើម្បីទទួលបានសេវាកម្មដ៏ល្អបំផុត' : 'Start your InsurTech journey with us')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label={lang === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'}
                placeholder="John Doe"
                icon="fa-regular fa-user"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}

            <Input
              label={lang === 'km' ? 'អ៊ីមែល' : 'Email Address'}
              type="email"
              placeholder="name@example.com"
              icon="fa-regular fa-envelope"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <Input
                label={lang === 'km' ? 'លេខសម្ងាត់' : 'Password'}
                type="password"
                placeholder="••••••••"
                icon="fa-solid fa-lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <SecurityAssistant passwordValue={password} />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-battambang flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 font-battambang"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>{lang === 'km' ? 'កំពុងដំណើរការ...' : 'Processing...'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? (lang === 'km' ? 'ចូលកម្មវិធី' : 'Sign In') : (lang === 'km' ? 'ចុះឈ្មោះ' : 'Sign Up')}</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-battambang">
              {mode === 'login' ? (lang === 'km' ? 'មិនទាន់មានគណនី?' : 'New to ELIXER?') : (lang === 'km' ? 'មានគណនីរួចហើយ?' : 'Already have an account?')}
              {' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                {mode === 'login' ? (lang === 'km' ? 'ចុះឈ្មោះឥឡូវនេះ' : 'Create an account') : (lang === 'km' ? 'ចូលគណនី' : 'Sign in')}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Trust badge */}
        <div className="mt-8 flex justify-center items-center gap-4 grayscale opacity-40">
           <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_the_Ministry_of_Economy_and_Finance_%28Cambodia%29.svg" className="h-8" alt="MEF" />
           <div className="w-px h-6 bg-slate-300"></div>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secured by AI</span>
        </div>
      </div>
    </div>
  );
};
