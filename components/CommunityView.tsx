import React, { useState } from 'react';
import { SocialPost, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { moderateSocialPost } from '../services/geminiService';

interface CommunityViewProps {
  lang: 'en' | 'km';
  currentUserRole: UserRole;
  posts: SocialPost[];
  onPostCreate: (post: SocialPost) => void;
  onToggleBookmark: (postId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ 
  lang, 
  currentUserRole, 
  posts, 
  onPostCreate, 
  onToggleBookmark 
}) => {
  const [newContent, setNewContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const handlePost = async () => {
    if (!newContent.trim()) return;
    setIsPosting(true);
    setErrorMsg(null);

    const moderation = await moderateSocialPost(newContent);

    if (!moderation.isRelated) {
      setErrorMsg(moderation.reason || TRANSLATIONS.moderationWarning[lang]);
      setIsPosting(false);
      return;
    }

    const newPost: SocialPost = {
      id: Date.now().toString(),
      author: 'You', 
      role: currentUserRole,
      content: newContent,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      tags: ['General'],
      bookmarked: false
    };

    onPostCreate(newPost);
    setNewContent('');
    setIsPosting(false);
    setIsWriting(false);
  };

  const toggleComments = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  const displayedPosts = activeTab === 'saved' 
    ? posts.filter(p => p.bookmarked)
    : posts;

  return (
    <div className="space-y-6 pb-20">
       <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 font-battambang">{TRANSLATIONS.community[lang]}</h2>
            <button 
                onClick={() => setIsWriting(!isWriting)}
                className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-full font-battambang"
            >
                {isWriting ? TRANSLATIONS.cancel[lang] : `+ ${TRANSLATIONS.newPost[lang]}`}
            </button>
       </div>

       {/* Tabs / Segmented Control */}
       <div className="bg-slate-100 p-1 rounded-xl flex">
          <button 
             onClick={() => setActiveTab('all')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all font-battambang ${
                 activeTab === 'all' 
                 ? 'bg-white text-indigo-900 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
             }`}
          >
              {TRANSLATIONS.forYou[lang]}
          </button>
          <button 
             onClick={() => setActiveTab('saved')}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 font-battambang ${
                 activeTab === 'saved' 
                 ? 'bg-white text-indigo-900 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
             }`}
          >
              <span>{TRANSLATIONS.saved[lang]}</span>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
       </div>

      {/* Create Post Area */}
      {isWriting && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-fade-in">
            <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={TRANSLATIONS.postPlaceholder[lang]}
                className="w-full bg-slate-50 border-transparent rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all font-battambang resize-none h-24"
            />
            
            {errorMsg && (
                <div className="mt-2 text-red-500 text-xs flex items-center font-medium font-battambang">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {errorMsg}
                </div>
            )}

            <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium font-battambang">
                    {TRANSLATIONS.aiModerated[lang]}
                </span>
                <button
                    onClick={handlePost}
                    disabled={isPosting || !newContent}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:shadow-none font-battambang"
                >
                    {isPosting ? TRANSLATIONS.analyzing[lang] : TRANSLATIONS.postBtn[lang]}
                </button>
            </div>
          </div>
      )}

      {/* Feed */}
      <div className="space-y-4 min-h-[50vh]">
        {displayedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                   {activeTab === 'saved' ? (
                       <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                   ) : (
                       <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                   )}
                </div>
                <p className="text-sm font-medium font-battambang">
                    {activeTab === 'saved' ? TRANSLATIONS.noSavedPosts[lang] : TRANSLATIONS.noPosts[lang]}
                </p>
            </div>
        ) : (
            displayedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${post.role === UserRole.AGENT ? 'bg-indigo-500' : 'bg-amber-500'}`}>
                        {post.author[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{post.author}</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">{post.role}</p>
                    </div>
                    <span className="ml-auto text-[10px] text-slate-400">{post.timestamp.toLocaleDateString()}</span>
                </div>

                <p className="text-slate-700 text-sm leading-6 font-battambang mb-3">
                    {post.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-6 border-t border-slate-50 pt-3">
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span className="text-xs font-medium">{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 transition group ${expandedPostId === post.id ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-500'}`}
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <span className="text-xs font-medium">{post.comments.length}</span>
                    </button>
                    
                    {/* Bookmark Button */}
                    <button 
                        onClick={() => onToggleBookmark(post.id)}
                        className={`ml-auto transition-all duration-200 ${post.bookmarked ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-indigo-600'}`}
                    >
                        <svg className="w-5 h-5" fill={post.bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </button>
                </div>

                {/* Comment Section */}
                {expandedPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/50 -mx-5 px-5 py-3 mb-[-20px] rounded-b-2xl">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5 ${comment.role === UserRole.AGENT ? 'bg-indigo-400' : 'bg-slate-400'}`}>
                             {comment.author[0]}
                          </div>
                          <div className="flex-1 bg-white rounded-xl rounded-tl-none p-3 shadow-sm border border-slate-100">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800">{comment.author}</span>
                                <span className="text-[9px] text-slate-400">{comment.timestamp.toLocaleDateString()}</span>
                             </div>
                             <p className="text-xs text-slate-600 font-battambang leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs text-slate-400 py-2 font-battambang">No comments yet</p>
                    )}
                    {/* Placeholder for future "Add Comment" input */}
                    <div className="pt-2">
                       <input 
                         type="text" 
                         disabled
                         placeholder="Write a comment... (Coming Soon)" 
                         className="w-full text-xs bg-white border border-slate-200 rounded-full px-4 py-2 text-slate-500"
                       />
                    </div>
                  </div>
                )}
            </div>
            ))
        )}
      </div>
    </div>
  );
};