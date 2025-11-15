/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SettingsType {
    autoUpdate: boolean;
    updateInterval: number; // у секундах
    historyLimit: number; // кількість точок
    units: 'metric' | 'imperial'; // метри або фути
    showAccuracyCircle: boolean;
}

interface SettingsContextType {
    settings: SettingsType;
    updateSettings: (newSettings: Partial<SettingsType>) => void;
    resetSettings: () => void;
}

const defaultSettings: SettingsType = {
    autoUpdate: false,
    updateInterval: 10,
    historyLimit: 10,
    units: 'metric',
    showAccuracyCircle: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsType>(() => {
        // Завантажуємо збережені налаштування
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            try {
                return { ...defaultSettings, ...JSON.parse(savedSettings) };
            } catch {
                return defaultSettings;
            }
        }
        return defaultSettings;
    });

    useEffect(() => {
        // Зберігаємо налаштування в localStorage
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<SettingsType>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

