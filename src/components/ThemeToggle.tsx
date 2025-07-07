import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
      style={{
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`
      }}
      title={`Switch to ${theme.isDark ? 'light' : 'dark'} mode`}
    >
      {theme.isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};