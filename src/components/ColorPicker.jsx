import React from 'react';
import { Check, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const colors = [
  // Aura theme colors
  { name: 'aura', bg: 'bg-aura-500', text: 'text-aura-500', light: 'bg-aura-100', lightText: 'text-aura-800' },
  { name: 'accent', bg: 'bg-accent-500', text: 'text-accent-500', light: 'bg-accent-100', lightText: 'text-accent-800' },
  // Status colors
  { name: 'success', bg: 'bg-status-success', text: 'text-status-success', light: 'bg-green-100', lightText: 'text-green-800' },
  { name: 'warning', bg: 'bg-status-warning', text: 'text-status-warning', light: 'bg-amber-100', lightText: 'text-amber-800' },
  { name: 'error', bg: 'bg-status-error', text: 'text-status-error', light: 'bg-red-100', lightText: 'text-red-800' },
  { name: 'info', bg: 'bg-status-info', text: 'text-status-info', light: 'bg-blue-100', lightText: 'text-blue-800' },
  // Grey colors
  { name: 'grey', bg: 'bg-surface-500', text: 'text-surface-500', light: 'bg-surface-100', lightText: 'text-surface-800' },
  { name: 'light-grey', bg: 'bg-surface-300', text: 'text-surface-300', light: 'bg-surface-50', lightText: 'text-surface-600' },
  // Additional colors for variety
  { name: 'violet', bg: 'bg-violet-500', text: 'text-violet-500', light: 'bg-violet-100', lightText: 'text-violet-800' },
  { name: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-100', lightText: 'text-indigo-800' },
  { name: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-100', lightText: 'text-emerald-800' },
  { name: 'rose', bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-100', lightText: 'text-rose-800' },
  { name: 'amber', bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-100', lightText: 'text-amber-800' },
  { name: 'teal', bg: 'bg-teal-500', text: 'text-teal-500', light: 'bg-teal-100', lightText: 'text-teal-800' },
];

const ColorPicker = ({ selectedColor, onColorSelect, className }) => {
  const { theme } = useTheme();

  return (
    <div className={`p-3 ${className}`}>
      {/* Remove color option */}
      <button
        onClick={() => onColorSelect(null)}
        className="w-full mb-3 px-3 py-1.5 text-sm flex items-center gap-2 rounded-md 
          text-surface-600 dark:text-dark-text/80 hover:bg-surface-50 dark:hover:bg-dark-hover 
          hover:text-surface-700 dark:hover:text-dark-text transition-colors duration-200"
      >
        <X size={14} />
        Remove color
      </button>

      {/* Color list */}
      <div className="max-h-[240px] overflow-y-auto pr-1 space-y-1">
        {colors.map((color) => (
          <button
            key={color.name}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-md
              hover:bg-surface-50 dark:hover:bg-dark-hover 
              focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30
              transition-all duration-200
              ${selectedColor?.name === color.name 
                ? 'bg-surface-50 dark:bg-dark-hover ring-2 ring-aura-400 dark:ring-aura-500/50' 
                : ''}
            `}
            onClick={() => onColorSelect(color)}
          >
            <div className={`w-4 h-4 rounded-full ${color.bg} shadow-sm dark:shadow-none flex-shrink-0`} />
            <span className="text-sm text-surface-700 dark:text-dark-text capitalize">
              {color.name.split('-').join(' ')}
            </span>
            {selectedColor?.name === color.name && (
              <Check size={16} className={`ml-auto ${theme.colors.text}`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
export { colors };
