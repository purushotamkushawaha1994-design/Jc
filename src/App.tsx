import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { DesktopSidebar } from './components/DesktopSidebar.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CreatePostModal } from './components/CreatePostModal.tsx';
import { DownloadApkModal } from './components/DownloadApkModal.tsx';
import { HomeFeed } from './screens/HomeFeed.tsx';
import { SearchExploreScreen } from './screens/SearchExploreScreen.tsx';
import { NotificationsScreen } from './screens/NotificationsScreen.tsx';
import { ProfileScreen } from './screens/ProfileScreen.tsx';
import { SettingsScreen } from './screens/SettingsScreen.tsx';
import { ScreenTab, Post } from './types/index.ts';

const MainApp: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, token } = useAuth();

  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [activeProfileUsername, setActiveProfileUsername] = useState<string | null>(null);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll or fetch unread notifications count
  const fetchUnreadCount = useCallback(async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const unread = (data.notifications || []).filter((n: { read: boolean }) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 20000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Navigate to user profile
  const handleUserClick = (username: string) => {
    setActiveProfileUsername(username);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to tag filter
  const handleTagClick = (tag: string) => {
    setActiveTagFilter(tag.replace(/^#/, ''));
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ScreenTab) => {
    if (tab === 'profile') {
      // If clicking own profile tab directly, reset specific target username
      setActiveProfileUsername(null);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostCreated = (_post: Post) => {
    // If on home, it will reflect on next feed cycle or we can switch to home
    setCurrentTab('home');
    setActiveTagFilter(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        unreadCount={unreadCount}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
      />

      {/* Main Responsive Layout */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 py-4 md:py-6 flex gap-6">
        {/* Left Desktop Sidebar */}
        <DesktopSidebar
          currentTab={currentTab}
          setCurrentTab={handleTabChange}
          openCreateModal={() => setIsCreateModalOpen(true)}
          unreadCount={unreadCount}
          onOpenDownload={() => setIsDownloadModalOpen(true)}
        />

        {/* Center Main Content View */}
        <main className="flex-1 max-w-2xl mx-auto w-full pb-20 md:pb-8 min-w-0">
          {currentTab === 'home' && (
            <HomeFeed
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onUserClick={handleUserClick}
              onTagClick={handleTagClick}
              activeTagFilter={activeTagFilter}
              onClearTagFilter={() => setActiveTagFilter(null)}
            />
          )}

          {currentTab === 'search' && (
            <SearchExploreScreen
              onUserClick={handleUserClick}
              onTagClick={handleTagClick}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsScreen
              onUserClick={handleUserClick}
              onRefreshUnread={fetchUnreadCount}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              username={activeProfileUsername}
              onBack={activeProfileUsername ? () => setActiveProfileUsername(null) : undefined}
              onTagClick={handleTagClick}
              onUserClick={handleUserClick}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen onOpenDownload={() => setIsDownloadModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Mobile-First Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        openCreateModal={() => setIsCreateModalOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <DownloadApkModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
