import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
  disableBackground?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, disableBackground }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300${disableBackground ? '' : ''}`}
      style={disableBackground ? {} : {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        backgroundImage: theme.backgroundPattern,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
        fontFamily: theme.fontFamily
      }}
    >
      {!disableBackground && (
        <style>{`
          :root {
            --primary: ${theme.colors.primary};
            --secondary: ${theme.colors.secondary};
            --accent: ${theme.colors.accent};
            --background: ${theme.colors.background};
            --text: ${theme.colors.text};
            --border: ${theme.colors.border};
            --success: ${theme.colors.success};
            --error: ${theme.colors.error};
            --warning: ${theme.colors.warning};
            --info: ${theme.colors.info};
          }

          body {
            background-color: ${theme.colors.background};
            color: ${theme.colors.text};
            font-family: ${theme.fontFamily}, sans-serif;
          }

          .btn-primary {
            background-color: ${theme.colors.primary};
            color: white;
          }

          .btn-secondary {
            background-color: ${theme.colors.secondary};
            color: white;
          }

          .btn-accent {
            background-color: ${theme.colors.accent};
            color: ${theme.colors.text};
          }

          .border-primary {
            border-color: ${theme.colors.primary};
          }

          .border-secondary {
            border-color: ${theme.colors.secondary};
          }

          .border-accent {
            border-color: ${theme.colors.accent};
          }

          .text-primary {
            color: ${theme.colors.primary};
          }

          .text-secondary {
            color: ${theme.colors.secondary};
          }

          .text-accent {
            color: ${theme.colors.accent};
          }

          .bg-primary {
            background-color: ${theme.colors.primary};
          }

          .bg-secondary {
            background-color: ${theme.colors.secondary};
          }

          .bg-accent {
            background-color: ${theme.colors.accent};
          }

          .hover\\:bg-primary:hover {
            background-color: ${theme.colors.primary};
          }

          .hover\\:bg-secondary:hover {
            background-color: ${theme.colors.secondary};
          }

          .hover\\:bg-accent:hover {
            background-color: ${theme.colors.accent};
          }
        `}</style>
      )}
      {children}
    </div>
  );
}; 