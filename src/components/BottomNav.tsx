import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ScreenTab } from '../types/index.ts';
import { Home, Compass, PlusCircle, Bell, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  currentTab: ScreenTab;
  setCurrentTab: (tab: ScreenTab) => void;
  openCreateModal: () => void;
  unreadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  openCreateModal,
  unreadCount,
}) => {
  const { t } = useLanguage();
  const { user, setAuthModalOpen } = useAuth();

  const handleCreateClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      openCreateModal();
    }
  };

  const handleTabClick = (tab: ScreenTab) => {
    if ((tab === 'profile' || tab === 'notifications') && !user) {
      setAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around h-14">
        {/* Home */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">{t('navHome')}</span>
        </button>

        {/* Explore / Search */}
        <button
          onClick={() => handleTabClick('search')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'search' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'search' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">{t('navExplore')}</span>
        </button>

        {/* Create Post Action Button */}
        <button
          onClick={handleCreateClick}
          aria-label="Create Post"
          className="flex flex-col items-center justify-center -mt-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:bg-blue-700 group-active:scale-95 transition-all">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] text-blue-700 font-bold mt-0.5">{t('navPost')}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => handleTabClick('notifications')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'notifications' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${currentTab === 'notifications' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t('navNotifications')}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {user ? (
            <img
              src={user.avatar}
              alt=""
              className={`w-5 h-5 rounded-full object-cover ${
                currentTab === 'profile' ? 'ring-2 ring-blue-600' : 'ring-1 ring-slate-300'
              }`}
            />
          ) : (
            <UserIcon className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          )}
          <span className="text-[10px] mt-0.5">{t('navProfile')}</span>
        </button>
      </div>
    </nav>
  );
};
