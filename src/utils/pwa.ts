// Реєстрація Service Worker
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('✅ Service Worker зареєстровано:', registration.scope);

      // Перевірка оновлень
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Доступне оновлення
              console.log('🔄 Доступне оновлення PWA');
              if (confirm('Доступна нова версія додатку. Оновити зараз?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('❌ Помилка реєстрації Service Worker:', error);
    }
  }
};

// Відписка від Service Worker
export const unregisterServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('❌ Service Worker відписано');
  }
};

