# जनता कनेक्ट (Janta Connect) - Android APK निर्माण एवं परिनियोजन मार्गदर्शिका
# (Android APK Build & Deployment Guide)

यह दस्तावेज़ आपको Janta Connect (com.jantaconnect.app) के लिए Android APK तैयार करने और वेबसाइट प्रकाशित करने के सरल चरण प्रदान करता है।

---

## 1. परियोजना विवरण (Project Specifications)
- **ऐप का नाम (App Name)**: Janta Connect
- **पैकेज आईडी (Package Name)**: `com.jantaconnect.app`
- **वेब ढांचा (Web Framework)**: React 19 + Vite + Tailwind CSS + TypeScript
- **बैकएंड (Backend)**: Express Server + Persistent Atomic Storage
- **मोबाइल रैपर (Mobile Wrapper)**: Capacitor v7 Android Native Engine
- **भाषाएँ (Supported Languages)**: हिंदी (Hindi) एवं English

---

## 2. आपके कंप्यूटर पर APK बनाने के चरण (Local Machine APK Build)

### आवश्यकताएं (Prerequisites):
1. **Node.js**: v18 या v20/v22
2. **Java Development Kit (JDK)**: JDK 17 या 21
3. **Android Studio**: नवीनतम संस्करण (Ladybug / Iguana या उससे नया)

### विकल्प A: Android Studio द्वारा 1-क्लिक APK (अनुशंसित - सबसे आसान)
1. डाउनलोड की गई `janta-connect-source.zip` फाइल को अपने कंप्यूटर पर अनज़िप (Extract) करें।
2. टर्मिनल खोलें और प्रोजेक्ट फ़ोल्डर में जाएँ:
   ```bash
   npm install
   npm run build
   npx cap sync android
   ```
3. Android Studio खोलें और **"Open an Existing Project"** पर क्लिक करें।
4. प्रोजेक्ट के अंदर मौजूद `android` फ़ोल्डर को चुनें।
5. Gradle सिंक पूरा होने की प्रतीक्षा करें (1-2 मिनट)।
6. ऊपर मेनू बार में जाएँ:
   - **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**
7. निर्माण पूरा होते ही नीचे दाईं ओर **"locate"** का लिंक आएगा। उस पर क्लिक करें।
8. आपका इंस्टॉल करने योग्य APK यहाँ तैयार मिलेगा:
   `android/app/build/outputs/apk/debug/app-debug.apk`
9. इसे अपने Android फ़ोन में ट्रांसफर करें और इंस्टॉल करें!

---

### विकल्प B: कमांड लाइन / टर्मिनल द्वारा सीधे APK बनाना (Command Line Build)
यदि आपके पास Android SDK और Java पहले से सेट है:
```bash
# 1. वेब प्रोडक्शन बिल्ड बनाएँ
npm run build

# 2. Capacitor Android सिंक करें
npx cap sync android

# 3. Android फ़ोल्डर में जाएँ
cd android

# 4. APK संकलित (Compile) करें
./gradlew assembleDebug

# Windows उपयोगकर्ताओं के लिए:
# gradlew.bat assembleDebug
```
तैयार APK फाइल का स्थान:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 3. GitHub Actions द्वारा मुफ़्त क्लाउड में APK बनाना (Cloud 1-Click Build)
इस रिपॉजिटरी में `.github/workflows/build-apk.yml` फ़ाइल पहले से शामिल है।
1. इस कोड को अपने GitHub खाते में पुश करें (या नया रिपॉजिटरी बनाएँ)।
2. GitHub पर अपने रिपॉजिटरी के **Actions** टैब में जाएँ।
3. **"Build Janta Connect Android APK"** वर्कफ़्लो अपने आप चलेगा।
4. बिल्ड समाप्त होने पर **Artifacts** सेक्शन से सीधे `JantaConnect-Debug-APK.zip` डाउनलोड करें।
5. इसमें आपको तैयार `app-debug.apk` मिल जाएगा।

---

## 4. वेबसाइट को कैसे प्रकाशित करें (Web Deployment)

### विधि 1: Node.js / Cloud Run / VPS पर पूर्ण-स्टैक परिनियोजन (Full-Stack Deployment)
1. प्रोडक्शन बिल्ड तैयार करें:
   ```bash
   npm run build
   ```
2. सर्वर चलाएं:
   ```bash
   NODE_ENV=production npm start
   ```
3. सर्वर पोर्ट 3000 पर Express API और `dist/` के सभी स्थिर वेब पेजों को एक साथ होस्ट करता है।

### विधि 2: Vercel / Netlify / Cloudflare Pages (Frontend-Only Static)
यदि आप केवल फ्रंटेंड को होस्ट करना चाहते हैं:
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 5. सुरक्षा एवं बैकएंड कॉन्फ़िगरेशन सूचना (Security & Backend Notes)
- किसी भी निजी API कुंजी (API Keys) या सीक्रेट्स को सार्वजनिक फ़ाइलों में शामिल नहीं किया गया है।
- **डेटाबेस**: सर्वर पर `data/janta_connect.json` में सभी यूज़र और पोस्ट सुरक्षित रूप से सेव होते हैं।
- **एसएमएस ओटीपी (SMS OTP)**: विकास मोड में सर्वर-जनरेटेड कोड सीधे स्क्रीन पर दिखाई देता है। वास्तविक टेलीकॉम एसएमएस डिलीवरी के लिए पर्यावरण फ़ाइल (`.env`) में Twilio या MSG91 API कुंजियाँ जोड़ें।
