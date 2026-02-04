

import React, { useState, useRef } from 'react';
import { Policy, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { extractPolicyFromImage } from '../services/geminiService';

interface PoliciesViewProps {
  lang: 'en' | 'km';
  role?: UserRole; // Added role prop
  policies: Policy[];
  onAddPolicy: (policy: Policy) => void;
  onUpdatePolicy: (policy: Policy) => void;
  onDeletePolicy: (id: string) => void;
  onSetDefaultPolicy: (id: string) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ 
  lang, 
  role,
  policies, 
  onAddPolicy, 
  onUpdatePolicy,
  onDeletePolicy,
  onSetDefaultPolicy 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Policy>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isCompany = role === UserRole.INSURANCE_COMPANY;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsScanning(true);
      setShowForm(true);
      setEditingId(null); // Creating new via scan
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          const result = await extractPolicyFromImage(base64);
          if (result) {
            setFormData(result);
          }
          setIsScanning(false);
        }
      };
    }
  };

  const startManualAdd = () => {
      setFormData({
        provider: isCompany ? 'Forte Insurance' : '', // Default to self if company
        policyNumber: '',
        type: '',
        coverageAmount: '',
        holderName: isCompany ? 'Market Product' : '',
        status: 'ACTIVE',
        expiryDate: new Date()
      });
      setEditingId(null);
      setShowForm(true);
  };

  const startEdit = (policy: Policy) => {
      setFormData({ ...policy });
      setEditingId(policy.id);
      setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
        // Updating existing
        const updated: Policy = {
            ...(formData as Policy),
            id: editingId,
            colorTheme: formData.colorTheme || 'from-blue-600 via-blue-700 to-indigo-800'
        };
        onUpdatePolicy(updated);
    } else {
        // Creating new
        const newPolicy: Policy = {
            id: Date.now().toString(),
            provider: formData.provider || 'Unknown',
            policyNumber: formData.policyNumber || 'N/A',
            type: formData.type || 'General',
            coverageAmount: formData.coverageAmount || 'N/A',
            expiryDate: formData.expiryDate || new Date(),
            holderName: formData.holderName || (isCompany ? 'Market Product' : 'User'),
            status: 'ACTIVE',
            colorTheme: 'from-blue-600 via-blue-700 to-indigo-800', // Default theme
            isDefault: false
        };
        onAddPolicy(newPolicy);
    }
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleDelete = () => {
      if (editingId && window.confirm(TRANSLATIONS.confirmDelete[lang])) {
          onDeletePolicy(editingId);
          setShowForm(false);
          setEditingId(null);
      }
  };

  const formatDateInput = (date: Date | undefined) => {
      if (!date) return '';
      // Format to YYYY-MM-DD for input type=date
      return date.toISOString().split('T')[0];
  };

  const handleDateChange = (dateString: string) => {
      setFormData({ ...formData, expiryDate: new Date(dateString) });
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Form / Scanner View
  if (showForm) {
    return (
      <div className="pb-20 animate-fade-in">
         <div className="flex items-center gap-2 mb-6">
            <button onClick={() => { setShowForm(false); setFormData({}); setEditingId(null); }} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-xl font-bold font-battambang">
                {editingId ? TRANSLATIONS.editPolicy[lang] : (isCompany ? TRANSLATIONS.createPolicy[lang] : TRANSLATIONS.verifyDetails[lang])}
            </h2>
         </div>

         {isScanning ? (
           <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative w-20 h-20 mb-4">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <svg className="absolute inset-0 m-auto w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-battambang mb-1">{TRANSLATIONS.analyzing[lang]}</h3>
              <p className="text-sm text-slate-500 font-battambang">{TRANSLATIONS.extractingData[lang]}</p>
           </div>
         ) : (
           <div className="animate-fade-in space-y-6">
              {!editingId && !isCompany && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-green-800 text-sm font-battambang">{TRANSLATIONS.verifyDetails[lang]}</h3>
                      </div>
                  </div>
              )}

              {/* Editable Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase font-battambang">{TRANSLATIONS.provider[lang]}</label>
                      <input 
                        type="text" 
                        value={formData.provider || ''} 
                        onChange={(e) => setFormData({...formData, provider: e.target.value})}
                        className="w-full mt-1 p-2 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 font-bold text-slate-800"
                        readOnly={isCompany} // Company provider is likely fixed or pre-filled
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase font-battambang">{isCompany ? 'Product Code' : TRANSLATIONS.policyNo[lang]}</label>
                      <input 
                        type="text" 
                        value={formData.policyNumber || ''} 
                        onChange={(e) => setFormData({...formData, policyNumber: e.target.value})}
                        className="w-full mt-1 p-2 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 font-bold text-slate-800"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase font-battambang">{isCompany ? 'Product Name' : TRANSLATIONS.holderName[lang]}</label>
                      <input 
                        type="text" 
                        value={formData.holderName || ''} 
                        onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                        className="w-full mt-1 p-2 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 font-bold text-slate-800"
                      />
                  </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase font-battambang">{TRANSLATIONS.coverage[lang]}</label>
                      <input 
                        type="text" 
                        value={formData.coverageAmount || ''} 
                        onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
                        className="w-full mt-1 p-2 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 font-bold text-slate-800"
                      />
                  </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase font-battambang">{TRANSLATIONS.expires[lang]}</label>
                      <input 
                        type="date" 
                        value={formatDateInput(formData.expiryDate)} 
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 font-bold text-slate-800"
                      />
                  </div>

                  {/* Actions for Edit Mode */}
                  {editingId && (
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                           {!isCompany && (
                               <div className="flex items-center gap-2">
                                   <label className="text-sm font-bold text-slate-700 font-battambang">{TRANSLATIONS.setAsDefault[lang]}</label>
                                   <button 
                                     onClick={() => {
                                         onSetDefaultPolicy(editingId);
                                         setFormData({ ...formData, isDefault: true }); // optimistic UI update
                                     }}
                                     className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                                         (formData as Policy).isDefault 
                                         ? 'bg-indigo-600 justify-end' 
                                         : 'bg-slate-300 justify-start'
                                     }`}
                                   >
                                       <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                                   </button>
                               </div>
                           )}
                           
                           <button 
                                onClick={handleDelete}
                                className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
                           >
                               {TRANSLATIONS.deletePolicy[lang]}
                           </button>
                      </div>
                  )}
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 font-battambang active:scale-95 transition"
              >
                 {TRANSLATIONS.savePolicy[lang]}
              </button>
           </div>
         )}
      </div>
    );
  }

  // Main List View
  return (
    <div className="pb-20 animate-fade-in">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 font-battambang">
                    {isCompany ? TRANSLATIONS.managedPolicies[lang] : TRANSLATIONS.myPolicies[lang]}
                </h2>
                <p className="text-xs text-slate-500 font-battambang mt-1">{policies.length} {TRANSLATIONS.active[lang]}</p>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={startManualAdd}
                    className={`${isCompany ? 'bg-indigo-600 text-white px-4 py-2 w-auto' : 'bg-white border border-slate-200 text-slate-600 w-10 h-10'} rounded-full shadow-sm active:scale-95 transition flex items-center justify-center`}
                >
                    {isCompany ? (
                        <div className="flex items-center gap-2">
                             <span className="text-lg font-bold leading-none">+</span>
                             <span className="text-xs font-bold font-battambang">{TRANSLATIONS.createPolicy[lang]}</span>
                        </div>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    )}
                </button>
                {!isCompany && (
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-900 text-white px-4 py-2 rounded-full font-bold shadow-md active:scale-95 transition flex items-center gap-2 font-battambang text-xs"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {TRANSLATIONS.scanPolicy[lang]}
                    </button>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                capture="environment"
                onChange={handleFileChange} 
            />
        </div>

        <div className="space-y-4">
            {policies.map(policy => (
                <div 
                    key={policy.id} 
                    onClick={() => startEdit(policy)}
                    className={`relative w-full aspect-[1.7/1] bg-gradient-to-br ${policy.colorTheme} rounded-3xl p-6 text-white shadow-xl shadow-slate-200 overflow-hidden group transform transition hover:scale-[1.02] cursor-pointer`}
                >
                     {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black rounded-full mix-blend-overlay filter blur-3xl opacity-20 -ml-8 -mb-8"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <span className="font-bold tracking-wider text-sm opacity-90">{policy.provider}</span>
                            <div className="flex gap-2">
                                {policy.isDefault && !isCompany && (
                                    <span className="bg-yellow-400/20 text-yellow-200 text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-400/30">
                                        ★ {TRANSLATIONS.defaultPolicy[lang]}
                                    </span>
                                )}
                                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                                    {policy.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-white/70 text-[10px] font-medium uppercase tracking-wider font-battambang">{policy.type}</p>
                            <h3 className="text-2xl font-bold tracking-tight text-white font-inter">{policy.coverageAmount}</h3>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-white/60 text-[10px] font-battambang">{isCompany ? 'Product Code' : TRANSLATIONS.policyNo[lang]}</p>
                                <p className="font-mono text-sm tracking-widest text-white/90">{policy.policyNumber}</p>
                            </div>
                            <div className="text-right">
                                {isCompany ? (
                                    <p className="text-white/80 text-xs font-bold">{policy.holderName}</p>
                                ) : (
                                    <>
                                        <p className="text-white/60 text-[10px] font-battambang">{TRANSLATIONS.expires[lang]}</p>
                                        <p className="text-xs font-bold">{formatDateDisplay(policy.expiryDate)}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};