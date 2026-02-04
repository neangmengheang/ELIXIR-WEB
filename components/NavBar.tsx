
import React from 'react';
import { AppView, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavBarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  lang: 'en' | 'km';
  setLang: (lang: 'en' | 'km') => void;
  role: UserRole;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, setView, lang, setLang, role }) => {
  
  // Base Nav Items
  const allNavItems = [
    { 
      id: AppView.DASHBOARD, 
      label: TRANSLATIONS.dashboard[lang], 
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      )
    },
    { 
      id: AppView.CONCERNS, 
      label: TRANSLATIONS.concerns[lang], 
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6" strokeWidth={active ? 0 : 2}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    },
    { 
      id: AppView.ADVISOR, 
      label: TRANSLATIONS.advisor[lang], 
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6" strokeWidth={active ? 0 : 2}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      )
    },
    { 
      id: AppView.COMMUNITY, 
      label: TRANSLATIONS.community[lang], 
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6" strokeWidth={active ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      )
    },
    { 
      id: AppView.SETTINGS, 
      label: TRANSLATIONS.settings[lang], 
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6" strokeWidth={active ? 0 : 2}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.43.816 1.035.795 1.735a17.962 17.962 0 01-1.809 5.732 17.962 17.962 0 01-1.809-5.732c-.021-.699.3-1.305.795-1.735m0 0a23.817 23.817 0 01-1.809-5.732 17.902 17.902 0 01-1.809 5.732" />
        </svg>
      )
    },
  ];

  // Filter Nav Items: Only General User sees "My Concerns" in the menu.
  // Other roles access it via their Dashboard widgets (Marketplace/Leads).
  const navItems = allNavItems.filter(item => {
    if (item.id === AppView.CONCERNS && role !== UserRole.GENERAL_USER) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-72 bg-white text-slate-800 h-screen sticky top-0 border-r border-slate-200 z-50 font-inter shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-inter">ELIXER</h1>
          </div>
          <div className="mt-8 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Menu</div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon(isActive)}
                </span>
                <span className={`font-semibold text-sm font-battambang pt-0.5`}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-6">
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center justify-between mb-3">
                 <span className="text-xs font-bold text-slate-400">LANGUAGE</span>
                 <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                    <button onClick={() => setLang('km')} className={`px-2 py-1 text-xs font-bold rounded ${lang === 'km' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>KH</button>
                    <button onClick={() => setLang('en')} className={`px-2 py-1 text-xs font-bold rounded ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>EN</button>
                 </div>
             </div>
             
             {/* Static profile view, actual switching is in Settings now */}
             <div className="flex items-center gap-3 pt-3 border-t border-slate-200 p-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 p-0.5">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophea" alt="User" className="w-full h-full rounded-full" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-700">Sophea Chan</p>
                    <p className="text-[10px] text-indigo-600 truncate font-semibold">{role}</p>
                  </div>
             </div>
           </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center justify-center min-w-[50px] py-2 space-y-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                <div className={`transition-all duration-300 ${isActive ? 'transform -translate-y-1' : ''}`}>
                    {item.icon(isActive)}
                </div>
                <span className={`text-[9px] font-battambang font-medium whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
                {isActive && <div className="w-1 h-1 bg-indigo-600 rounded-full absolute bottom-1"></div>}
              </button>
            )
          })}
        </div>
      </div>
    </>
  );
};
