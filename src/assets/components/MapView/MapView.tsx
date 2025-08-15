import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🔧 Іконка маркера (Leaflet fix)
delete (L.Icon.Default.prototype as any)._getIconUrl;
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
}

const MapView: React.FC = () => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<LocationData[]>([]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    const updateLocation = () => {
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

                const addr = await reverseGeocode(latitude, longitude);
                setAddress(addr);

                const timestamp = new Date().toLocaleTimeString();

                const newEntry: LocationData = {
                    coords,
                    accuracy,
                    address: addr,
                    timestamp,
                };

                setHistory((prev) => [newEntry, ...prev.slice(0, 9)]); // зберігати лише 10 останніх
            },
            (err) => {
                setError('Не вдалося отримати локацію: ' + err.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // 🔁 Автооновлення кожні 10 сек
    useEffect(() => {
        updateLocation(); // Перше оновлення

        // intervalRef.current = setInterval(() => {
        //     updateLocation();
        // }, 10000);

        // return () => {
        //     if (intervalRef.current) {
        //         clearInterval(intervalRef.current);
        //     }
        // };
    }, []);

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Карта місцезнаходження</h2>

            <button onClick={updateLocation} style={{ marginBottom: '10px' }}>
                🔄 Оновити локацію вручну
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
                {position ? (
                    <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> учасники'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                Ви тут 📍<br />
                                Точність: {accuracy?.toFixed(0)} м<br />
                                {address && (
                                    <>
                                        <strong>Адреса:</strong><br />
                                        {address}
                                    </>
                                )}
                            </Popup>
                        </Marker>
                        {accuracy && (
                            <Circle
                                center={position}
                                radius={accuracy}
                                pathOptions={{ color: 'blue', fillOpacity: 0.2 }}
                            />
                        )}
                    </MapContainer>
                ) : (
                    <p>Завантаження мапи...</p>
                )}
            </div>

            {/* <h3>📍 Історія останніх локацій:</h3>
            {history.length > 0 ? (
                <ul style={{ paddingLeft: '20px' }}>
                    {history.map((item, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <strong>{item.timestamp}</strong> — {item.coords[0].toFixed(5)}, {item.coords[1].toFixed(5)}<br />
                            {item.address && <em>{item.address}</em>}<br />
                            Точність: {item.accuracy.toFixed(0)} м
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Ще немає збережених точок.</p>
            )} */}
        </div>
    );
};

export default MapView;
