import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { BackendStatus } from '../types/index.ts';
import { 
  Settings, 
  Languages, 
  Database, 
  ShieldCheck, 
  Server, 
  Smartphone, 
  Sparkles, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Copy, 
  Check 
} from 'lucide-react';

interface SettingsScreenProps {
  onOpenDownload?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onOpenDownload }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, setAuthModalOpen } = useAuth();

  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [copiedInfo, setCopiedInfo] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/config/status');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus(data);
        }
      } catch (err) {
        console.error('Failed to load backend status:', err);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  const handleCopyDiagnostics = () => {
    if (backendStatus && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(backendStatus, null, 2));
      setCopiedInfo(true);
      setTimeout(() => setCopiedInfo(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-base font-bold text-slate-900">
            {t('settingsTitle')}
          </h1>
        </div>
      </div>

      {/* ANDROID APK & SOURCE CODE DOWNLOAD CARD */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'Android APK एवं सोर्स कोड हब' : 'Android APK & Source Code'}
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                com.jantaconnect.app · Janta Connect
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/download/source-zip"
              download="janta-connect-source.zip"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <span>{language === 'hi' ? 'ZIP डाउनलोड' : 'Download ZIP'}</span>
              <span className="text-[10px] bg-emerald-800/60 px-1.5 py-0.5 rounded">508 KB</span>
            </a>

            {onOpenDownload && (
              <button
                type="button"
                onClick={onOpenDownload}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'गाइड व विवरण' : 'Guide & Details'}
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'संपूर्ण प्रोजेक्ट कोड (React + Express + Capacitor Android Native) एक वास्तविक ZIP फाइल में उपलब्ध है। डाउनलोड करके Android Studio में खोलें और 1 क्लिक में APK बनाएं।'
            : 'Complete codebase (React + Express + Capacitor Native Android) is packaged as a real ZIP file. Download and open in Android Studio to build the APK.'}
        </p>
      </div>

      {/* LANGUAGE PREFERENCES SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Languages className="w-4 h-4 text-blue-600" />
          <span>{t('languageSection')}</span>
        </div>
        <p className="text-xs text-slate-600">
          {t('languageSubtitle')}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              language === 'hi'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-900'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">हिन्दी (Hindi)</span>
              {language === 'hi' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
            </div>
            <span className="text-[11px] text-slate-600 mt-0.5 block">
              डिफ़ॉल्ट देवनागरी लिपि
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              language === 'en'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 text-blue-900'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">English</span>
              {language === 'en' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
            </div>
            <span className="text-[11px] text-slate-600 mt-0.5 block">
              Latin script interface
            </span>
          </button>
        </div>
      </div>

      {/* BACKEND & DATABASE DIAGNOSTICS PANEL */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Server className="w-4 h-4 text-blue-600" />
            <span>{t('backendStatusSection')}</span>
          </div>
          <button
            onClick={handleCopyDiagnostics}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            {copiedInfo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedInfo ? 'Copied' : t('copyStatusInfo')}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600">
          {t('backendStatusDesc')}
        </p>

        {loadingStatus ? (
          <div className="py-4 text-center text-xs text-slate-500">
            Checking backend status...
          </div>
        ) : backendStatus ? (
          <div className="space-y-3">
            {/* Status Item 1: Database */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex items-start gap-3">
              <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{t('dbStatusLabel')}</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {backendStatus.database.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {backendStatus.database.provider} ({backendStatus.database.storageFile})
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5 font-medium">
                  <span>{backendStatus.database.activeUsers} {t('usersCount')}</span>
                  <span>·</span>
                  <span>{backendStatus.database.activePosts} {t('postsCount')}</span>
                  <span>·</span>
                  <span>{backendStatus.database.activeComments} {t('commentsCount')}</span>
                </div>
              </div>
            </div>

            {/* Status Item 2: Authentication */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{t('authStatusLabel')}</span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {backendStatus.authentication.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {backendStatus.authentication.mode}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {backendStatus.authentication.features.map((feat) => (
                    <span key={feat} className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Item 3: SMS Gateway Configuration Requirement Banner */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">{t('smsGatewayLabel')}</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
                    SIMULATION & DEV ACTIVE
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                  {backendStatus.services.smsGateway.note}
                </p>
                <div className="mt-2 p-2 bg-white/80 rounded-lg text-[11px] font-mono text-slate-700 border border-amber-200">
                  MSG91_AUTH_KEY="..." or TWILIO_ACCOUNT_SID="..."
                </div>
              </div>
            </div>

            {/* Status Item 4: AI Translation */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{t('aiEngineLabel')}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    backendStatus.services.aiTranslation.configured
                      ? 'text-emerald-700 bg-emerald-100'
                      : 'text-blue-700 bg-blue-100'
                  }`}>
                    {backendStatus.services.aiTranslation.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {backendStatus.services.aiTranslation.note}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">
            Backend status unavailable. Server is offline.
          </div>
        )}

        {/* Clear Notice Box Required by User Prompt */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{t('needBackendConfigTitle')}</span>
          </div>
          <p className="leading-relaxed text-blue-900/90">
            {t('needBackendConfigMsg')}
          </p>
        </div>
      </div>

      {/* ACCOUNT DETAILS & LOGOUT */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">
          {language === 'hi' ? 'खाता विवरण एवं नियंत्रण' : 'Account & Session'}
        </h2>

        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 truncate">{user.name}</span>
                  {user.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <span className="text-xs text-slate-500 truncate block">
                  @{user.username} {user.email ? `· ${user.email}` : user.phone ? `· ${user.phone}` : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logoutBtn')}</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-xs text-slate-500 mb-3">
              {language === 'hi' ? 'आप वर्तमान में लॉग इन नहीं हैं।' : 'You are currently not signed in.'}
            </p>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
            >
              {t('loginBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
