import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Перемкнути на ${theme === 'light' ? 'темну' : 'світлу'} тему`}
        >
            {theme === 'light' ? (
                <span className="theme-icon">🌙</span>
            ) : (
                <span className="theme-icon">☀️</span>
            )}
        </button>
    );
};

export default ThemeToggle;

