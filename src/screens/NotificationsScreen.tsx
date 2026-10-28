import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { NotificationItem } from '../types/index.ts';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  CheckCheck, 
  Loader2 
} from 'lucide-react';

interface NotificationsScreenProps {
  onUserClick: (username: string) => void;
  onRefreshUnread: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onUserClick,
  onRefreshUnread,
}) => {
  const { t, language } = useLanguage();
  const { user, token } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleMarkAllRead = async () => {
    // Mark locally
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onRefreshUnread();

    // Mark on server
    for (const notif of notifications.filter((n) => !n.read)) {
      try {
        await fetch(`/api/notifications/${notif.id}/read`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 1) return language === 'hi' ? 'अभी' : 'just now';
      if (diffMins < 60) return `${diffMins}m`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    } catch {
      return '';
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const getActionText = (item: NotificationItem) => {
    switch (item.type) {
      case 'like':
        return t('notifLiked');
      case 'comment':
        return t('notifCommented');
      case 'follow':
        return t('notifFollowed');
      default:
        return 'interacted with you';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <h1 className="text-base font-bold text-slate-900">
            {t('notificationsTitle')}
          </h1>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t('markAllRead')}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-xs">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            {t('noNotifications')}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => item.actor?.username && onUserClick(item.actor.username)}
              className={`p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                !item.read ? 'bg-blue-50/40' : ''
              }`}
            >
              {/* Actor avatar with badge */}
              <div className="relative shrink-0">
                <img
                  src={item.actor?.avatar || 'https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                  {renderIcon(item.type)}
                </div>
              </div>

              {/* Notification text */}
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-slate-800 leading-snug">
                  <span className="font-bold text-slate-900">
                    {item.actor?.name || 'नागरिक (Citizen)'}
                  </span>{' '}
                  <span className="text-slate-600">{getActionText(item)}</span>
                </div>

                {item.content && (
                  <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                    "{item.content}"
                  </p>
                )}

                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatTime(item.createdAt)}
                </span>
              </div>

              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
