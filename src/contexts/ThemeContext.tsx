import React, { createContext, useContext, useState, useEffect } from 'react';
import { HistoryEra } from '@/types';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

interface EraTheme {
  colors: ThemeColors;
  backgroundPattern: string;
  icon: string;
  fontFamily: string;
}

interface ThemeContextType {
  currentEra: HistoryEra | null;
  setCurrentEra: (era: HistoryEra | null) => void;
  theme: EraTheme;
}

const defaultTheme: EraTheme = {
  colors: {
    primary: '#1A1F2C', // timelingo-navy
    secondary: '#6E59A5', // timelingo-purple
    accent: '#FEC04F', // timelingo-gold
    background: '#FFFFFF',
    text: '#1A1F2C',
    border: '#E5E7EB',
    success: '#2A9D8F', // timelingo-teal
    error: '#E76F51', // timelingo-rose
    warning: '#FEC04F',
    info: '#6E59A5'
  },
  backgroundPattern: '',
  icon: '⏳',
  fontFamily: 'Inter'
};

const eraThemes: Record<HistoryEra, EraTheme> = {
  'jewish': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/jewish-pattern.svg")',
    icon: '✡️',
    fontFamily: 'Inter'
  },
  'jewish-history': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/jewish-pattern.svg")',
    icon: '✡️',
    fontFamily: 'Inter'
  },
  'islamic': {
    colors: {
      primary: '#1B4D3E', // Deep green
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/islamic-pattern.svg")',
    icon: '☪️',
    fontFamily: 'Inter'
  },
  'islamic-history': {
    colors: {
      primary: '#1B4D3E', // Deep green
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/islamic-pattern.svg")',
    icon: '☪️',
    fontFamily: 'Inter'
  },
  'christian': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/christian-pattern.svg")',
    icon: '✝️',
    fontFamily: 'Inter'
  },
  'christian-history': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/christian-pattern.svg")',
    icon: '✝️',
    fontFamily: 'Inter'
  },
  'ancient-egypt': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/egyptian-pattern.svg")',
    icon: '𓂀',
    fontFamily: 'Inter'
  },
  'chinese-history': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/chinese-pattern.svg")',
    icon: '龍',
    fontFamily: 'Inter'
  },
  'china': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/chinese-pattern.svg")',
    icon: '龍',
    fontFamily: 'Inter'
  },
  'russian-history': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/russian-pattern.svg")',
    icon: '🇷🇺',
    fontFamily: 'Inter'
  },
  'russian': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/russian-pattern.svg")',
    icon: '🇷🇺',
    fontFamily: 'Inter'
  },
  'rome-greece': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/roman-pattern.svg")',
    icon: '🏛️',
    fontFamily: 'Inter'
  },
  'medieval': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/medieval-pattern.svg")',
    icon: '⚔️',
    fontFamily: 'Inter'
  },
  'modern': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/modern-pattern.svg")',
    icon: '🌍',
    fontFamily: 'Inter'
  },
  'revolutions': {
    colors: {
      primary: '#1A1F2C', // Deep blue
      secondary: '#FEC04F', // Gold
      accent: '#6E59A5', // Purple
      background: '#F8FAFC',
      text: '#1A1F2C',
      border: '#E5E7EB',
      success: '#2A9D8F',
      error: '#E76F51',
      warning: '#FEC04F',
      info: '#6E59A5'
    },
    backgroundPattern: 'url("/patterns/revolution-pattern.svg")',
    icon: '⚡',
    fontFamily: 'Inter'
  }
};

const ThemeContext = createContext<ThemeContextType>({
  currentEra: null,
  setCurrentEra: () => {},
  theme: defaultTheme
});

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEra, setCurrentEra] = useState<HistoryEra | null>(null);
  const [theme, setTheme] = useState<EraTheme>(defaultTheme);

  useEffect(() => {
    if (currentEra) {
      setTheme(eraThemes[currentEra]);
    } else {
      setTheme(defaultTheme);
    }
  }, [currentEra]);

  return (
    <ThemeContext.Provider value={{ currentEra, setCurrentEra, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 