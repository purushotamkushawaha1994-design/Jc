export type Language = 'hi' | 'en';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  location?: string;
  website?: string;
  preferredLanguage: Language;
  joinedAt: string;
  verified: boolean;
  followers: string[];
  following: string[];
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
  isSelf?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  language: 'hi' | 'en' | 'hinglish';
  translatedContent?: {
    hi?: string;
    en?: string;
  };
  image?: string;
  location?: string;
  tags: string[];
  likes: string[];
  likeCount: number;
  isLiked?: boolean;
  commentCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  createdAt: string;
  likes: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  actorId: string;
  actor?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  type: 'like' | 'comment' | 'follow' | 'mention';
  postId?: string;
  content?: string;
  read: boolean;
  createdAt: string;
}

export interface BackendStatus {
  status: string;
  version: string;
  timestamp: string;
  database: {
    provider: string;
    storageFile: string;
    activeUsers: number;
    activePosts: number;
    activeComments: number;
    status: string;
  };
  authentication: {
    mode: string;
    features: string[];
    status: string;
  };
  services: {
    smsGateway: {
      status: string;
      provider: string;
      note: string;
      configured: boolean;
    };
    aiTranslation: {
      status: string;
      provider: string;
      configured: boolean;
      note: string;
    };
    mediaStorage: {
      status: string;
      provider: string;
      configured: boolean;
    };
  };
}

export type ScreenTab = 'home' | 'search' | 'notifications' | 'profile' | 'settings';
