import React, { useState, useRef } from 'react';
import { TRANSLATIONS } from '../constants';
import { analyzeClaimImage } from '../services/geminiService';
import { ClaimResult } from '../types';

interface ClaimsViewProps {
  lang: 'en' | 'km';
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({ lang }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);

    try {
      const base64 = await convertToBase64(selectedFile);
      const claimResult = await analyzeClaimImage(base64, "Vehicle Damage");
      setResult(claimResult);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setResult(null);
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
            <h2 className="text-xl font-bold text-slate-900 font-battambang">{TRANSLATIONS.claims[lang]}</h2>
            <p className="text-xs text-slate-500 font-battambang mt-1">Smart Auto-Claims</p>
        </div>
        {result && (
            <button onClick={reset} className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-full font-battambang">
                {TRANSLATIONS.newClaim[lang]}
            </button>
        )}
      </div>

      {!result ? (
          <div className="space-y-6 animate-fade-in">
             {/* Step 1: Upload */}
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 
                 <h3 className="text-lg font-bold text-slate-900 mb-2 font-battambang">{TRANSLATIONS.uploadImage[lang]}</h3>
                 <p className="text-sm text-slate-500 mb-6 font-battambang">{TRANSLATIONS.takePhotoText[lang]}</p>
                 
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full aspect-square md:aspect-[2/1] bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition overflow-hidden"
                 >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            <span className="text-xs text-slate-400 font-bold font-battambang">{TRANSLATIONS.tapToUpload[lang]}</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange} 
                    />
                 </div>
             </div>

             <button
                onClick={handleAnalysis}
                disabled={!selectedFile || isAnalyzing}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] font-battambang"
             >
                {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {TRANSLATIONS.analyzing[lang]}
                    </span>
                ) : TRANSLATIONS.submitClaim[lang]}
             </button>
          </div>
      ) : (
          <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className={`absolute top-0 left-0 w-full h-2 ${result.approved ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                   
                   <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${result.approved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                             {result.approved ? '✓' : '!'}
                        </div>
                        <div>
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-wide font-battambang">{TRANSLATIONS.status[lang]}</p>
                             <h3 className={`text-lg font-bold ${result.approved ? 'text-green-600' : 'text-amber-600'} font-battambang`}>
                                 {result.approved ? TRANSLATIONS.approved[lang] : TRANSLATIONS.rejected[lang]}
                             </h3>
                        </div>
                   </div>

                   <div className="flex gap-3 mb-6">
                        <div className="flex-1 bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-400 font-bold uppercase font-battambang">{TRANSLATIONS.confidence[lang]}</p>
                            <p className="text-lg font-bold text-slate-800">{result.confidence}%</p>
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] text-slate-400 font-bold uppercase font-battambang">{TRANSLATIONS.payout[lang]}</p>
                            <p className="text-lg font-bold text-slate-800">{result.estimatedPayout}</p>
                        </div>
                   </div>

                   <div>
                       <p className="text-xs text-slate-400 font-bold uppercase mb-2 font-battambang">{TRANSLATIONS.aiReasoning[lang]}</p>
                       <p className="text-sm text-slate-600 leading-relaxed font-battambang">
                           {result.reasoning}
                       </p>
                   </div>
              </div>

              {result.approved && (
                  <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-transform font-battambang">
                      {TRANSLATIONS.acceptPayout[lang]}
                  </button>
              )}
          </div>
      )}
    </div>
  );
};