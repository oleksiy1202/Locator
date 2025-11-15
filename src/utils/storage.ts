// LocalStorage утиліти для збереження історії локацій

export interface LocationData {
    coords: [number, number];
    accuracy: number;
    address: string | null;
    timestamp: string;
    fullDate: string;
}

const STORAGE_KEY = 'location-history';

// Зберегти історію
export const saveHistory = (history: LocationData[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Помилка збереження історії:', error);
    }
};

// Завантажити історію
export const loadHistory = (): LocationData[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Помилка завантаження історії:', error);
        return [];
    }
};

// Очистити історію
export const clearHistory = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Помилка очищення історії:', error);
    }
};

// Експорт в JSON
export const exportToJSON = (history: LocationData[]): void => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

// Експорт в CSV
export const exportToCSV = (history: LocationData[]): void => {
    const headers = ['Час', 'Дата', 'Широта', 'Довгота', 'Точність (м)', 'Адреса'];
    const rows = history.map(item => [
        item.timestamp,
        item.fullDate || new Date().toLocaleDateString(),
        item.coords[0].toFixed(6),
        item.coords[1].toFixed(6),
        item.accuracy.toFixed(2),
        item.address || 'Не визначено'
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `location-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

// Поділитися поточною локацією
export const shareLocation = async (coords: [number, number], address: string | null): Promise<void> => {
    const text = address 
        ? `Моя локація: ${address}`
        : 'Моя локація';
    
    const url = `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Моя локація',
                text: text,
                url: url
            });
        } catch (error) {
            console.log('Помилка поділитися:', error);
            // Fallback: копіювати в буфер
            copyToClipboard(url);
        }
    } else {
        // Fallback: копіювати в буфер
        copyToClipboard(url);
    }
};

// Копіювати в буфер обміну
export const copyToClipboard = (text: string): void => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Посилання скопійовано в буфер обміну!');
        });
    } else {
        // Fallback для старих браузерів
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Посилання скопійовано в буфер обміну!');
    }
};

