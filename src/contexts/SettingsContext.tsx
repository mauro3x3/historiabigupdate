import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DateFormat = 'european' | 'american';

interface SettingsContextType {
  dateFormat: DateFormat;
  setDateFormat: (format: DateFormat) => void;
  formatDate: (date: Date | string) => string;
  formatDateInput: (date: Date | string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [dateFormat, setDateFormatState] = useState<DateFormat>('european');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedFormat = localStorage.getItem('dateFormat') as DateFormat;
    if (savedFormat && (savedFormat === 'european' || savedFormat === 'american')) {
      setDateFormatState(savedFormat);
    }
  }, []);

  // Save settings to localStorage when changed
  const setDateFormat = (format: DateFormat) => {
    setDateFormatState(format);
    localStorage.setItem('dateFormat', format);
  };

  // Format date for display
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    if (dateFormat === 'european') {
      return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else {
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Format date for input fields (YYYY-MM-DD)
  const formatDateInput = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return dateObj.toISOString().split('T')[0];
  };

  const value: SettingsContextType = {
    dateFormat,
    setDateFormat,
    formatDate,
    formatDateInput
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
