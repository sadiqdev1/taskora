import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use dark mode
  const [theme] = useState('dark');

  useEffect(() => {
    // Apply dark mode to document
    document.documentElement.classList.add('dark');
  }, []);

  const value = {
    theme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
