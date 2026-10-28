import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { User, Post } from '../types/index.ts';
import { PostCard } from '../components/PostCard.tsx';
import { 
  ShieldCheck, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Edit3, 
  UserPlus, 
  UserCheck, 
  Loader2, 
  X, 
  Check, 
  ArrowLeft 
} from 'lucide-react';

interface ProfileScreenProps {
  username?: string | null;
  onBack?: () => void;
  onTagClick?: (tag: string) => void;
  onUserClick?: (username: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  username,
  onBack,
  onTagClick,
  onUserClick,
}) => {
  const { t, language } = useLanguage();
  const { user: currentUser, token, setAuthModalOpen, updateProfile } = useAuth();

  const targetUsername = username || currentUser?.username;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');

  // Edit Profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!targetUsername) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUsername}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setProfileUser(data.user);
        setProfilePosts(data.posts || []);
        setIsFollowing(Boolean(data.user.isFollowing));
        setFollowersCount(data.user.followersCount || 0);

        // Populate edit modal fields if self
        if (data.user.isSelf) {
          setEditName(data.user.name || '');
          setEditBio(data.user.bio || '');
          setEditLocation(data.user.location || '');
          setEditWebsite(data.user.website || '');
          setEditAvatar(data.user.avatar || '');
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [targetUsername, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!profileUser) return;

    const previousFollowing = isFollowing;
    const previousCount = followersCount;

    setIsFollowing(!previousFollowing);
    setFollowersCount(previousFollowing ? previousCount - 1 : previousCount + 1);

    try {
      const res = await fetch(`/api/users/${profileUser.username}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
      } else {
        setIsFollowing(previousFollowing);
        setFollowersCount(previousCount);
      }
    } catch {
      setIsFollowing(previousFollowing);
      setFollowersCount(previousCount);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateProfile({
      name: editName,
      bio: editBio,
      location: editLocation,
      website: editWebsite,
      avatar: editAvatar || profileUser?.avatar,
    });
    setSavingProfile(false);
    if (res.success) {
      setShowEditModal(false);
      fetchProfile();
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
        <p className="text-sm text-slate-600 mb-3">
          {language === 'hi' ? 'यूज़र प्रोफ़ाइल नहीं मिली।' : 'User profile not found.'}
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
          </button>
        )}
      </div>
    );
  }

  const isSelf = currentUser ? currentUser.id === profileUser.id : false;

  const mediaPosts = profilePosts.filter((p) => Boolean(p.image));

  return (
    <div className="space-y-4">
      {/* Top back navigation button if viewed as sub-screen */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
      )}

      {/* Profile Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 relative">
          {profileUser.coverImage && (
            <img
              src={profileUser.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info Area */}
        <div className="px-5 pb-5 pt-0 relative">
          {/* Avatar and Action button row */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-4">
            <div className="relative">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
              />
              {profileUser.verified && (
                <div 
                  className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow-sm"
                  title={t('verifiedUser')}
                >
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </div>

            {/* Action Button: Edit or Follow */}
            <div>
              {isSelf ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{t('editProfile')}</span>
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-600'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>{t('followingBtn')}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{t('follow')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {profileUser.name}
              </h1>
              {profileUser.verified && (
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              @{profileUser.username}
            </p>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-sm text-slate-800 mt-2.5 leading-relaxed">
                {profileUser.bio}
              </p>
            )}

            {/* Metadata (Location, Website, Joined) with unboxed dot discipline */}
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap mt-3">
              {profileUser.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileUser.location}</span>
                </span>
              )}

              {profileUser.website && (
                <>
                  <span aria-hidden="true">·</span>
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span className="max-w-[160px] truncate">{profileUser.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                </>
              )}

              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {t('joinedOn')}{' '}
                  {new Date(profileUser.joinedAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </span>
            </div>

            {/* Stats: Followers / Following / Posts */}
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm">
              <div>
                <span className="font-extrabold text-slate-900">{profilePosts.length}</span>{' '}
                <span className="text-slate-500">{t('postsTab')}</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900">{followersCount}</span>{' '}
                <span className="text-slate-500">{t('followersCount')}</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900">{profileUser.following?.length || 0}</span>{' '}
                <span className="text-slate-500">{t('followingCount')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-slate-100 text-xs sm:text-sm font-bold bg-slate-50/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-center transition-all border-b-2 cursor-pointer ${
              activeTab === 'posts'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('postsTab')} ({profilePosts.length})
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-3 text-center transition-all border-b-2 cursor-pointer ${
              activeTab === 'media'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t('mediaTab')} ({mediaPosts.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {profilePosts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
              <p className="text-xs sm:text-sm text-slate-500">
                {t('noPostsUser')}
              </p>
            </div>
          ) : (
            profilePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onTagClick={onTagClick}
                onUserClick={onUserClick}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {mediaPosts.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              {language === 'hi' ? 'कोई फ़ोटो या मीडिया नहीं मिला।' : 'No photos shared yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mediaPosts.map((post) => (
                <div key={post.id} className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 group">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-white text-[10px]">
                    {post.likes.length} likes
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {t('editProfile')}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullNameLabel')}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('bioLabel')}
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('locationLabel')}
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="उदा. नई दिल्ली / Lucknow"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('websiteLabel')}
                </label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('avatarUrlLabel')}
                </label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                >
                  {savingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{t('saveProfile')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
