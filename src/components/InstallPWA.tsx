'use client';
import { useEffect, useState, useRef } from 'react';
import { IoDownloadOutline, IoClose } from 'react-icons/io5';
import { Viewport } from "next";
export const metadata = {
  title: "Class-Unity | Install PWA"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

interface NavigatorWithRelatedApps extends Navigator {
  getInstalledRelatedApps?: () => Promise<any[]>;
}

export default function InstallPWA() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    // Check if the browser is Firefox and exit early if it is
    const isFirefox = navigator.userAgent.includes('Firefox');
    if (isFirefox){ 
      setShowPrompt(false);
      return; 
    }

    // Check if enough time has passed since last prompt
    const lastPromptTime = localStorage.getItem('lastPWAPromptTime');
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    if (lastPromptTime && currentTime - parseInt(lastPromptTime) < oneHour) {
      setShowPrompt(false);
      return;
    }

    // Store the beforeinstallprompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    const checkInstalled = async () => {
      try {
        const nav = navigator as NavigatorWithRelatedApps;
        if (nav.getInstalledRelatedApps) {
          const relatedApps = await nav.getInstalledRelatedApps();
          setIsInstalled(relatedApps.length > 0);
        }
      } catch (error) {
        console.log('Error checking installation status:', error);
      }
    };

    // Show prompt after a delay if not already installed or in standalone mode
    const shouldShowPrompt = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isInstalled && !isStandalone) {
        setShowPrompt(true);
        localStorage.setItem('lastPWAPromptTime', currentTime.toString());
      }
    };

    checkInstalled();

    const timer = setTimeout(shouldShowPrompt, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (deferredPromptRef.current) {
      await deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstalled(true);
      }
      deferredPromptRef.current = null;
    }
  };

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl p-6 max-w-md border border-gray-200 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <IoDownloadOutline className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Install Class-Unity</h3>
            <p className="text-sm text-gray-600 mt-2">
              Install our app for a faster, enhanced experience with offline capabilities.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-500 transition-colors p-1"
          aria-label="Close"
        >
          <IoClose className="text-xl" />
        </button>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={handleInstall}
          className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Install Now
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
