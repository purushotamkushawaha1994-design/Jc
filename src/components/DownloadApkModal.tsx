import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { 
  X, 
  Download, 
  Smartphone, 
  Terminal, 
  Github, 
  CheckCircle2, 
  Info, 
  FolderArchive, 
  Globe, 
  ExternalLink,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'download' | 'buildGuide' | 'specs'>('download');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {language === 'hi' ? 'Android APK एवं सोर्स कोड हब' : 'Android APK & Source Code Hub'}
              </h2>
              <span className="text-xs text-slate-500">
                com.jantaconnect.app · Janta Connect
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200/80 bg-slate-50 p-1 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'download'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'डाउनलोड फ़ाइलें' : 'Downloads'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('buildGuide')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'buildGuide'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'APK निर्माण गाइड' : 'Build APK Guide'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'specs'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'कॉन्फ़िगरेशन' : 'Specs & Config'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-xs sm:text-sm">
          {/* TAB 1: DOWNLOADS */}
          {activeTab === 'download' && (
            <div className="space-y-3.5">
              {/* Honest Status Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">
                    {language === 'hi'
                      ? 'वास्तविक व पारदर्शी स्थिति (100% Real Status):'
                      : 'Real & Transparent Status:'}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {language === 'hi'
                      ? 'Android Capacitor प्रोजेक्ट (com.jantaconnect.app), Gradle बिल्ड फाइल्स, और प्रोडक्शन वेब बंडल तैयार हैं। क्लाउड सर्वर पर Java/Android SDK नहीं होता, इसलिए संपूर्ण सोर्स ZIP डाउनलोड करके आप Android Studio या GitHub Actions से तुरंत APK बना सकते हैं।'
                      : 'The native Android Capacitor project, Gradle build files, and web production bundle are fully prepared. Download the complete Source ZIP to compile the APK in Android Studio or free GitHub Actions.'}
                  </p>
                </div>
              </div>

              {/* Download Option 1: Source Code ZIP */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {language === 'hi' ? 'संपूर्ण सोर्स कोड ZIP (Complete Source ZIP)' : 'Complete Source Code ZIP'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi'
                        ? 'इसमें React, Express, Android Capacitor प्रोजेक्ट और गाइड शामिल हैं (~510 KB)'
                        : 'Includes React frontend, Express backend, Android Gradle project (~510 KB)'}
                    </p>
                  </div>
                </div>

                <a
                  href="/api/download/source-zip"
                  download="janta-connect-source.zip"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'ZIP डाउनलोड' : 'Download ZIP'}</span>
                </a>
              </div>

              {/* Download Option 2: Web Production Build */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {language === 'hi' ? 'वेबसाइट प्रोडक्शन बिल्ड (Web Build)' : 'Web Production Build'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi'
                        ? 'कंपाइल किया गया बंडल (dist/ फ़ोल्डर) तैयार है, सीधे होस्टिंग के लिए।'
                        : 'Pre-compiled web assets in dist/ directory ready for hosting.'}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shrink-0">
                  {language === 'hi' ? 'बिल्ड तैयार' : 'Build Ready'}
                </span>
              </div>

              {/* Download Option 3: Mobile PWA Direct Install */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {language === 'hi' ? 'मोबाइल ब्राउज़र से तुरंत इंस्टॉल (Direct Install)' : 'Direct Mobile Installation'}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi'
                    ? 'Android फोन में Chrome ब्राउज़र में इस ऐप को खोलें और मेनू (तीन बिंदु) दबाकर "Install app" या "Add to Home screen" चुनें। यह बिना APK कंपाइल किए ऐप की तरह इंस्टॉल हो जाती है!'
                    : 'Open this app in Chrome on Android and tap menu (3 dots) -> "Install app" or "Add to Home screen". It installs directly as a standalone app on your device!'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BUILD APK GUIDE */}
          {activeTab === 'buildGuide' && (
            <div className="space-y-4">
              {/* Method A: Android Studio */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>विधि 1: Android Studio (सबसे सरल - 1 क्लिक)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    अनुशंसित
                  </span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600">
                  <li>डाउनलोड की गई ZIP को अपने कंप्यूटर पर Extract करें।</li>
                  <li>Android Studio खोलें और <b>"Open Project"</b> चुनकर अंदर के <code className="bg-white px-1 py-0.5 rounded border border-slate-200">android</code> फ़ोल्डर को खोलें।</li>
                  <li>ऊपर मेनू में जाएँ: <b>Build</b> &gt; <b>Build Bundle(s) / APK(s)</b> &gt; <b>Build APK(s)</b>।</li>
                  <li>APK इस स्थान पर बन जाएगा: <br/>
                    <code className="text-blue-700 bg-white p-1 rounded block mt-1 border border-slate-200 text-[11px] font-mono">
                      android/app/build/outputs/apk/debug/app-debug.apk
                    </code>
                  </li>
                </ol>
              </div>

              {/* Method B: Terminal Command */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-blue-600" />
                    <span>विधि 2: टर्मिनल / कमांड लाइन (CLI Build)</span>
                  </span>
                  <button
                    onClick={() => handleCopy('npm run build && npx cap sync android && cd android && ./gradlew assembleDebug', 'cli')}
                    className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    {copiedCode === 'cli' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'cli' ? 'कॉपी हो गया' : 'कमांड कॉपी करें'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
                  npm install<br/>
                  npm run build<br/>
                  npx cap sync android<br/>
                  cd android<br/>
                  ./gradlew assembleDebug
                </div>
              </div>

              {/* Method C: GitHub Actions Cloud Build */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-slate-800" />
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    विधि 3: मुफ़्त GitHub Actions क्लाउड बिल्ड
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  इस प्रोजेक्ट में <code className="bg-white px-1 py-0.5 rounded border border-slate-200">.github/workflows/build-apk.yml</code> पहले से शामिल है। बस कोड को GitHub पर पुश करें, Actions टैब में अपने आप APK बनकर तैयार हो जाएगी!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SPECS & CONFIG */}
          {activeTab === 'specs' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">ऐप नाम (App Name):</span>
                  <span className="font-bold text-slate-900">Janta Connect</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">पैकेज आईडी (Package Name):</span>
                  <span className="font-bold text-slate-900 font-mono text-[11px]">com.jantaconnect.app</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">संस्करण (Version):</span>
                  <span className="font-bold text-slate-900">1.0.0 (Code 1)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Android Engine:</span>
                  <span className="font-bold text-slate-900">Capacitor v7 Native</span>
                </div>
              </div>

              {/* Security info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs">सुरक्षा और API Key सुरक्षा:</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  इस ZIP में कोई भी निजी पासवर्ड, API Key या सीक्रेट्स नहीं डाले गए हैं। सभी डेटाबेस रिकॉर्ड्स लोकल एनवायरनमेंट में सुरक्षित रहते हैं।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <span className="text-[11px] text-slate-500">
            Janta Connect v1.0.0 · com.jantaconnect.app
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
