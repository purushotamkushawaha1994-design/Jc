import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ScreenTab } from '../types/index.ts';
import { Languages, Bell, Search, ShieldCheck, LogIn } from 'lucide-react';

interface HeaderProps {
  currentTab: ScreenTab;
  setCurrentTab: (tab: ScreenTab) => void;
  unreadCount: number;
  onOpenDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setCurrentTab, unreadCount, onOpenDownload }) => {
  const { language, toggleLanguage } = useLanguage();
  const { user, setAuthModalOpen } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-blue-100/80 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-lg tracking-wider">JC</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg md:text-xl text-slate-900 tracking-tight leading-none">
                {language === 'hi' ? 'जनता कनेक्ट' : 'Janta Connect'}
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100"></span>
            </div>
            <span className="text-[11px] font-medium text-slate-600 leading-tight">
              {language === 'hi' ? 'द्विभाषी जन-मंच' : 'Bilingual Citizen Social'}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* APK & Download Hub button */}
          {onOpenDownload && (
            <button
              onClick={onOpenDownload}
              title={language === 'hi' ? 'APK एवं सोर्स कोड डाउनलोड' : 'Download APK & Source ZIP'}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all border border-emerald-200"
            >
              <span className="hidden sm:inline">📱 APK</span>
              <span>{language === 'hi' ? 'डाउनलोड' : 'ZIP'}</span>
            </button>
          )}

          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all border border-blue-200/60"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'hi' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Search shortcut on mobile */}
          <button
            onClick={() => setCurrentTab('search')}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications shortcut */}
          <button
            onClick={() => {
              if (!user) {
                setAuthModalOpen(true);
              } else {
                setCurrentTab('notifications');
              }
            }}
            className="relative p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User profile or Login */}
          {user ? (
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/60"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500"
              />
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                {user.name}
              </span>
              {user.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लॉग इन' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
