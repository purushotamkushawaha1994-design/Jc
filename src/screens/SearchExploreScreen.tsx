import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { User, Post } from '../types/index.ts';
import { PostCard } from '../components/PostCard.tsx';
import { 
  Search, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  Loader2, 
  X 
} from 'lucide-react';

interface SearchExploreScreenProps {
  onUserClick: (username: string) => void;
  onTagClick: (tag: string) => void;
}

export const SearchExploreScreen: React.FC<SearchExploreScreenProps> = ({
  onUserClick,
  onTagClick,
}) => {
  const { t, language } = useLanguage();
  const { user, token, setAuthModalOpen } = useAuth();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [trendingTags, setTrendingTags] = useState<{ tag: string; count: number; labelHi?: string }[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const [matchedPosts, setMatchedPosts] = useState<Post[]>([]);

  // Fetch explore initial state
  useEffect(() => {
    const fetchExplore = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/search');
        if (res.ok) {
          const data = await res.json();
          setSuggestedUsers(data.users || []);
          setTrendingTags(data.trendingTags || []);
        }
      } catch (err) {
        console.error('Failed to load explore data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setMatchedUsers([]);
      setMatchedPosts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setMatchedUsers(data.users || []);
          setMatchedPosts(data.posts || []);
        }
      } catch (err) {
        console.error('Search request failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle Follow / Unfollow
  const handleFollowToggle = async (targetUsername: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/users/${targetUsername}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        // Update user's following list in suggested & matched
        setSuggestedUsers((prev) =>
          prev.map((u) => {
            if (u.username === targetUsername) {
              const followers = u.followers || [];
              const updated = data.isFollowing
                ? [...followers, user.id]
                : followers.filter((id) => id !== user.id);
              return { ...u, followers: updated, followersCount: data.followersCount };
            }
            return u;
          })
        );
        setMatchedUsers((prev) =>
          prev.map((u) => {
            if (u.username === targetUsername) {
              const followers = u.followers || [];
              const updated = data.isFollowing
                ? [...followers, user.id]
                : followers.filter((id) => id !== user.id);
              return { ...u, followers: updated, followersCount: data.followersCount };
            }
            return u;
          })
        );
      }
    } catch (err) {
      console.error('Follow action failed:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      {/* SEARCH RESULTS VIEW */}
      {query.trim() && !loading && (
        <div className="space-y-4">
          {/* Matched Users */}
          {matchedUsers.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>{t('peopleFound')} ({matchedUsers.length})</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {matchedUsers.map((targetUser) => {
                  const isFollowing = user ? targetUser.followers?.includes(user.id) : false;
                  const isSelf = user?.id === targetUser.id;

                  return (
                    <div
                      key={targetUser.id}
                      onClick={() => onUserClick(targetUser.username)}
                      className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={targetUser.avatar}
                          alt={targetUser.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {targetUser.name}
                            </span>
                            {targetUser.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500 truncate block">
                            @{targetUser.username}
                          </span>
                          {targetUser.bio && (
                            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                              {targetUser.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      {!isSelf && (
                        <button
                          onClick={(e) => handleFollowToggle(targetUser.username, e)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                            isFollowing
                              ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{t('followingBtn')}</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>{t('follow')}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Posts */}
          {matchedPosts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 px-1">
                {t('postsFound')} ({matchedPosts.length})
              </h3>
              {matchedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUserClick={onUserClick}
                  onTagClick={onTagClick}
                />
              ))}
            </div>
          )}

          {matchedUsers.length === 0 && matchedPosts.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                {t('noSearchResults')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* DEFAULT EXPLORE VIEW (WHEN NO QUERY) */}
      {!query.trim() && (
        <div className="space-y-4">
          {/* Trending Topics & Hashtags */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('trendingTopics')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {trendingTags.map((item, idx) => (
                <button
                  key={item.tag}
                  onClick={() => onTagClick(item.tag)}
                  className="p-3 rounded-xl bg-slate-50/80 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 text-left transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <span>#{idx + 1} {language === 'hi' ? 'ट्रेंडिंग' : 'Trending'}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
                      #{item.tag}
                    </div>
                    {item.labelHi && (
                      <div className="text-[11px] text-slate-500">
                        {language === 'hi' ? item.labelHi : item.tag}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600">
                    {item.count} {language === 'hi' ? 'पोस्ट्स' : 'posts'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Citizens / Organizations */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('suggestedPeople')}
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {suggestedUsers.map((targetUser) => {
                const isFollowing = user ? targetUser.followers?.includes(user.id) : false;
                const isSelf = user?.id === targetUser.id;

                return (
                  <div
                    key={targetUser.id}
                    onClick={() => onUserClick(targetUser.username)}
                    className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={targetUser.avatar}
                        alt={targetUser.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {targetUser.name}
                          </span>
                          {targetUser.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-slate-500 truncate block">
                          @{targetUser.username}
                        </span>
                        {targetUser.bio && (
                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                            {targetUser.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isSelf && (
                      <button
                        onClick={(e) => handleFollowToggle(targetUser.username, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                          isFollowing
                            ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{t('followingBtn')}</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>{t('follow')}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
