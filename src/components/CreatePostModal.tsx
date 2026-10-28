import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Post } from '../types/index.ts';
import { 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Hash, 
  Sparkles, 
  Check, 
  Upload, 
  Loader2 
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const SAMPLE_COMMUNITY_PHOTOS = [
  {
    title: 'Digital Village / ग्राम विकास',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Community Education / शिक्षा',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Heritage & Culture / धरोहर',
    url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Varanasi Ghats / काशी',
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Clean Energy / सौर ऊर्जा',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
  },
];

const SUGGESTED_HASHTAGS = [
  'JantaConnect',
  'DigitalIndia',
  'किसान_कल्याण',
  'VocalForLocal',
  'YuvaShakti',
  'IncredibleIndia',
  'EducationForAll',
  'SwachhBharat',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { t, language } = useLanguage();
  const { user, token } = useAuth();

  const [content, setContent] = useState('');
  const [postLanguage, setPostLanguage] = useState<'hi' | 'en' | 'hinglish'>(
    language === 'hi' ? 'hi' : 'en'
  );
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload as Base64 Data URL for real persistent storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(language === 'hi' ? 'फोटो का आकार 5MB से कम होना चाहिए।' : 'Photo size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImage(loadEvent.target?.result as string);
        setShowPhotoPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHashtag = (tag: string) => {
    const hashtagText = `#${tag} `;
    if (!content.includes(`#${tag}`)) {
      setContent((prev) => (prev ? `${prev} ${hashtagText}` : hashtagText));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError(language === 'hi' ? 'कृपया पोस्ट में कुछ लिखें।' : 'Please write something in your post.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          language: postLanguage,
          image: image || undefined,
          location: location || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create post');
        setSubmitting(false);
        return;
      }

      onPostCreated(data.post);
      setContent('');
      setImage('');
      setLocation('');
      setShowLocationInput(false);
      setShowPhotoPicker(false);
      onClose();
    } catch {
      setError(language === 'hi' ? 'सर्वर से संपर्क करने में त्रुटि।' : 'Failed to connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {t('createPostTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User preview and language selector */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">{user?.name}</span>
              <span className="text-[11px] text-slate-600 block">@{user?.username}</span>
            </div>
          </div>

          {/* Post language selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setPostLanguage('hi')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                postLanguage === 'hi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setPostLanguage('en')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                postLanguage === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setPostLanguage('hinglish')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                postLanguage === 'hinglish' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-5 my-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder={t('whatsOnYourMind')}
            className="w-full text-slate-900 placeholder:text-slate-400 text-sm sm:text-base border-0 focus:ring-0 p-0 resize-none focus:outline-hidden"
            autoFocus
          />

          {/* Attached image preview */}
          {image && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-slate-100">
              <img src={image} alt="Upload preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => setImage('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                title={t('removePhoto')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Location input field */}
          {showLocationInput && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('addLocation')}
                className="w-full bg-transparent text-xs text-slate-800 border-0 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  setLocation('');
                  setShowLocationInput(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Photo Picker Drawer */}
          {showPhotoPicker && !image && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{t('enterPhotoUrl')}</span>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Upload from file button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-lg bg-white border border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'डिवाइस से फोटो अपलोड करें' : 'Upload photo from device'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-600 font-medium pt-1">
                {t('selectSamplePhoto')}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {SAMPLE_COMMUNITY_PHOTOS.map((sample) => (
                  <button
                    key={sample.url}
                    type="button"
                    onClick={() => {
                      setImage(sample.url);
                      setShowPhotoPicker(false);
                    }}
                    className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video hover:ring-2 hover:ring-blue-600 transition-all text-left"
                  >
                    <img src={sample.url} alt={sample.title} className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1 text-[9px] text-white font-semibold leading-tight">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Hashtags */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1.5">
              <Hash className="w-3 h-3 text-blue-600" />
              <span>{t('addTags')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_HASHTAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddHashtag(tag)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[11px] font-medium text-slate-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                className={`p-2 rounded-lg transition-colors ${
                  showPhotoPicker || image ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-100'
                }`}
                title={t('addPhoto')}
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowLocationInput(!showLocationInput)}
                className={`p-2 rounded-lg transition-colors ${
                  showLocationInput || location ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-100'
                }`}
                title={t('addLocation')}
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('publishing')}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('publishPost')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
