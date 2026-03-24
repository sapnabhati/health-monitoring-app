import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (!GOOGLE_CLIENT_ID) {
  console.warn('⚠️ Google Client ID not configured. Google Sign-In will not work. See .env.local file.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

// Register Service Worker for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/service-worker.ts', { scope: '/' })
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
  
  // Listen for controller change (new service worker available)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 New Service Worker activated');
  });
}

// Install app prompt for add to home screen
declare global {
  interface Window {
    deferredPrompt?: Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    };
  }
}

let deferredPrompt: Event | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  // Stash the event for later use
  deferredPrompt = e;
  console.log('💾 App installation prompt available');
});

// Expose install function globally for UI buttons
(window as any).installApp = async () => {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return;
  }

  // Show the install prompt
  const prompt = (deferredPrompt as any).prompt;
  const userChoice = (deferredPrompt as any).userChoice;
  
  if (prompt) {
    await prompt();
  }
  
  const { outcome } = await userChoice?.catch(() => ({ outcome: 'dismissed' })) || { outcome: 'dismissed' };
  
  if (outcome === 'accepted') {
    console.log('✅ App installed');
  }
  
  deferredPrompt = null;
};

window.addEventListener('appinstalled', () => {
  console.log('✅ AuraHealth app installed successfully');
  deferredPrompt = null;
});
