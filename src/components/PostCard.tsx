import React, { useState } from 'react';
import { Post, Comment } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Languages, 
  Send, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onUserClick?: (username: string) => void;
  onTagClick?: (tag: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUserClick, onTagClick }) => {
  const { t, language } = useLanguage();
  const { user, token, setAuthModalOpen } = useAuth();

  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Translation state
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Share feedback
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Image modal preview
  const [zoomImage, setZoomImage] = useState(false);

  // Like handler with real server synchronization
  const handleLikeToggle = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic UI update
    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      } else {
        // Revert on server error
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
      }
    } catch {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
    }
  };

  // Comments handler
  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newCommentText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setCommentCount(data.commentCount);
        setNewCommentText('');
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Translation handler
  const handleTranslateToggle = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    // Check if we already have translation cached or in post data
    const targetLang = language === 'hi' ? 'hi' : 'en';
    if (post.translatedContent && post.translatedContent[targetLang]) {
      setTranslatedText(post.translatedContent[targetLang]!);
      setIsTranslated(true);
      return;
    }

    if (translatedText) {
      setIsTranslated(true);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: post.content,
          targetLang: language === 'hi' ? 'hi' : 'en',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTranslatedText(data.translated);
        setIsTranslated(true);
      }
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Share handler
  const handleShare = () => {
    const shareUrl = `${window.location.origin}?post=${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);
    }
  };

  // Format time ago
  const formatTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 1) return language === 'hi' ? 'अभी' : 'just now';
      if (diffMins < 60) return language === 'hi' ? `${diffMins} मिनट पहले` : `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return language === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return language === 'hi' ? `${diffDays} दिन पहले` : `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-200 transition-all overflow-hidden mb-4">
      <div className="p-4 sm:p-5">
        {/* Header: Author info & clean unboxed metadata */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUserClick?.(post.author.username)}
              className="relative shrink-0 group focus:outline-hidden"
            >
              <img
                src={post.author.avatar || 'https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80'}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-600 transition-all"
              />
            </button>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onUserClick?.(post.author.username)}
                  className="font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors text-left"
                >
                  {post.author.name}
                </button>
                {post.author.verified && (
                  <span title={t('verifiedUser')} className="inline-flex">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </span>
                )}
              </div>
              
              {/* Clean unboxed metadata with dot separators */}
              <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap mt-0.5">
                <button
                  onClick={() => onUserClick?.(post.author.username)}
                  className="hover:underline text-slate-600"
                >
                  @{post.author.username}
                </button>
                <span aria-hidden="true">·</span>
                <span>{formatTime(post.createdAt)}</span>
                {post.location && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{post.location}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quiet language label */}
          <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider shrink-0 bg-slate-50 px-2 py-0.5 rounded">
            {post.language === 'hi' ? 'हिंदी' : post.language === 'en' ? 'English' : 'Hinglish'}
          </span>
        </div>

        {/* Post Content */}
        <div className="mt-3.5 text-slate-800 text-sm sm:text-base whitespace-pre-line leading-relaxed">
          {isTranslated && translatedText ? (
            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100/90 text-blue-950">
              <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-2">
                <span className="flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'अनुवादित पाठ (Translated)' : 'Translated into English'}</span>
                </span>
                <button
                  onClick={handleTranslateToggle}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  {t('showOriginal')}
                </button>
              </div>
              <p>{translatedText}</p>
            </div>
          ) : (
            <p>{post.content}</p>
          )}
        </div>

        {/* Interactive Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Translation action toggle */}
        <div className="mt-2.5">
          <button
            onClick={handleTranslateToggle}
            disabled={isTranslating}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors cursor-pointer py-1"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>
              {isTranslating
                ? t('translating')
                : isTranslated
                ? t('showOriginal')
                : t('translatePost')}
            </span>
          </button>
        </div>

        {/* Post Image with zoom modal */}
        {post.image && (
          <div className="mt-3.5 rounded-xl overflow-hidden border border-slate-200/70 bg-slate-100 max-h-96">
            <img
              src={post.image}
              alt="Post attachment"
              onClick={() => setZoomImage(true)}
              className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
              loading="lazy"
            />
          </div>
        )}

        {/* Image Full Modal */}
        {zoomImage && (
          <div
            onClick={() => setZoomImage(false)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={post.image}
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Action Bar (Likes, Comments, Share) */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-slate-600 text-xs">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              isLiked
                ? 'text-rose-600 font-bold bg-rose-50'
                : 'hover:text-rose-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600 scale-110' : ''} transition-transform`} />
            <span>{likeCount}</span>
            <span className="hidden sm:inline">{isLiked ? t('liked') : t('like')}</span>
          </button>

          {/* Comments Button */}
          <button
            onClick={handleToggleComments}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              showComments ? 'text-blue-600 font-bold bg-blue-50' : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentCount}</span>
            <span className="hidden sm:inline">{t('comments')}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {showCopiedToast ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {showCopiedToast ? t('copiedLink') : t('share')}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-slate-100/80 space-y-3">
            {/* New Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={user ? t('replyPlaceholder') : 'लॉग इन करें और टिप्पणी करें... / Sign in to comment'}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={submittingComment || !newCommentText.trim()}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Existing Comments List */}
            {loadingComments ? (
              <div className="text-center py-4 text-xs text-slate-600">
                टिप्पणियां लोड हो रही हैं... / Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-2">
                {t('noCommentsYet')}
              </p>
            ) : (
              <div className="space-y-2.5 pt-2 max-h-60 overflow-y-auto">
                {comments.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <img
                      src={comm.author.avatar || 'https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80'}
                      alt={comm.author.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {comm.author.name}
                        </span>
                        {comm.author.verified && (
                          <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-600">
                          · {formatTime(comm.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5 whitespace-pre-wrap">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
