import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  salt: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  location?: string;
  website?: string;
  preferredLanguage: 'hi' | 'en';
  joinedAt: string;
  verified: boolean;
  followers: string[];
  following: string[];
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  language: 'hi' | 'en' | 'hinglish';
  translatedContent?: { hi?: string; en?: string };
  image?: string;
  location?: string;
  tags: string[];
  likes: string[];
  commentCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  actorId: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  postId?: string;
  content?: string;
  read: boolean;
  createdAt: string;
}

export interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: number;
}

export interface DatabaseSchema {
  users: User[];
  posts: Post[];
  comments: Comment[];
  notifications: NotificationItem[];
  sessions: { token: string; userId: string; createdAt: string }[];
  otpRequests: OtpRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'janta_connect.json');

// Password security helpers using native crypto PBKDF2
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Initial seed data with authentic Hindi & English content
function getInitialData(): DatabaseSchema {
  const pass1 = hashPassword('Janta@2026');
  const pass2 = hashPassword('Janta@2026');
  const pass3 = hashPassword('Janta@2026');
  const pass4 = hashPassword('Janta@2026');
  const pass5 = hashPassword('Janta@2026');

  const users: User[] = [
    {
      id: 'usr_jantanews',
      name: 'जनता लाइव न्यूज़ (Janta News)',
      username: 'jantanews',
      email: 'news@jantaconnect.in',
      phone: '+919876543210',
      passwordHash: pass1.hash,
      salt: pass1.salt,
      bio: 'सच्ची और निष्पक्ष खबरें, सीधे जनता तक। Official news & community alerts across India.',
      avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80',
      location: 'New Delhi / नई दिल्ली',
      website: 'https://jantaconnect.in',
      preferredLanguage: 'hi',
      joinedAt: '2026-01-10T10:00:00Z',
      verified: true,
      followers: ['usr_vikram', 'usr_sunita', 'usr_aarav', 'usr_priya'],
      following: ['usr_vikram', 'usr_sunita'],
    },
    {
      id: 'usr_vikram',
      name: 'Vikram Patil',
      username: 'vikram_patil',
      email: 'vikram@agritech.org',
      phone: '+919811122233',
      passwordHash: pass2.hash,
      salt: pass2.salt,
      bio: 'Rural tech innovator | Building sustainable agritech for grassroots farmers 🌱🇮🇳',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      location: 'Pune / पुणे, Maharashtra',
      website: 'https://krishitech.in',
      preferredLanguage: 'en',
      joinedAt: '2026-01-15T12:00:00Z',
      verified: true,
      followers: ['usr_jantanews', 'usr_aarav', 'usr_priya'],
      following: ['usr_jantanews', 'usr_priya'],
    },
    {
      id: 'usr_sunita',
      name: 'डॉ. सुनीता पटेल (Dr. Sunita)',
      username: 'dr_sunita',
      email: 'sunita.patel@health.in',
      phone: '+919822233344',
      passwordHash: pass3.hash,
      salt: pass3.salt,
      bio: 'सामुदायिक स्वास्थ्य विशेषज्ञ एवं सामाजिक कार्यकर्ता। Dedicated to rural healthcare & wellness for all.',
      avatar: 'https://images.unsplash.com/photo-1594824813637-43c2295550a2?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
      location: 'Ahmedabad / अहमदाबाद',
      preferredLanguage: 'hi',
      joinedAt: '2026-01-20T08:30:00Z',
      verified: true,
      followers: ['usr_jantanews', 'usr_vikram'],
      following: ['usr_jantanews', 'usr_vikram', 'usr_aarav'],
    },
    {
      id: 'usr_aarav',
      name: 'आरव शर्मा (Aarav Sharma)',
      username: 'aarav_sharma',
      email: 'aarav@creative.in',
      phone: '+919833344455',
      passwordHash: pass4.hash,
      salt: pass4.salt,
      bio: 'Documenting the colors and spirit of India 📸 भारतीय संस्कृति और धरोहर की कहानियां।',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
      location: 'Varanasi / वाराणसी, UP',
      preferredLanguage: 'hi',
      joinedAt: '2026-02-01T14:15:00Z',
      verified: false,
      followers: ['usr_jantanews', 'usr_sunita'],
      following: ['usr_jantanews', 'usr_priya'],
    },
    {
      id: 'usr_priya',
      name: 'Priya Kushwaha',
      username: 'priya_k',
      email: 'priya@youthconnect.org',
      phone: '+919844455566',
      passwordHash: pass5.hash,
      salt: pass5.salt,
      bio: 'Youth development advocate & digital educator. Bridging the rural-urban education divide. 📚🇮🇳',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
      location: 'Lucknow / लखनऊ',
      website: 'https://youthindia.org',
      preferredLanguage: 'en',
      joinedAt: '2026-02-05T09:00:00Z',
      verified: true,
      followers: ['usr_jantanews', 'usr_vikram', 'usr_aarav'],
      following: ['usr_jantanews', 'usr_vikram'],
    },
  ];

  const posts: Post[] = [
    {
      id: 'post_1',
      authorId: 'usr_vikram',
      content: 'डिजिटल भारत अब सिर्फ बड़े शहरों तक सीमित नहीं है। हमारे गाँव के किसान अब मौसम का पूर्वानुमान और मंडी के ताज़ा भाव सीधे अपने मोबाइल पर देख रहे हैं। यह आत्मनिर्भर भारत की सच्ची तस्वीर है! 🌾🇮🇳\n\nDigital India is truly empowering rural farmers with real-time crop pricing and weather alerts.',
      language: 'hi',
      translatedContent: {
        en: 'Digital India is no longer limited to big cities. Farmers in our villages are now tracking weather forecasts and market prices directly on their mobile phones. This is the true picture of self-reliant India! 🌾🇮🇳',
        hi: 'डिजिटल भारत अब सिर्फ बड़े शहरों तक सीमित नहीं है। हमारे गाँव के किसान अब मौसम का पूर्वानुमान और मंडी के ताज़ा भाव सीधे अपने मोबाइल पर देख रहे हैं।',
      },
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
      location: 'Nashik, Maharashtra / नासिक',
      tags: ['DigitalIndia', 'किसान_कल्याण', 'VocalForLocal', 'AgriTech'],
      likes: ['usr_jantanews', 'usr_sunita', 'usr_aarav', 'usr_priya'],
      commentCount: 3,
      sharesCount: 12,
      createdAt: '2026-10-27T18:30:00Z',
    },
    {
      id: 'post_2',
      authorId: 'usr_jantanews',
      content: 'नमस्ते दोस्तों! जनता कनेक्ट (Janta Connect) पर आप सभी का हार्दिक स्वागत है। 💙\n\nअपनी आवाज़, अपने विचार और अपनी मातृभाषा में निर्भीक होकर जुड़ने का एक नया आधुनिक मंच। देश के हर कोने से अपनी संस्कृति और मुद्दों को यहाँ साझा करें। आप किस शहर या गाँव से जुड़े हैं? नीचे कमेंट करें!',
      language: 'hi',
      translatedContent: {
        en: 'Hello friends! A warm welcome to all of you on Janta Connect. 💙 A clean, modern platform to connect and share your voice in your mother tongue without hesitation. Which city or village are you joining from? Tell us in the comments!',
        hi: 'नमस्ते दोस्तों! जनता कनेक्ट (Janta Connect) पर आप सभी का हार्दिक स्वागत है। 💙',
      },
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
      location: 'New Delhi / नई दिल्ली',
      tags: ['JantaConnect', 'जनता_कनेक्ट', 'Bharat', 'Welcome'],
      likes: ['usr_vikram', 'usr_aarav', 'usr_priya'],
      commentCount: 5,
      sharesCount: 28,
      createdAt: '2026-10-27T16:00:00Z',
    },
    {
      id: 'post_3',
      authorId: 'usr_priya',
      content: 'Thrilled to announce that our community digital learning center in Lucknow just reached 500 active students this month! Providing high-speed internet, bilingual coding modules in Hindi & English, and STEM kits to underprivileged girls. Education changes everything. ✨📚',
      language: 'en',
      translatedContent: {
        hi: 'यह साझा करते हुए अत्यंत गर्व हो रहा है कि लखनऊ में हमारे सामुदायिक डिजिटल लर्निंग सेंटर में इस महीने 500 से अधिक छात्राएं जुड़ीं! हिंदी और अंग्रेजी में कोडिंग और स्टेम शिक्षा का प्रसार। शिक्षा से ही समाज बदलता है। ✨📚',
        en: 'Thrilled to announce that our community digital learning center in Lucknow just reached 500 active students this month!',
      },
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      location: 'Lucknow, Uttar Pradesh',
      tags: ['EducationForAll', 'WomenInTech', 'DigitalIndia', 'YouthPower'],
      likes: ['usr_vikram', 'usr_sunita', 'usr_jantanews'],
      commentCount: 2,
      sharesCount: 9,
      createdAt: '2026-10-27T14:15:00Z',
    },
    {
      id: 'post_4',
      authorId: 'usr_aarav',
      content: 'आज सुबह अस्सी घाट, वाराणसी का शांत और दिव्य दृश्य। गंगा आरती के बाद की यह शांति मन को एक अनूठी ऊर्जा देती है। हमारी विरासत ही हमारी सबसे बड़ी शक्ति है। 🌅🪔\n\nMorning bliss at Assi Ghat, Varanasi.',
      language: 'hi',
      translatedContent: {
        en: 'Serene morning atmosphere at Assi Ghat, Varanasi. The tranquil air after the dawn chants fills the soul with timeless peace. Our heritage is our greatest treasure. 🌅🪔',
        hi: 'आज सुबह अस्सी घाट, वाराणसी का शांत और दिव्य दृश्य। गंगा आरती के बाद की यह शांति मन को एक अनूठी ऊर्जा देती है।',
      },
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
      location: 'Varanasi Ghats, Uttar Pradesh',
      tags: ['Varanasi', 'IncredibleIndia', 'काशी', 'Heritage'],
      likes: ['usr_priya', 'usr_jantanews', 'usr_vikram'],
      commentCount: 1,
      sharesCount: 15,
      createdAt: '2026-10-27T11:00:00Z',
    },
    {
      id: 'post_5',
      authorId: 'usr_sunita',
      content: 'मौसमी बदलाव के दौरान स्वच्छता और संतुलित आहार का विशेष ध्यान रखें। स्थानीय फल जैसे आंवला, पपीता और गर्म पानी का सेवन इम्युनिटी को मजबूत बनाता है। गाँव में स्वास्थ्य शिविर आज शाम 4 बजे। 🩺🥦\n\nPublic health tip: Boost natural immunity with seasonal fruits and clean boiled drinking water during season shifts.',
      language: 'hi',
      translatedContent: {
        en: 'Take special care of hygiene and balanced nutrition during seasonal transitions. Local fruits like amla, papaya and warm boiled water reinforce natural immunity. Free community health camp today at 4 PM. 🩺🥦',
        hi: 'मौसमी बदलाव के दौरान स्वच्छता और संतुलित आहार का विशेष ध्यान रखें।',
      },
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
      location: 'Ahmedabad / अहमदाबाद, Gujarat',
      tags: ['HealthTips', 'स्वास्थ्य_सलाह', 'SwachhBharat', 'Wellness'],
      likes: ['usr_vikram', 'usr_priya'],
      commentCount: 1,
      sharesCount: 6,
      createdAt: '2026-10-27T09:45:00Z',
    },
  ];

  const comments: Comment[] = [
    {
      id: 'comm_1',
      postId: 'post_1',
      authorId: 'usr_sunita',
      content: 'बहुत ही सराहनीय प्रयास विक्रम जी! तकनीक का सही उपयोग गाँव के विकास में ही है।',
      createdAt: '2026-10-27T18:45:00Z',
      likes: ['usr_vikram'],
    },
    {
      id: 'comm_2',
      postId: 'post_1',
      authorId: 'usr_priya',
      content: 'Spot on! Real-time agri data is game-changing for rural families.',
      createdAt: '2026-10-27T19:10:00Z',
      likes: [],
    },
    {
      id: 'comm_3',
      postId: 'post_2',
      authorId: 'usr_vikram',
      content: 'पुणे, महाराष्ट्र से जुड़कर बेहद खुशी हुई! Janta Connect का ब्लू और व्हाइट लुक बहुत साफ और शानदार है। 👏',
      createdAt: '2026-10-27T16:20:00Z',
      likes: ['usr_jantanews'],
    },
    {
      id: 'comm_4',
      postId: 'post_2',
      authorId: 'usr_aarav',
      content: 'वाराणसी की पवित्र नगरी से सादर प्रणाम! Congratulations on this wonderful bilingual app.',
      createdAt: '2026-10-27T16:45:00Z',
      likes: ['usr_jantanews'],
    },
    {
      id: 'comm_5',
      postId: 'post_3',
      authorId: 'usr_vikram',
      content: 'Incredible initiative Priya! Let us know if you need any hardware or internet connectivity support.',
      createdAt: '2026-10-27T14:35:00Z',
      likes: ['usr_priya'],
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      userId: 'usr_vikram',
      actorId: 'usr_sunita',
      type: 'like',
      postId: 'post_1',
      read: false,
      createdAt: '2026-10-27T18:40:00Z',
    },
    {
      id: 'notif_2',
      userId: 'usr_vikram',
      actorId: 'usr_priya',
      type: 'comment',
      postId: 'post_1',
      content: 'Spot on! Real-time agri data is game-changing for rural families.',
      read: false,
      createdAt: '2026-10-27T19:10:00Z',
    },
    {
      id: 'notif_3',
      userId: 'usr_vikram',
      actorId: 'usr_aarav',
      type: 'follow',
      read: true,
      createdAt: '2026-10-27T15:00:00Z',
    },
  ];

  return {
    users,
    posts,
    comments,
    notifications,
    sessions: [],
    otpRequests: [
      // Preset test OTP record for seamless testing
      {
        phone: '+919876543210',
        code: '123456',
        expiresAt: Date.now() + 36000000,
      },
    ],
  };
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading database file, initializing fresh:', err);
    }
    const initial = getInitialData();
    this.save(initial);
    return initial;
  }

  private save(dataToSave: DatabaseSchema = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public commit() {
    this.save(this.data);
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByUsername(username: string): User | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public findUserByEmailOrPhone(identifier: string): User | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === clean) ||
        (u.phone && u.phone.replace(/[\s-]/g, '') === clean.replace(/[\s-]/g, '')) ||
        u.username.toLowerCase() === clean
    );
  }

  public createSession(userId: string): string {
    const token = generateToken();
    this.data.sessions.push({
      token,
      userId,
      createdAt: new Date().toISOString(),
    });
    this.commit();
    return token;
  }

  public getUserByToken(token: string): User | undefined {
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    return this.findUserById(session.userId);
  }

  public removeSession(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.commit();
  }
}

export const dbStore = new Store();
