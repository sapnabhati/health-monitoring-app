# 🚀 AuraHealth - PWA App Setup Guide

## What's New - PWA Features

AuraHealth is now a **Progressive Web App (PWA)** with the following advanced features:

### ✨ Features Included

1. **Install as App** 📱
   - Install directly on home screen (iOS/Android/Desktop)
   - Standalone app experience (full screen, no browser UI)
   - Native-like app icon and splash screen

2. **Offline Support** 🔌
   - Works without internet connection
   - Service Worker caching strategy
   - Graceful degradation for API calls

3. **Background Sync** 🔄
   - Sync health data when connection restored
   - Auto-update support

4. **Responsive Design** 📐
   - Mobile-first design with safe area support
   - Notch/Dynamic Island support (iOS)
   - Optimized for all screen sizes

5. **Push Notifications** 🔔
   - Get wellness reminders (when enabled)
   - Health alerts and insights

## 🔧 Installation Steps

### Frontend Setup

```bash
cd "c:\Users\Sankarlal\Documents\health monitoring app"
npm install
npm run dev
```

Frontend runs on: `http://localhost:5177`

### Backend Setup

#### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### 3. Email Setup (Gmail)

If using Gmail for OTP emails:

1. Enable 2-factor authentication on your Gmail account
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Add App Password to `.env` file

#### 4. SMS Setup (Twilio)

If using SMS for OTP delivery:

1. Sign up at [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Buy a phone number
4. Add credentials to `.env` file

#### 5. Start Backend Server

```bash
python main.py
```

Backend runs on: `http://localhost:8000`

## 📱 Installation on Different Platforms

### Web Browser (Desktop)
1. Open `http://localhost:5177`
2. Look for "Install" button in the address bar or app menu
3. Click "Install" or "Add to Home Screen"

### Android
1. Open app in Chrome on Android
2. Tap menu (three dots) → "Install app" or "Add to Home Screen"
3. App appears on home screen

### iOS/iPadOS
1. Open app in Safari
2. Tap Share button → "Add to Home Screen"
3. Name your app and tap "Add"
4. App appears on home screen

### Windows/macOS
1. Open app in Chrome/Edge
2. Click install icon in address bar
3. Follow system prompts

## 🔐 OTP Authentication Flow

### Sign Up with Email OTP
1. Enter email and phone
2. Choose "Email OTP"
3. 6-digit code sent to email
4. Enter code to verify
5. Account created

### Sign Up with SMS OTP
1. Enter email and phone
2. Choose "SMS OTP"
3. 6-digit code sent via SMS
4. Enter code to verify
5. Account created

### Demo Account
- Email: `demo@aurahealth.com`
- Password: `demo123`

## 🗄️ API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email/phone
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/signup` - Complete signup

### Health
- `POST /api/predict/stress` - Predict stress level
- `POST /api/chat` - Chat with AI

### Example OTP Request
```bash
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"contact":"user@example.com","type":"email"}'
```

## 📊 Architecture

### Frontend Stack
- React 19 with TypeScript
- Vite (build tool)
- Framer Motion (animations)
- Recharts (analytics)
- Service Worker (offline support)

### Backend Stack
- FastAPI (Python)
- Uvicorn (ASGI server)
- SQLite (database - optional)
- Twilio (SMS)
- SMTP (Email)

## 🔒 Security Features

- End-to-end encrypted communications
- OTP-based 2FA
- Secure session tokens
- CORS protection
- Input validation
- Safe area support (notch/dynamic island)

## 🌐 PWA Manifest

The app includes:
- `manifest.json` - PWA metadata
- `service-worker.ts` - Offline caching
- Safe area viewport configuration
- App shortcuts for quick access
- Launch screen support

## 📦 Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

Build output in `dist/` folder

## 🐛 Troubleshooting

### Service Worker Not Installing
- Check browser console for errors
- Clear site data and reload
- Ensure manifest.json is accessible

### OTP Not Sending
- Check `.env` configuration
- Verify Gmail App Password (not regular password)
- Check Twilio account balance for SMS

### App Not Installing
- Use Chrome/Edge on Desktop
- Use Chrome on Android
- Use Safari on iOS
- Ensure HTTPS in production (HTTP for localhost only)

## 📚 Additional Resources

- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🎯 Next Steps

1. Configure email/SMS credentials
2. Test OTP flow locally
3. Test offline functionality
4. Install app on your device
5. Enable push notifications (optional)

---

**Made with ❤️ for your health and wellness**
