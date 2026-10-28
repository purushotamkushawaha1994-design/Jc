import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ScreenTab } from '../types/index.ts';
import { Home, Compass, Bell, User as UserIcon, Settings, PlusCircle, ShieldCheck, Activity } from 'lucide-react';

interface DesktopSidebarProps {
  currentTab: ScreenTab;
  setCurrentTab: (tab: ScreenTab) => void;
  openCreateModal: () => void;
  unreadCount: number;
  onOpenDownload?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  unreadCount,
  onOpenDownload,
}) => {
  const { t, language } = useLanguage();
  const { user, setAuthModalOpen } = useAuth();

  const navItems = [
    { id: 'home' as ScreenTab, label: t('navHome'), icon: Home },
    { id: 'search' as ScreenTab, label: t('navExplore'), icon: Compass },
    {
      id: 'notifications' as ScreenTab,
      label: t('navNotifications'),
      icon: Bell,
      badge: unreadCount,
    },
    { id: 'profile' as ScreenTab, label: t('navProfile'), icon: UserIcon },
    { id: 'settings' as ScreenTab, label: t('navSettings'), icon: Settings },
  ];

  const handleSelect = (tab: ScreenTab) => {
    if ((tab === 'profile' || tab === 'notifications') && !user) {
      setAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-20 h-[calc(100vh-6rem)] justify-between pb-6">
      <div className="space-y-4">
        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Create Post Button */}
        <button
          onClick={() => {
            if (!user) setAuthModalOpen(true);
            else openCreateModal();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t('createPostTitle')}</span>
        </button>

        {/* Backend & Diagnostics quick banner */}
        <div 
          onClick={() => setCurrentTab('settings')}
          className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/70 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'hi' ? 'लाइव सर्वर व डेटाबेस' : 'Live Server & Database'}</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
            {language === 'hi' 
              ? 'डेटा सुरक्षित रूप से लोकल डिस्क व सर्वर में संग्रहित हो रहा है।' 
              : 'All posts, accounts & interactions are stored directly on the server.'}
          </p>
        </div>

        {/* Download APK & Source ZIP tile */}
        {onOpenDownload && (
          <button
            onClick={onOpenDownload}
            className="w-full p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-xl text-left hover:bg-emerald-100/80 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <span>📱 Android APK & ZIP</span>
              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">508 KB</span>
            </div>
            <p className="text-[11px] text-emerald-800/90 mt-1">
              {language === 'hi' ? 'सोर्स कोड ZIP व निर्माण निर्देश' : 'Download ZIP & Build APK'}
            </p>
          </button>
        )}
      </div>

      {/* User profile bottom tile */}
      {user ? (
        <div 
          onClick={() => setCurrentTab('profile')}
          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 transition-colors cursor-pointer shadow-xs"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
              {user.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
            </div>
            <span className="text-[11px] text-slate-600 truncate block">@{user.username}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white border border-blue-100 text-center shadow-xs">
          <p className="text-xs text-slate-600 mb-2">
            {language === 'hi' ? 'अपनी आवाज़ जोड़ने के लिए लॉग इन करें' : 'Sign in to share your thoughts'}
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
          >
            {t('loginBtn')}
          </button>
        </div>
      )}
    </aside>
  );
};
