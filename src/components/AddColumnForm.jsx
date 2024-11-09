import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useTheme } from '../hooks/useTheme';

const AddColumnForm = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), selectedColor);
      setTitle('');
      setSelectedColor(null);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="group flex items-center gap-2 hover:bg-surface-50 dark:hover:bg-dark-hover 
            p-1 rounded-lg transition-colors duration-200"
        >
          {selectedColor ? (
            <div className={`w-2.5 md:w-3 h-2.5 md:h-3 rounded-full ${selectedColor.bg} 
              group-hover:ring-2 ring-surface-300 dark:ring-dark-border transition-all duration-200`} />
          ) : (
            <Palette size={16} className="text-surface-400 dark:text-dark-text/60 
              group-hover:text-surface-600 dark:group-hover:text-dark-text" />
          )}
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter column title..."
          className="flex-1 p-2.5 md:p-2 text-sm md:text-base rounded border border-surface-200 
            dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-aura-200 
            dark:focus:ring-aura-500/30 focus:border-aura-500 dark:focus:border-aura-500 
            text-surface-700 dark:text-dark-text placeholder:text-surface-400 
            dark:placeholder:text-dark-text/60 bg-white dark:bg-dark-hover
            transition-all duration-200 placeholder:text-sm md:placeholder:text-base"
          autoFocus
        />
      </div>

      {showColorPicker && (
        <div className="relative mb-3">
          <div className="absolute z-10 top-0 left-0 w-full bg-white dark:bg-dark-card rounded-lg 
            shadow-lg dark:shadow-none border border-surface-200 dark:border-dark-border 
            transition-colors duration-200">
            <ColorPicker
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className={`flex-1 px-3 py-2 md:py-1.5 text-sm md:text-base ${theme.colors.primary} 
            text-white rounded-md hover:opacity-90 transition-all duration-200 touch-manipulation`}
        >
          Add Column
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 md:py-1.5 text-sm md:text-base bg-surface-200 
            dark:bg-dark-hover text-surface-700 dark:text-dark-text rounded-md 
            hover:bg-surface-300 dark:hover:bg-dark-border active:bg-surface-400 
            dark:active:bg-dark-border/70 transition-colors duration-200 touch-manipulation"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddColumnForm;
