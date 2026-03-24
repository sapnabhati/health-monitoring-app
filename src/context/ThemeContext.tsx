import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark as requested

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Swap CSS variables if necessary (though current CSS assumes dark by default)
        if (theme === 'light') {
            // Minimal override for light mode testing
            root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)');
            root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--card-bg-hover', 'rgba(255, 255, 255, 0.95)');
            root.style.setProperty('--card-border', 'rgba(0, 0, 0, 0.05)');
            root.style.setProperty('--text-main', '#1e293b');
            root.style.setProperty('--text-muted', '#64748b');
        } else {
            // Reset to dark defaults (from index.css)
            root.style.setProperty('--bg-gradient', '');
            root.style.setProperty('--card-bg', '');
            root.style.setProperty('--card-bg-hover', '');
            root.style.setProperty('--card-border', '');
            root.style.setProperty('--text-main', '');
            root.style.setProperty('--text-muted', '');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
