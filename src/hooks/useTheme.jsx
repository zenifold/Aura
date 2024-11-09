import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('aura-theme');
    return savedTheme ? JSON.parse(savedTheme) : {
      id: 'aura',
      name: 'Aura Purple',
      colors: {
        primary: 'bg-aura-500',
        secondary: 'bg-accent-500',
        sample: 'bg-gradient-to-r from-aura-500 to-accent-500'
      }
    };
  });

  const [isDark, setIsDark] = useState(() => {
    const savedMode = localStorage.getItem('aura-dark-mode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('aura-theme', JSON.stringify(theme));
    localStorage.setItem('aura-dark-mode', JSON.stringify(isDark));
    
    // Apply dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a1b1e'; // dark.bg
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }

    // Apply theme changes to CSS variables
    document.documentElement.style.setProperty('--theme-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.colors.secondary);
  }, [theme, isDark]);

  // Listen for system color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setCurrentTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme: setCurrentTheme,
      isDark,
      toggleDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useTheme };
