import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import { useSettings } from '../../../context/SettingsContext';
import { saveHistory, loadHistory, clearHistory, exportToJSON, exportToCSV, shareLocation } from '../../../utils/storage';
import Statistics from '../../../components/Statistics/Statistics';

// 🔧 Виправлення іконки маркера Leaflet
interface IconDefault extends L.Icon.Default {
    _getIconUrl?: string;
}
delete (L.Icon.Default.prototype as IconDefault)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationData {
    coords: [number, number];
    accuracy: number;
    address: string | null;
    timestamp: string;
    fullDate: string;
}

// 🗺 Хук для плавного центровання карти
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lat, lng]);
    return null;
};

const MapView: React.FC = () => {
    const { settings } = useSettings();
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<LocationData[]>(() => loadHistory());
    const [loadingAddress, setLoadingAddress] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Зберігати історію в localStorage при змінах
    useEffect(() => {
        saveHistory(history);
    }, [history]);

    // Функція конвертації відстані
    const formatDistance = useCallback((meters: number): string => {
        if (settings.units === 'imperial') {
            const feet = meters * 3.28084;
            if (feet > 5280) {
                return `${(feet / 5280).toFixed(2)} mi`;
            }
            return `${feet.toFixed(0)} ft`;
        }
        if (meters > 1000) {
            return `${(meters / 1000).toFixed(2)} км`;
        }
        return `${meters.toFixed(0)} м`;
    }, [settings.units]);

    // 📦 Зворотне геокодування
    const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=uk`
            );
            const data = await response.json();
            return data.display_name || null;
        } catch (error) {
            console.error('Помилка при зворотному геокодуванні:', error);
            return null;
        }
    };

    // 📍 Отримати геолокацію
    const updateLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Ваш браузер не підтримує геолокацію');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                const coords: [number, number] = [latitude, longitude];

                setPosition(coords);
                setAccuracy(accuracy);
                setError(null);
                setLoadingAddress(true);

                const addr = await reverseGeocode(latitude, longitude);
                setAddress(addr);
                setLoadingAddress(false);

                const now = new Date();
                const timestamp = now.toLocaleTimeString();
                const fullDate = now.toLocaleDateString('uk-UA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });

                const newEntry: LocationData = {
                    coords,
                    accuracy,
                    address: addr,
                    timestamp,
                    fullDate,
                };

                setHistory((prev) => [newEntry, ...prev.slice(0, settings.historyLimit - 1)]); // Зберігати згідно налаштувань
            },
            (err) => {
                setError('Не вдалося отримати локацію: ' + err.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            }
        );
    }, [settings.historyLimit]);

    // 🔁 Автооновлення згідно налаштувань
    useEffect(() => {
        updateLocation(); // Перше оновлення

        // Очистка попереднього інтервалу
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Встановлення нового інтервалу, якщо автооновлення увімкнено
        if (settings.autoUpdate) {
            intervalRef.current = setInterval(() => {
                updateLocation();
            }, settings.updateInterval * 1000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [updateLocation, settings.autoUpdate, settings.updateInterval]);

    // Обробники кнопок
    const handleClearHistory = () => {
        if (window.confirm('Ви впевнені, що хочете очистити всю історію?')) {
            setHistory([]);
            clearHistory();
        }
    };

    const handleShare = () => {
        if (position && address) {
            shareLocation(position, address);
        } else if (position) {
            shareLocation(position, null);
        }
    };

    return (
        <div className="map-container">
            <div className="map-header">
                <h2>Карта місцезнаходження</h2>

                <div className="button-group">
                    <button onClick={updateLocation} className="refresh-button">
                        🔄 Оновити локацію
                    </button>
                    {position && (
                        <button onClick={handleShare} className="share-button">
                            📤 Поділитися
                        </button>
                    )}
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="map-wrapper">
                {position ? (
                    <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> учасники'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                Ви тут 📍<br />
                                Точність: {accuracy && formatDistance(accuracy)}<br />
                                {loadingAddress ? (
                                    <em>Завантаження адреси...</em>
                                ) : (
                                    address && (
                                        <>
                                            <strong>Адреса:</strong><br />
                                            {address}
                                        </>
                                    )
                                )}
                            </Popup>
                        </Marker>
                        {accuracy && settings.showAccuracyCircle && (
                            <Circle center={position} radius={accuracy} pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />
                        )}
                        <RecenterMap lat={position[0]} lng={position[1]} />
                    </MapContainer>
                ) : (
                    <p className="map-loading">Завантаження мапи...</p>
                )}
            </div>

            {/* Статистика */}
            {history.length > 0 && (
                <Statistics history={history} units={settings.units} />
            )}

            <div className="history-section">
                <div className="history-header">
                    <h3>📍 Історія локацій ({history.length})</h3>
                    {history.length > 0 && (
                        <div className="history-actions">
                            <button onClick={() => exportToJSON(history)} className="export-button">
                                💾 JSON
                            </button>
                            <button onClick={() => exportToCSV(history)} className="export-button">
                                📊 CSV
                            </button>
                            <button onClick={handleClearHistory} className="clear-button">
                                🗑️ Очистити
                            </button>
                        </div>
                    )}
                </div>
                
                {history.length > 0 ? (
                    <ul className="history-list">
                        {history.map((item, index) => (
                            <li key={index} className="history-item">
                                <div className="history-item-time">
                                    <strong>{item.timestamp}</strong>
                                    {item.fullDate && <span className="history-date">{item.fullDate}</span>}
                                </div>
                                <div className="history-item-coords">
                                    📌 {item.coords[0].toFixed(5)}, {item.coords[1].toFixed(5)}
                                </div>
                                {item.address && <div className="history-item-address">{item.address}</div>}
                                <div className="history-item-accuracy">
                                    🎯 Точність: {formatDistance(item.accuracy)}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-history">Ще немає збережених точок.</p>
                )}
            </div>
        </div>
    );
};

export default MapView;
