import React, { useEffect, useState } from 'react';

const Location: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Геолокація не підтримується вашим браузером');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => {
        setError('Не вдалося отримати локацію: ' + err.message);
      }
    );
  }, []);

  return (
    <div>
      {/* <h2>Поточна локація</h2> */}
      <h1>🛰️ Моя локація</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {latitude && longitude ? (
        <div>
          <p>Широта: {latitude}</p>
          <p>Довгота: {longitude}</p>
        </div>
      ) : (
        !error && <p>Завантаження локації...</p>
      )}
    </div>
  );
};

export default Location;
