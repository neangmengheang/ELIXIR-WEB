
import React, { useState } from 'react';
import { UserRole, Concern, ConcernComment } from '../types';
import { TRANSLATIONS, AI_CONCERN_TOPICS } from '../constants';
import { summarizeConcern, generateConcernTopics, constructSentenceFromTopics } from '../services/geminiService';

interface ConcernsViewProps {
  lang: 'en' | 'km';
  currentUserRole: UserRole;
  concerns: Concern[];
  onAddConcern: (concern: Concern) => void;
}

interface TopicOption {
  id: string;
  text: { en: string; km: string };
  icon: string;
}

export const ConcernsView: React.FC<ConcernsViewProps> = ({
  lang,
  currentUserRole,
  concerns,
  onAddConcern
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [creationStep, setCreationStep] = useState<number>(0); // 0: Drill Down, 1: Final Details
  const [detailText, setDetailText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [replyInputs, setReplyInputs] = useState<{[key: string]: string}>({});
  
  // Drill Down State
  const [topicPath, setTopicPath] = useState<TopicOption[]>([]);
  const [currentOptions, setCurrentOptions] = useState<TopicOption[]>(AI_CONCERN_TOPICS);
  
  // Role Logic
  const isProvider = [UserRole.AGENT, UserRole.BROKER, UserRole.INSURANCE_COMPANY].includes(currentUserRole);
  const isAdmin = currentUserRole === UserRole.ADMIN;
  // A "current-user" ID simulation. In a real app, this comes from Auth context.
  const currentUserId = 'current-user'; 

  // Handlers for Discussion
  const handleReplyChange = (concernId: string, text: string) => {
      setReplyInputs(prev => ({...prev, [concernId]: text}));
  };

  const handlePostComment = (concern: Concern) => {
      const text = replyInputs[concern.id];
      if (!text || !text.trim()) return;

      const newComment: ConcernComment = {
          id: Date.now().toString(),
          authorName: isProvider ? 'Professional Agent' : 'User', // Mask generic users, show agent title
          authorRole: currentUserRole,
          authorId: isProvider ? 'agent-me' : currentUserId,
          content: text,
          timestamp: new Date(),
          isProposal: isProvider // Only providers make "Proposals"
      };

      // Mutate concern directly for mock demo (In real app, call API)
      concern.comments.push(newComment);
      
      setReplyInputs(prev => ({...prev, [concern.id]: ''}));
  };

  const handleAcceptDeal = (concern: Concern, comment: ConcernComment) => {
      if (confirm(TRANSLATIONS.acceptDeal[lang] + "?")) {
          concern.status = 'PENDING_VERIFICATION';
          concern.acceptedCommentId = comment.id;
          // Force update (Mock)
          setReplyInputs(prev => ({...prev})); 
      }
  };

  const handleVerifyDeal = (concern: Concern) => {
      if (confirm("Verify this deal and reveal contact info?")) {
          concern.status = 'VERIFIED';
          // Force update (Mock)
          setReplyInputs(prev => ({...prev}));
      }
  };

  // Visibility Logic
  const canViewComments = (concern: Concern) => {
      // Owner, Providers, and Admins can see discussion
      if (currentUserRole === UserRole.ADMIN) return true;
      if (isProvider) return true;
      if (concern.userId === currentUserId) return true;
      return false;
  };

  const canComment = (concern: Concern) => {
      // Only Owner and Providers can discuss (and Admin)
      if (currentUserRole === UserRole.ADMIN) return true;
      if (isProvider) return true;
      if (concern.userId === currentUserId) return true;
      return false;
  };

  const handleStartCreate = () => {
    setViewMode('create');
    setCreationStep(0);
    setDetailText('');
    setTopicPath([]);
    setCurrentOptions(AI_CONCERN_TOPICS); 
  };

  const fetchTopics = async (history: TopicOption[], excludedText: string[] = []) => {
      setIsGeneratingTopics(true);
      const historyStrings = history.map(h => h.text[lang]);
      const newTopics = await generateConcernTopics(historyStrings, excludedText);
      if (newTopics && newTopics.length > 0) {
          setCurrentOptions(newTopics);
      }
      setIsGeneratingTopics(false);
  };

  const handleTopicClick = async (topic: TopicOption) => {
    const newPath = [...topicPath, topic];
    setTopicPath(newPath);
    await fetchTopics(newPath);
  };

  const handleRegenerate = async () => {
    const currentTexts = currentOptions.map(opt => opt.text.en);
    await fetchTopics(topicPath, currentTexts);
  };

  const handleRestart = () => {
      setTopicPath([]);
      setCurrentOptions(AI_CONCERN_TOPICS);
  };

  const handleGoToSummary = async () => {
      setIsDrafting(true);
      const topicStrings = topicPath.map(t => t.text[lang]);
      const draft = await constructSentenceFromTopics(topicStrings, lang);
      setDetailText(draft);
      setIsDrafting(false);
      setCreationStep(1);
  };

  const handleAnalyzeAndSave = async () => {
    setIsAnalyzing(true);
    const pathString = topicPath.map(t => t.text[lang]).join(' > ');
    const context = `${pathString}. User notes: ${detailText}`;
    
    const summary = await summarizeConcern(
        pathString, 
        detailText || "No additional details provided.", 
        lang
    );

    const newConcern: Concern = {
        id: Date.now().toString(),
        userId: currentUserId,
        userContact: { phone: "012 999 888", email: "myemail@elixer.kh" },
        category: topicPath.length > 0 ? topicPath[0].text[lang] : 'General',
        originalText: context,
        aiSummary: summary,
        timestamp: new Date(),
        status: 'OPEN',
        comments: []
    };

    onAddConcern(newConcern);
    setIsAnalyzing(false);
    setViewMode('list');
  };

  // Render for General User: Create Flow
  if (viewMode === 'create') {
     return (
        <div className="pb-20 animate-fade-in">
             <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setViewMode('list')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-xl font-bold font-battambang">{TRANSLATIONS.addConcern[lang]}</h2> 
             </div>

             {creationStep === 0 && (
                 <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 font-battambang">{TRANSLATIONS.topicsHeader[lang]}</h3>
                        {topicPath.length > 0 && (
                            <button onClick={handleRestart} className="text-xs text-red-500 font-bold font-battambang">
                                {TRANSLATIONS.restart[lang]}
                            </button>
                        )}
                    </div>

                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {topicPath.map((item, idx) => (
                            <div key={idx} className="flex items-center text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full font-battambang">
                                <span>{item.icon} {item.text[lang]}</span>
                                {idx < topicPath.length - 1 && <span className="ml-2 text-indigo-300">›</span>}
                            </div>
                        ))}
                         {topicPath.length === 0 && (
                            <span className="text-sm text-slate-400 font-battambang italic">Select a topic to drill down...</span>
                         )}
                    </div>

                    {isGeneratingTopics ? (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-sm font-battambang">{TRANSLATIONS.generating[lang]}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            {currentOptions.map(topic => (
                                <button 
                                    key={topic.id}
                                    onClick={() => handleTopicClick(topic)}
                                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 active:scale-95"
                                >
                                    <span className="text-3xl">{topic.icon}</span>
                                    <span className="font-bold text-slate-700 text-xs font-battambang leading-tight">{topic.text[lang]}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <div className="mt-6 flex gap-3">
                         <button 
                             onClick={handleRegenerate}
                             disabled={isGeneratingTopics}
                             className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition font-battambang flex justify-center items-center gap-2"
                         >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                             {TRANSLATIONS.regenerateTopics[lang]}
                         </button>
                         {topicPath.length > 0 && (
                             <button 
                                 onClick={handleGoToSummary}
                                 disabled={isDrafting}
                                 className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition font-battambang flex justify-center items-center gap-2 disabled:opacity-70"
                             >
                                 {isDrafting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        {TRANSLATIONS.drafting[lang]}
                                    </>
                                 ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        {TRANSLATIONS.summarizeAndRecord[lang]}
                                    </>
                                 )}
                             </button>
                         )}
                    </div>
                 </div>
             )}

             {creationStep === 1 && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
                     <div className="flex items-center gap-3 mb-4">
                         <span className="text-2xl">📝</span>
                         <h3 className="font-bold text-slate-800 font-battambang">{TRANSLATIONS.whatWorriesYou[lang]}</h3>
                     </div>
                     
                     <div className="mb-4 bg-indigo-50 p-3 rounded-lg">
                        <p className="text-xs text-indigo-400 font-bold uppercase mb-1 font-battambang">{TRANSLATIONS.topicHistory[lang]}</p>
                        <p className="text-sm font-bold text-indigo-900 font-battambang">
                            {topicPath.map(t => t.text[lang]).join(' > ')}
                        </p>
                     </div>
                     
                     <textarea
                        value={detailText}
                        onChange={(e) => setDetailText(e.target.value)}
                        placeholder={TRANSLATIONS.describeWorry[lang]}
                        className="w-full h-32 p-4 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none font-battambang text-sm leading-relaxed"
                     />
                     
                     <div className="mt-6 flex gap-3">
                         <button
                             onClick={() => setCreationStep(0)}
                             className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold font-battambang"
                         >
                             Back
                         </button>
                         <button
                            onClick={handleAnalyzeAndSave}
                            disabled={isAnalyzing} 
                            className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 font-battambang"
                         >
                             {isAnalyzing ? TRANSLATIONS.analyzing[lang] : TRANSLATIONS.analyzeAndSave[lang]}
                         </button>
                     </div>
                 </div>
             )}
        </div>
     );
  }

  // Render Main List View
  return (
    <div className="pb-20 space-y-6 animate-fade-in">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-xl font-bold text-slate-900 font-battambang">
                    {isProvider || isAdmin ? TRANSLATIONS.marketTitle[lang] : TRANSLATIONS.concernTitle[lang]}
                </h2>
                <p className="text-xs text-slate-500 font-battambang mt-1">
                    {isProvider || isAdmin ? TRANSLATIONS.marketSubtitle[lang] : TRANSLATIONS.concernSubtitle[lang]}
                </p>
            </div>
            {!isProvider && !isAdmin && (
                <button 
                    onClick={handleStartCreate}
                    className="text-white bg-indigo-600 px-4 py-2 rounded-full font-bold shadow-md active:scale-95 transition font-battambang text-xs flex items-center gap-2"
                >
                    <span>+</span> {TRANSLATIONS.addConcern[lang]}
                </button>
            )}
        </div>

        <div className="space-y-4">
            {concerns.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                    <p className="font-battambang">{TRANSLATIONS.noPosts[lang]}</p>
                </div>
            ) : (
                concerns.map(concern => {
                    const hasAccess = canViewComments(concern);
                    const isOwner = concern.userId === currentUserId;
                    
                    return (
                        <div key={concern.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group">
                            {/* Status Bar */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${
                                concern.status === 'VERIFIED' ? 'bg-indigo-600' :
                                concern.status === 'PENDING_VERIFICATION' ? 'bg-orange-500' :
                                'bg-green-400'
                            }`}></div>
                            
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3 pl-2">
                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                         {isProvider || isAdmin ? (
                                             <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                         ) : (
                                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${concern.userId}`} alt="User" className="w-full h-full rounded-full" />
                                         )}
                                     </div>
                                     <div>
                                         <p className="text-xs font-bold text-slate-900 font-battambang">
                                             {isProvider || isAdmin ? TRANSLATIONS.anonymousUser[lang] : (isOwner ? 'You' : 'User')}
                                         </p>
                                         <p className="text-[10px] text-slate-400">
                                             {concern.timestamp.toLocaleDateString()}
                                         </p>
                                     </div>
                                 </div>
                                 
                                 <div className="flex flex-col items-end gap-1">
                                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                         concern.status === 'VERIFIED' ? 'bg-indigo-100 text-indigo-700' :
                                         concern.status === 'PENDING_VERIFICATION' ? 'bg-orange-100 text-orange-700' :
                                         'bg-green-100 text-green-700'
                                     }`}>
                                         {concern.status === 'VERIFIED' ? TRANSLATIONS.verifiedStatus[lang] : 
                                          concern.status === 'PENDING_VERIFICATION' ? TRANSLATIONS.pendingVerification[lang] :
                                          TRANSLATIONS.openStatus[lang]}
                                     </span>
                                     
                                     {/* Admin Action */}
                                     {isAdmin && concern.status === 'PENDING_VERIFICATION' && (
                                         <button 
                                            onClick={() => handleVerifyDeal(concern)}
                                            className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 font-bold hover:bg-red-200"
                                         >
                                             {TRANSLATIONS.verifyDeal[lang]}
                                         </button>
                                     )}
                                 </div>
                            </div>

                            {/* Main Content */}
                            <div className="pl-2 mb-4">
                                 <div className="flex items-start gap-2 mb-2">
                                    <span className="text-lg mt-0.5">🛡️</span>
                                    <h3 className="text-sm font-bold text-indigo-900 font-battambang leading-relaxed">
                                        {concern.aiSummary}
                                    </h3>
                                 </div>
                            </div>

                            {/* Discussion / Comments Section */}
                            {hasAccess && (
                                <div className="pl-2 border-t border-slate-50 pt-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{TRANSLATIONS.discuss[lang]}</p>
                                    
                                    <div className="space-y-3 mb-3">
                                        {concern.comments.length === 0 ? (
                                            <p className="text-xs text-slate-300 italic">{TRANSLATIONS.waitingForProposals[lang]}</p>
                                        ) : (
                                            concern.comments.map(comment => {
                                                const isAccepted = comment.id === concern.acceptedCommentId;
                                                // Show Contact Info Logic: If deal verified, and viewing user is the accepted author (or admin/owner)
                                                const showContact = concern.status === 'VERIFIED' && isAccepted && (comment.authorId === 'agent-me' || isAdmin || isOwner);

                                                return (
                                                    <div key={comment.id} className={`p-3 rounded-xl border ${
                                                        isAccepted 
                                                        ? 'bg-green-50 border-green-200' 
                                                        : 'bg-slate-50 border-slate-100'
                                                    }`}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`text-[10px] px-1.5 rounded ${comment.authorRole === UserRole.AGENT ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                                                                    {comment.authorRole}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-800">{comment.authorName}</span>
                                                            </div>
                                                            <span className="text-[9px] text-slate-400">{comment.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                        </div>
                                                        
                                                        <p className="text-xs text-slate-700 font-battambang leading-relaxed mb-2">
                                                            {comment.content}
                                                        </p>

                                                        {/* Reveal Contact Info Block */}
                                                        {showContact && concern.userContact && (
                                                            <div className="mt-2 bg-white p-2 rounded border border-green-200 flex flex-col animate-fade-in">
                                                                <span className="text-[9px] text-green-600 font-bold uppercase mb-1">{TRANSLATIONS.contactInfo[lang]}</span>
                                                                <span className="text-xs font-bold text-slate-800">📞 {concern.userContact.phone}</span>
                                                                <span className="text-xs font-bold text-slate-800">📧 {concern.userContact.email}</span>
                                                            </div>
                                                        )}

                                                        {/* Actions */}
                                                        <div className="flex justify-end gap-2 mt-1">
                                                            {/* Accept Deal Button (Owner only, on Proposals, if Open) */}
                                                            {isOwner && comment.isProposal && concern.status === 'OPEN' && (
                                                                <button 
                                                                    onClick={() => handleAcceptDeal(concern, comment)}
                                                                    className="text-[10px] bg-green-600 text-white px-3 py-1.5 rounded-full font-bold shadow hover:bg-green-700 transition"
                                                                >
                                                                    {TRANSLATIONS.acceptDeal[lang]}
                                                                </button>
                                                            )}
                                                            {isAccepted && (
                                                                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    {TRANSLATIONS.dealAccepted[lang]}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Input for Reply/Proposal */}
                                    {canComment(concern) && concern.status === 'OPEN' && (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={replyInputs[concern.id] || ''}
                                                onChange={(e) => handleReplyChange(concern.id, e.target.value)}
                                                placeholder={TRANSLATIONS.writeComment[lang]}
                                                className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-indigo-300 font-battambang"
                                            />
                                            <button 
                                                onClick={() => handlePostComment(concern)}
                                                disabled={!replyInputs[concern.id]}
                                                className="bg-indigo-600 text-white p-2 rounded-full disabled:bg-slate-300"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
};
