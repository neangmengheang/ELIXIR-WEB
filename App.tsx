
import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { AdvisorView } from './components/AdvisorView';
import { CommunityView } from './components/CommunityView';
import { ClaimsView } from './components/ClaimsView';
import { ConcernsView } from './components/ConcernsView';
import { SettingsView } from './components/SettingsView';
import { PoliciesView } from './components/PoliciesView';
import { AuthView } from './components/AuthView';
import { AppView, UserRole, SocialPost, Concern, Policy } from './types';
import { TRANSLATIONS, MOCK_POSTS, MOCK_CONCERNS, MOCK_POLICIES, MOCK_CLAIM_REQUESTS, MOCK_MARKET_PRODUCTS } from './constants';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
  const [lang, setLang] = useState<'en' | 'km'>('km'); 
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GENERAL_USER);
  const [initialQuestion, setInitialQuestion] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Lifted State for data persistence
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  const [concerns, setConcerns] = useState<Concern[]>(MOCK_CONCERNS);
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES); 
  const [companyPolicies, setCompanyPolicies] = useState<Policy[]>(MOCK_MARKET_PRODUCTS);

  useEffect(() => {
    // Check for existing session on load
    const checkAuth = async () => {
      const session = await authService.getSession();
      if (session) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
      }
    };
    checkAuth();
  }, []);

  const handleAuthenticated = (userData: any) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setView(AppView.DASHBOARD);
    } catch (e) {
      // Fallback for demo
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const handleQuickAsk = (question: string) => {
    setInitialQuestion(question);
    setView(AppView.ADVISOR);
  };

  const handleCreatePost = (newPost: SocialPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
    ));
  };

  const handleAddConcern = (newConcern: Concern) => {
    setConcerns([newConcern, ...concerns]);
  };

  const handleAddPolicy = (newPolicy: Policy) => {
    if (policies.length === 0) newPolicy.isDefault = true;
    setPolicies([newPolicy, ...policies]);
  };

  const handleUpdatePolicy = (updatedPolicy: Policy) => {
    setPolicies(prev => prev.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies(prev => {
        const remaining = prev.filter(p => p.id !== id);
        if (prev.find(p => p.id === id)?.isDefault && remaining.length > 0) {
            remaining[0].isDefault = true;
        }
        return remaining;
    });
  };

  // Missing handlers for company products
  const handleAddCompanyPolicy = (newPolicy: Policy) => {
    setCompanyPolicies([newPolicy, ...companyPolicies]);
  };

  const handleUpdateCompanyPolicy = (updatedPolicy: Policy) => {
    setCompanyPolicies(prev => prev.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
  };

  const handleDeleteCompanyPolicy = (id: string) => {
    setCompanyPolicies(prev => prev.filter(p => p.id !== id));
  };

  const handleSetDefaultPolicy = (id: string) => {
    setPolicies(prev => prev.map(p => ({
        ...p,
        isDefault: p.id === id
    })));
  };

  const isProfessionalRole = [
      UserRole.INSURANCE_COMPANY, 
      UserRole.BROKER, 
      UserRole.AGENT, 
      UserRole.ADMIN, 
      UserRole.REGULATOR
  ].includes(userRole);

  const getProfessionalTitle = () => {
      switch(userRole) {
          case UserRole.INSURANCE_COMPANY: return 'Forte Insurance';
          case UserRole.BROKER: return 'Premier Brokerage';
          case UserRole.AGENT: return 'Agent Portal';
          case UserRole.ADMIN: return 'Admin Console';
          case UserRole.REGULATOR: return 'Regulator Oversight';
          default: return 'Professional Dashboard';
      }
  };

  const activePolicy = policies.find(p => p.isDefault) || policies[0] || null;

  const AppHeader = () => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
           <span className="text-lg font-black tracking-tight text-slate-900 font-inter">ELIXER</span>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setView(AppView.POLICIES)} 
             className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-600 hover:bg-slate-50 transition"
           >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
           </button>
           
           <button 
             onClick={() => setView(AppView.SETTINGS)} 
             className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm relative text-slate-600 hover:bg-slate-50 transition"
           >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
           </button>
       </div>
    </div>
  );

  const renderDashboard = () => {
    if (isProfessionalRole) {
      return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-10">
            <div>
                <p className="text-sm text-slate-500 font-battambang">{TRANSLATIONS.hello[lang]},</p>
                <h2 className="text-xl font-bold text-indigo-900">{getProfessionalTitle()}</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Active Policies</p>
                     <p className="text-xl font-bold text-slate-900">1,245</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Pending Claims</p>
                     <p className="text-xl font-bold text-amber-600">3</p>
                 </div>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Revenue (M)</p>
                     <p className="text-xl font-bold text-green-600">$2.4M</p>
                 </div>
            </div>
            {userRole === UserRole.INSURANCE_COMPANY && (
                 <div onClick={() => setView(AppView.POLICIES)} className="bg-indigo-600 rounded-2xl p-6 shadow-lg shadow-indigo-200 text-white flex justify-between items-center cursor-pointer active:scale-[0.99] transition">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                             <h3 className="font-bold font-battambang">{TRANSLATIONS.manageProducts[lang]}</h3>
                         </div>
                         <p className="text-xs text-indigo-100 opacity-90">{companyPolicies.length} Active Products</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
                 </div>
            )}
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-lg font-battambang">{TRANSLATIONS.recentClaims[lang]}</h3>
                    <button className="text-indigo-600 text-sm font-bold font-battambang">{TRANSLATIONS.view[lang]}</button>
                </div>
                <div className="space-y-3">
                    {MOCK_CLAIM_REQUESTS.map(claim => (
                        <div key={claim.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${claim.riskScore === 'High' ? 'bg-red-100 text-red-600' : claim.riskScore === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}><span className="text-xs font-bold">{claim.riskScore[0]}</span></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-800">{claim.type}</h4>
                                <p className="text-xs text-slate-500">{claim.policyHolder} • {claim.amount}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${claim.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{claim.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
    }

    const quickActions = [
        { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: TRANSLATIONS.actionClaim[lang], color: 'bg-indigo-50 text-indigo-600', action: () => setView(AppView.CLAIMS) },
        { icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', label: TRANSLATIONS.actionChat[lang], color: 'bg-amber-50 text-amber-600', action: () => setView(AppView.ADVISOR) },
        ...(userRole === UserRole.GENERAL_USER ? [{ icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', label: TRANSLATIONS.concerns[lang], color: 'bg-red-50 text-red-600', action: () => setView(AppView.CONCERNS) }] : []),
        { icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', label: TRANSLATIONS.actionPolicies[lang], color: 'bg-emerald-50 text-emerald-600', action: () => setView(AppView.POLICIES) },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-10">
            <div onClick={() => setView(AppView.POLICIES)} className={`cursor-pointer relative w-full aspect-[1.6/1] rounded-3xl p-6 text-white shadow-xl shadow-slate-200 overflow-hidden group transform transition hover:scale-[1.02] bg-gradient-to-br ${activePolicy ? activePolicy.colorTheme : 'from-slate-700 to-slate-800'}`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl opacity-30 -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full mix-blend-overlay filter blur-3xl opacity-30 -ml-8 -mb-8"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                {activePolicy ? (
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center"><svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                                <span className="font-bold tracking-wider text-sm">{activePolicy.provider}</span>
                            </div>
                            <span className="bg-white/20 text-white/90 text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">{activePolicy.status}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white/70 text-xs font-medium uppercase tracking-wider font-battambang">{activePolicy.type}</p>
                            <h3 className="text-3xl font-bold tracking-tight text-white font-inter">{activePolicy.coverageAmount}</h3>
                        </div>
                        <div className="flex justify-between items-end">
                            <div><p className="text-white/60 text-[10px] font-battambang">{TRANSLATIONS.policyNumber[lang]}</p><p className="font-mono text-sm tracking-widest text-white/90">{activePolicy.policyNumber}</p></div>
                            <div className="text-right"><p className="text-white/60 text-[10px] font-battambang">{TRANSLATIONS.highSafety[lang]}</p></div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center"><p className="font-battambang mb-2 opacity-80">No Active Policy Selected</p><span className="text-xs bg-white/20 px-3 py-1 rounded-full">Tap to add</span></div>
                )}
            </div>
            <div className={`grid ${userRole === UserRole.GENERAL_USER ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
                {quickActions.map((item, idx) => (
                    <button key={idx} onClick={item.action} className="flex flex-col items-center gap-2 group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${item.color} group-active:scale-95 transition-transform`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg></div>
                        <span className="text-xs font-medium text-slate-600 font-battambang text-center leading-3 h-6 flex items-center justify-center">{item.label}</span>
                    </button>
                ))}
            </div>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-lg font-battambang">{TRANSLATIONS.featuredPolicies[lang]}</h3>
                    <button className="text-indigo-600 text-sm font-bold font-battambang">{TRANSLATIONS.view[lang]}</button>
                </div>
                <div className="space-y-3">
                     {MOCK_MARKET_PRODUCTS.map((policy) => (
                         <div key={policy.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${policy.colorTheme} text-white`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                            <div className="flex-1"><h4 className="text-sm font-bold text-slate-800 font-battambang">{policy.provider}</h4><p className="text-xs text-slate-500 font-battambang">{policy.type} • {policy.coverageAmount}</p></div>
                            <div className="text-right"><span className="text-xs font-bold text-slate-700 block">{policy.policyNumber}</span><button className="mt-1 text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase hover:bg-indigo-100">Apply</button></div>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.ADVISOR:
        return <AdvisorView lang={lang} initialQuestion={initialQuestion} />;
      case AppView.COMMUNITY:
        return <CommunityView lang={lang} currentUserRole={userRole} posts={posts} onPostCreate={handleCreatePost} onToggleBookmark={handleToggleBookmark} />;
      case AppView.CLAIMS:
        return <ClaimsView lang={lang} />;
      case AppView.CONCERNS:
        return <ConcernsView lang={lang} currentUserRole={userRole} concerns={concerns} onAddConcern={handleAddConcern} />;
      case AppView.POLICIES:
        const isCompany = userRole === UserRole.INSURANCE_COMPANY;
        return <PoliciesView lang={lang} role={userRole} policies={isCompany ? companyPolicies : policies} onAddPolicy={isCompany ? handleAddCompanyPolicy : handleAddPolicy} onUpdatePolicy={isCompany ? handleUpdateCompanyPolicy : handleUpdatePolicy} onDeletePolicy={isCompany ? handleDeleteCompanyPolicy : handleDeletePolicy} onSetDefaultPolicy={handleSetDefaultPolicy} />;
      case AppView.SETTINGS:
        return <SettingsView lang={lang} role={userRole} setRole={setUserRole} />;
      case AppView.DASHBOARD:
      default:
        return renderDashboard();
    }
  };

  if (!isAuthenticated) {
    return <AuthView lang={lang} onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="flex bg-[#f8fafc] h-full min-h-screen font-inter overflow-hidden">
      <NavBar 
        currentView={currentView} 
        setView={setView} 
        lang={lang} 
        setLang={setLang}
        role={userRole}
      />
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative w-full max-w-full">
        <div className="max-w-3xl mx-auto min-h-full p-4 md:p-8">
            <AppHeader />
            {renderContent()}
            <div className="mt-8 text-center pb-20">
              <button onClick={handleLogout} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest font-battambang">
                 {lang === 'km' ? 'ចាកចេញពីកម្មវិធី' : 'Logout System'}
              </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
