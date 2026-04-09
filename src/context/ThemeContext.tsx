import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { themes } from '../utils/theme';

const ThemeContext = createContext<typeof themes.dark>(themes.dark);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
};
