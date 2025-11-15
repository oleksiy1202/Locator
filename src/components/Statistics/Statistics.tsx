import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './Statistics.css';

interface LocationData {
    coords: [number, number];
    accuracy: number;
    address: string | null;
    timestamp: string;
}

interface StatisticsProps {
    history: LocationData[];
    units: 'metric' | 'imperial';
}

const Statistics: React.FC<StatisticsProps> = ({ history, units }) => {
    const stats = useMemo(() => {
        if (history.length === 0) {
            return {
                totalPoints: 0,
                avgAccuracy: 0,
                totalDistance: 0,
                bestAccuracy: 0,
                worstAccuracy: 0
            };
        }

        // Обчислення відстані між двома точками (формула Haversine)
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
            const R = 6371000; // Радіус Землі в метрах
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // Загальна відстань
        let totalDistance = 0;
        for (let i = 1; i < history.length; i++) {
            const [lat1, lon1] = history[i - 1].coords;
            const [lat2, lon2] = history[i].coords;
            totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
        }

        // Точності
        const accuracies = history.map(h => h.accuracy);
        const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
        const bestAccuracy = Math.min(...accuracies);
        const worstAccuracy = Math.max(...accuracies);

        return {
            totalPoints: history.length,
            avgAccuracy,
            totalDistance,
            bestAccuracy,
            worstAccuracy
        };
    }, [history]);

    const formatDistance = (meters: number): string => {
        if (units === 'imperial') {
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
    };

    if (history.length === 0) {
        return (
            <motion.div 
                className="statistics-empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <p>📊 Немає даних для статистики</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="statistics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h3>📊 Статистика</h3>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📍</div>
                    <div className="stat-value">{stats.totalPoints}</div>
                    <div className="stat-label">Точок збережено</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📏</div>
                    <div className="stat-value">{formatDistance(stats.totalDistance)}</div>
                    <div className="stat-label">Загальна відстань</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{formatDistance(stats.avgAccuracy)}</div>
                    <div className="stat-label">Середня точність</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{formatDistance(stats.bestAccuracy)}</div>
                    <div className="stat-label">Найкраща точність</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-value">{formatDistance(stats.worstAccuracy)}</div>
                    <div className="stat-label">Найгірша точність</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🕒</div>
                    <div className="stat-value">
                        {history[0]?.timestamp || '-'}
                    </div>
                    <div className="stat-label">Остання локація</div>
                </div>
            </div>
        </motion.div>
    );
};

export default Statistics;

