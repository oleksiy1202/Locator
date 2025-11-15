import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InstallPWA.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Перевірка, чи додаток вже встановлено
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Слухач події beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Слухач успішного встановлення
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA встановлено успішно!');
      setShowInstallButton(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Показати промпт встановлення
    deferredPrompt.prompt();

    // Дочекатися відповіді користувача
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ Користувач прийняв встановлення');
    } else {
      console.log('❌ Користувач відхилив встановлення');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Зберегти в localStorage, що користувач відхилив
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Не показувати, якщо вже встановлено або користувач відхилив
  if (isInstalled || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallButton && (
        <motion.div
          className="install-pwa-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        >
          <div className="install-pwa-content">
            <div className="install-pwa-icon">📱</div>
            <div className="install-pwa-text">
              <strong>Встановити додаток</strong>
              <p>Встановіть Location Test на ваш пристрій для швидкого доступу!</p>
            </div>
            <div className="install-pwa-actions">
              <button className="install-pwa-button" onClick={handleInstallClick}>
                Встановити
              </button>
              <button className="install-pwa-dismiss" onClick={handleDismiss}>
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPWA;

