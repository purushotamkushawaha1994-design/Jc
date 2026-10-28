import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  X, 
  Phone, 
  Mail, 
  UserPlus, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  Info
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { 
    login, 
    register, 
    requestOtp, 
    verifyOtp, 
    quickDemoLogin 
  } = useAuth();

  const [authMode, setAuthMode] = useState<'otp' | 'password' | 'register'>('otp');

  // Mobile OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpNotice, setDevOtpNotice] = useState<string | null>(null);

  // Email/Password login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLang, setRegLang] = useState<'hi' | 'en'>(language === 'hi' ? 'hi' : 'en');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया मोबाइल नंबर दर्ज करें।' : 'Please enter your mobile number.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await requestOtp(phoneNumber);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      if (res.devCode) {
        setDevOtpNotice(
          language === 'hi'
            ? `परीक्षण मोड: सर्वर द्वारा सत्यापित कोड "${res.devCode}" है। लाइव एसएमएस के लिए सर्वर पर्यावरण में गेटवे कनेक्ट करें।`
            : `Dev Mode: Server-generated OTP code is "${res.devCode}". For live SMS, configure carrier gateway in server .env.`
        );
        // Pre-fill for convenience
        setOtpCode(res.devCode);
      }
    } else {
      setErrorMessage(res.error || 'Failed to request OTP');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया 6-अंकों का ओटीपी दर्ज करें।' : 'Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await verifyOtp(phoneNumber, otpCode);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid OTP code');
    }
  };

  // Handle Email / Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया सभी विवरण दर्ज करें।' : 'Please fill all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Authentication failed');
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regEmailOrPhone.trim() || !regPassword.trim()) {
      setErrorMessage(language === 'hi' ? 'सभी फ़ील्ड भरना अनिवार्य है।' : 'All fields are required.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await register({
      name: regName,
      username: regUsername,
      emailOrPhone: regEmailOrPhone,
      password: regPassword,
      language: regLang,
    });
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  // Quick Demo Account Click
  const handleDemoLogin = async (username: string) => {
    setLoading(true);
    setErrorMessage(null);
    const res = await quickDemoLogin(username);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to sign in to demo account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-b from-blue-50/70 to-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-md shadow-blue-500/20">
              JC
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {t('appName')}
              </h2>
              <span className="text-xs text-slate-600">
                {t('tagline')}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200/80 bg-slate-50/80 p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'otp'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t('tabMobileOtp')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'password'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t('tabEmailPassword')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('tabRegister')}</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: MOBILE OTP FLOW */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('mobileNumberLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 text-xs font-semibold">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-16 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{t('sendOtpBtn')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  {devOtpNotice && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{devOtpNotice}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('enterOtpLabel')}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-widest text-lg font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="py-2.5 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      {language === 'hi' ? 'नंबर बदलें' : 'Change Number'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>{t('verifyAndLogin')}</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL / PASSWORD LOGIN */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('emailOrUserLabel')}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t('emailOrUserPlaceholder')}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('passwordLabel')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{t('loginBtn')}</span>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW ACCOUNT */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullNameLabel')}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  यूज़रनेम (Username)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">@</span>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder={t('usernamePlaceholder')}
                    className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ईमेल या मोबाइल नंबर (Email or Phone)
                </label>
                <input
                  type="text"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  placeholder="amit@example.com या +919876543210"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पासवर्ड (Password)
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="न्यूनतम 6 अक्षर"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('preferredLangLabel')}
                </label>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="regLang"
                      checked={regLang === 'hi'}
                      onChange={() => setRegLang('hi')}
                      className="text-blue-600"
                    />
                    <span>हिंदी (Hindi)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="regLang"
                      checked={regLang === 'en'}
                      onChange={() => setRegLang('en')}
                      className="text-blue-600"
                    />
                    <span>English</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{t('registerBtn')}</span>
                )}
              </button>
            </form>
          )}

          {/* ONE-CLICK INSTANT DEMO ACCOUNTS */}
          <div className="pt-4 mt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('quickDemoAccounts')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('vikram_patil')}
                className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                  Vikram Patil
                </div>
                <div className="text-[10px] text-slate-500 truncate">AgriTech / पुणे</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('priya_k')}
                className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                  Priya Kushwaha
                </div>
                <div className="text-[10px] text-slate-500 truncate">Education / लखनऊ</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('jantanews')}
                className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate flex items-center gap-1">
                  <span>Janta News</span>
                  <ShieldCheck className="w-3 h-3 text-blue-600 inline" />
                </div>
                <div className="text-[10px] text-slate-500 truncate">Official / नई दिल्ली</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('dr_sunita')}
                className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                  Dr. Sunita Patel
                </div>
                <div className="text-[10px] text-slate-500 truncate">Health / अहमदाबाद</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
