import React from 'react';
import { Check, Sun, Moon } from 'lucide-react';

const themes = [
  {
    id: 'aura',
    name: 'Aura Purple',
    colors: {
      primary: 'bg-aura-500',
      secondary: 'bg-accent-500',
      sample: 'bg-gradient-to-r from-aura-500 to-accent-500'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      primary: 'bg-blue-500',
      secondary: 'bg-cyan-500',
      sample: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    colors: {
      primary: 'bg-emerald-500',
      secondary: 'bg-green-500',
      sample: 'bg-gradient-to-r from-emerald-500 to-green-500'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: {
      primary: 'bg-orange-500',
      secondary: 'bg-red-500',
      sample: 'bg-gradient-to-r from-orange-500 to-red-500'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Purple',
    colors: {
      primary: 'bg-purple-900',
      secondary: 'bg-indigo-800',
      sample: 'bg-gradient-to-r from-purple-900 to-indigo-800'
    }
  },
  {
    id: 'slate',
    name: 'Slate Gray',
    colors: {
      primary: 'bg-slate-700',
      secondary: 'bg-slate-600',
      sample: 'bg-gradient-to-r from-slate-700 to-slate-600'
    }
  }
];

const ThemePicker = ({ selectedTheme, onThemeSelect, isDark, onToggleMode }) => {
  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-sm font-medium text-surface-700 dark:text-dark-text">
          Color Mode
        </span>
        <button
          onClick={onToggleMode}
          className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-hover
            transition-colors duration-200"
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-surface-700 dark:text-dark-text" />
          ) : (
            <Sun className="w-5 h-5 text-surface-700 dark:text-dark-text" />
          )}
        </button>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className={`
              relative p-4 rounded-lg border 
              border-surface-200 dark:border-dark-border
              hover:border-surface-300 dark:hover:border-dark-hover 
              transition-all duration-200 bg-white dark:bg-dark-card
              ${selectedTheme?.id === theme.id ? 'ring-2 ring-aura-500 ring-offset-2 dark:ring-offset-dark-bg' : ''}
            `}
          >
            {/* Theme Preview */}
            <div className={`h-12 rounded-md mb-3 ${theme.colors.sample}`} />
            
            {/* Theme Name */}
            <div className="text-left">
              <span className="text-sm font-medium text-surface-700 dark:text-dark-text">
                {theme.name}
              </span>
            </div>

            {/* Selected Indicator */}
            {selectedTheme?.id === theme.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-white dark:bg-dark-card 
                rounded-full flex items-center justify-center shadow-sm">
                <Check size={12} className="text-aura-500" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemePicker;
