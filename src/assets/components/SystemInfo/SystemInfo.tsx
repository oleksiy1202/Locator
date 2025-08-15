import React, { useEffect, useState } from 'react';
import './SystemInfo.css';

interface BatteryInfo {
    level: number;
    charging: boolean;
}

const SystemInfo: React.FC = () => {
    const [deviceType, setDeviceType] = useState('невідомо');
    const [os, setOS] = useState('невідомо');
    const [browser, setBrowser] = useState('невідомо');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [language] = useState(navigator.language);
    const [timezone, setTimezone] = useState('');
    const [localTime, setLocalTime] = useState('');
    const [screenSize, setScreenSize] = useState(`${window.innerWidth}x${window.innerHeight}`);
    const [connectionType, setConnectionType] = useState('');
    const [battery, setBattery] = useState<BatteryInfo | null>(null);
    const [location, setLocation] = useState<string>('невідомо');

    useEffect(() => {
        const ua = navigator.userAgent;

        // Визначення типу пристрою
        if (/Mobi|Android/i.test(ua)) setDeviceType('мобільний');
        else if (/Tablet|iPad/i.test(ua)) setDeviceType('планшет');
        else setDeviceType('ПК');

        // Визначення ОС
        if (ua.includes('Windows')) setOS('Windows');
        else if (ua.includes('Mac')) setOS('macOS');
        else if (ua.includes('Android')) setOS('Android');
        else if (ua.includes('iPhone') || ua.includes('iPad')) setOS('iOS');

        // Визначення браузера
        if (ua.includes('Chrome')) setBrowser('Chrome');
        else if (ua.includes('Firefox')) setBrowser('Firefox');
        else if (ua.includes('Safari') && !ua.includes('Chrome')) setBrowser('Safari');
        else if (ua.includes('Edge')) setBrowser('Edge');

        // Час і часовий пояс
        setLocalTime(new Date().toLocaleTimeString());
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

        // Тип мережі
        const connection = (navigator as any).connection;
        if (connection?.effectiveType) setConnectionType(connection.effectiveType);

        // Батарея
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((bat: any) => {
                setBattery({ level: bat.level, charging: bat.charging });
            });
        }

        // Геолокація
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                },
                (error) => {
                    console.error('Помилка при отриманні геолокації:', error);
                    setLocation('відхилено або недоступно');
                }
            );
        } else {
            setLocation('не підтримується');
        }

        // Події
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        const handleResize = () => setScreenSize(`${window.innerWidth}x${window.innerHeight}`);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="system-info">
            <h3>ℹ️ Системна інформація</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li>📱 Пристрій: <strong>{deviceType}</strong></li>
                <li>💻 ОС: <strong>{os}</strong></li>
                <li>🌐 Браузер: <strong>{browser}</strong></li>
                <li>📶 Мережа: <strong>{isOnline ? 'онлайн' : 'офлайн'} {connectionType && `(${connectionType})`}</strong></li>
                <li>🌍 Мова: <strong>{language}</strong></li>
                <li>🕓 Часовий пояс: <strong>{timezone}</strong></li>
                <li>🕒 Час: <strong>{localTime}</strong></li>
                <li>🖥️ Роздільна здатність: <strong>{screenSize}</strong></li>
                <li>📍 Локація: <strong>{location}</strong></li>
                {battery && (
                    <li>🔋 Батарея: <strong>{Math.round(battery.level * 100)}% {battery.charging ? '(зарядка)' : ''}</strong></li>
                )}
            </ul>
        </div>
    );
};

export default SystemInfo;
