
import React from 'react';
import { UserRole } from '../types';
import { TRANSLATIONS, ROLES_LIST } from '../constants';

interface SettingsViewProps {
  lang: 'en' | 'km';
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ lang, role, setRole }) => {
  return (
    <div className="pb-20 animate-fade-in space-y-8">
      <div>
         <h2 className="text-xl font-bold text-slate-900 font-battambang">{TRANSLATIONS.settings[lang]}</h2>
         <p className="text-xs text-slate-500 font-battambang mt-1">{TRANSLATIONS.appSettings[lang]}</p>
      </div>

      {/* User Role Switcher Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div>
                  <h3 className="text-sm font-bold text-slate-900 font-battambang">{TRANSLATIONS.switchRole[lang]}</h3>
                  <p className="text-xs text-slate-500 font-battambang">{TRANSLATIONS.selectRole[lang]}</p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ROLES_LIST.map((item) => (
                  <button
                      key={item}
                      onClick={() => setRole(item)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          role === item 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                  >
                      <span className="font-bold text-sm">{item}</span>
                      {role === item && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      )}
                  </button>
              ))}
          </div>
      </div>
      
      {/* Additional Settings Placeholder */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 opacity-50 pointer-events-none">
          <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               </div>
               <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          </div>
          <p className="text-xs text-slate-400 pl-14">Coming Soon</p>
      </div>
    </div>
  );
};
