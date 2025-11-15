import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Settings.css';

const Settings: React.FC = () => {
    const { settings, updateSettings, resetSettings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSettings = () => setIsOpen(!isOpen);

    const handleAutoUpdateChange = (checked: boolean) => {
        updateSettings({ autoUpdate: checked });
    };

    const handleIntervalChange = (value: number) => {
        updateSettings({ updateInterval: value });
    };

    const handleHistoryLimitChange = (value: number) => {
        updateSettings({ historyLimit: value });
    };

    const handleUnitsChange = (value: 'metric' | 'imperial') => {
        updateSettings({ units: value });
    };

    const handleAccuracyCircleChange = (checked: boolean) => {
        updateSettings({ showAccuracyCircle: checked });
    };

    const handleReset = () => {
        if (window.confirm('Скинути всі налаштування до значень за замовчуванням?')) {
            resetSettings();
        }
    };

    return (
        <>
            {/* Кнопка відкриття налаштувань */}
            <button 
                className="settings-trigger" 
                onClick={toggleSettings}
                aria-label="Відкрити налаштування"
            >
                ⚙️
            </button>

            {/* Панель налаштувань */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="settings-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSettings}
                        />

                        {/* Панель */}
                        <motion.div
                            className="settings-panel"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="settings-header">
                                <h2>⚙️ Налаштування</h2>
                                <button className="close-button" onClick={toggleSettings}>
                                    ✕
                                </button>
                            </div>

                            <div className="settings-content">
                                {/* Автооновлення */}
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span>🔄 Автооновлення локації</span>
                                        <p className="setting-description">
                                            Автоматично оновлювати вашу позицію
                                        </p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.autoUpdate}
                                            onChange={(e) => handleAutoUpdateChange(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                {/* Інтервал оновлення */}
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span>⏱️ Інтервал оновлення</span>
                                        <p className="setting-description">
                                            Як часто оновлювати локацію: {settings.updateInterval}с
                                        </p>
                                    </div>
                                    <select
                                        value={settings.updateInterval}
                                        onChange={(e) => handleIntervalChange(Number(e.target.value))}
                                        disabled={!settings.autoUpdate}
                                        className="setting-select"
                                    >
                                        <option value={5}>5 секунд</option>
                                        <option value={10}>10 секунд</option>
                                        <option value={30}>30 секунд</option>
                                        <option value={60}>1 хвилина</option>
                                        <option value={300}>5 хвилин</option>
                                    </select>
                                </div>

                                {/* Кількість точок */}
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span>📍 Історія локацій</span>
                                        <p className="setting-description">
                                            Зберігати останніх {settings.historyLimit} точок
                                        </p>
                                    </div>
                                    <select
                                        value={settings.historyLimit}
                                        onChange={(e) => handleHistoryLimitChange(Number(e.target.value))}
                                        className="setting-select"
                                    >
                                        <option value={5}>5 точок</option>
                                        <option value={10}>10 точок</option>
                                        <option value={25}>25 точок</option>
                                        <option value={50}>50 точок</option>
                                        <option value={100}>100 точок</option>
                                    </select>
                                </div>

                                {/* Одиниці виміру */}
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span>📏 Одиниці виміру</span>
                                        <p className="setting-description">
                                            Система вимірювання відстаней
                                        </p>
                                    </div>
                                    <select
                                        value={settings.units}
                                        onChange={(e) => handleUnitsChange(e.target.value as 'metric' | 'imperial')}
                                        className="setting-select"
                                    >
                                        <option value="metric">Метрична (м, км)</option>
                                        <option value="imperial">Англійська (ft, mi)</option>
                                    </select>
                                </div>

                                {/* Коло точності */}
                                <div className="setting-item">
                                    <div className="setting-label">
                                        <span>🎯 Коло точності</span>
                                        <p className="setting-description">
                                            Показувати коло точності на карті
                                        </p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.showAccuracyCircle}
                                            onChange={(e) => handleAccuracyCircleChange(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                {/* Кнопка скидання */}
                                <div className="settings-actions">
                                    <button className="reset-button" onClick={handleReset}>
                                        🔄 Скинути налаштування
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Settings;

