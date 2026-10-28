import React, { useState, useEffect, useCallback } from 'react';
import { Post } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { PostCard } from '../components/PostCard.tsx';
import { 
  Sparkles, 
  Flame, 
  Users, 
  Image as ImageIcon, 
  ShieldCheck, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

interface HomeFeedProps {
  onOpenCreate: () => void;
  onUserClick: (username: string) => void;
  onTagClick: (tag: string) => void;
  activeTagFilter: string | null;
  onClearTagFilter: () => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onOpenCreate,
  onUserClick,
  onTagClick,
  activeTagFilter,
  onClearTagFilter,
}) => {
  const { t, language } = useLanguage();
  const { user, token, setAuthModalOpen } = useAuth();

  const [feedTab, setFeedTab] = useState<'all' | 'following' | 'trending' | 'hi' | 'en'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = useCallback(async () => {
    try {
      let url = '/api/posts?';
      if (activeTagFilter) {
        url += `tag=${encodeURIComponent(activeTagFilter)}&`;
      } else if (feedTab === 'hi' || feedTab === 'en') {
        url += `language=${feedTab}&`;
      } else {
        url += `filter=${feedTab}&`;
      }

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTagFilter, feedTab, token]);

  useEffect(() => {
    setLoading(true);
    fetchFeed();
  }, [fetchFeed]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFeed();
  };

  // Featured voices in stories/spotlight row
  const spotlightVoices = [
    {
      name: 'जनता लाइव',
      username: 'jantanews',
      avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&auto=format&fit=crop&q=80',
      label: 'News',
    },
    {
      name: 'Vikram P.',
      username: 'vikram_patil',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      label: 'AgriTech',
    },
    {
      name: 'Dr. Sunita',
      username: 'dr_sunita',
      avatar: 'https://images.unsplash.com/photo-1594824813637-43c2295550a2?w=150&auto=format&fit=crop&q=80',
      label: 'Health',
    },
    {
      name: 'Priya K.',
      username: 'priya_k',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      label: 'Education',
    },
    {
      name: 'Aarav S.',
      username: 'aarav_sharma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      label: 'Culture',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Spotlight Voices / Citizens Carousel */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="text-[11px] font-bold text-slate-600 mb-2.5 flex items-center justify-between">
          <span>{language === 'hi' ? 'विशेष नागरिक व मंच' : 'Spotlight Voices & Organizations'}</span>
          <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => onTagClick('JantaConnect')}>
            #JantaConnect
          </span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {spotlightVoices.map((voice) => (
            <button
              key={voice.username}
              onClick={() => onUserClick(voice.username)}
              className="flex flex-col items-center shrink-0 group focus:outline-hidden"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 group-hover:scale-105 transition-transform">
                <img
                  src={voice.avatar}
                  alt={voice.name}
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-white"
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-800 mt-1 max-w-[64px] truncate text-center">
                {voice.name}
              </span>
              <span className="text-[9px] text-blue-600 font-medium leading-none">
                {voice.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Create Prompt Box */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80'}
            alt=""
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
          />
          <button
            onClick={() => {
              if (!user) setAuthModalOpen(true);
              else onOpenCreate();
            }}
            className="flex-1 text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-500 transition-colors cursor-pointer"
          >
            {user ? t('whatsOnYourMind') : (language === 'hi' ? 'अपनी आवाज़ साझा करने के लिए लॉग इन करें...' : 'Sign in to share your thoughts with the nation...')}
          </button>
          <button
            onClick={() => {
              if (!user) setAuthModalOpen(true);
              else onOpenCreate();
            }}
            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title={t('addPhoto')}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Tag Filter Pill */}
      {activeTagFilter && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span>{language === 'hi' ? 'फ़िल्टर हैशटैग:' : 'Filter Tag:'}</span>
            <span className="font-bold text-blue-700">#{activeTagFilter}</span>
          </div>
          <button
            onClick={onClearTagFilter}
            className="font-bold text-blue-600 hover:underline"
          >
            {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear Filter'}
          </button>
        </div>
      )}

      {/* Feed Filter Segmented Controls */}
      {!activeTagFilter && (
        <div className="flex items-center justify-between gap-1 overflow-x-auto p-1 bg-slate-200/60 rounded-xl">
          <button
            onClick={() => setFeedTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              feedTab === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('feedForYou')}
          </button>

          <button
            onClick={() => setFeedTab('following')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              feedTab === 'following' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('feedFollowing')}
          </button>

          <button
            onClick={() => setFeedTab('trending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              feedTab === 'trending' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('feedTrending')}
          </button>

          <button
            onClick={() => setFeedTab('hi')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              feedTab === 'hi' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('feedHindiOnly')}
          </button>

          <button
            onClick={() => setFeedTab('en')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              feedTab === 'en' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('feedEnglishOnly')}
          </button>

          <button
            onClick={handleRefresh}
            title="Refresh"
            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-white/50 transition-colors ml-auto shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {/* Posts Stream */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-600 space-y-2">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          <span className="text-xs">
            {language === 'hi' ? 'पोस्ट लोड हो रही हैं...' : 'Loading feed...'}
          </span>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs">
          <p className="text-sm font-semibold text-slate-700 mb-2">
            {language === 'hi' ? 'इस श्रेणी में अभी कोई पोस्ट नहीं है।' : 'No posts in this feed yet.'}
          </p>
          <button
            onClick={() => {
              if (!user) setAuthModalOpen(true);
              else onOpenCreate();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            {t('createPostTitle')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUserClick={onUserClick}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
