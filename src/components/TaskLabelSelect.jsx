import React from 'react';
import { Plus, X, Check } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useTheme } from '../hooks/useTheme';

const TaskLabelSelect = ({
  availableLabels = [],
  selectedLabels = [],
  isAddingLabel,
  setIsAddingLabel,
  newLabelText,
  setNewLabelText,
  onLabelToggle,
  onAddLabel
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80">
        Labels
      </label>
      <div className="flex flex-wrap gap-2">
        {availableLabels.map(label => (
          <button
            key={label.id}
            onClick={() => onLabelToggle(label)}
            className={`
              px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-2
              transition-all duration-200 shadow-sm dark:shadow-none
              ${label.color.light} dark:bg-opacity-30 ${label.color.lightText}
              ${selectedLabels.some(l => l.id === label.id) 
                ? `ring-2 ring-offset-2 dark:ring-offset-dark-card ${label.color.ring}` 
                : 'hover:shadow-md dark:hover:shadow-none transform hover:-translate-y-0.5'
              }
            `}
          >
            {label.text}
            {selectedLabels.some(l => l.id === label.id) && (
              <Check size={14} className="text-current" />
            )}
          </button>
        ))}
        <button
          onClick={() => setIsAddingLabel(true)}
          className="px-3.5 py-1.5 rounded-full text-sm font-medium bg-surface-100 dark:bg-dark-hover 
            text-surface-600 dark:text-dark-text/80 hover:bg-aura-50 dark:hover:bg-dark-border 
            hover:text-aura-600 dark:hover:text-aura-400 flex items-center gap-2 
            transition-all duration-200 shadow-sm dark:shadow-none hover:shadow-md 
            dark:hover:shadow-none transform hover:-translate-y-0.5"
        >
          <Plus size={14} />
          Add Label
        </button>
      </div>

      {isAddingLabel && (
        <div className="mt-3 p-4 bg-surface-50/50 dark:bg-dark-hover/30 rounded-xl border 
          border-surface-200 dark:border-dark-border shadow-sm dark:shadow-none 
          transition-colors duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-surface-700 dark:text-dark-text">Create New Label</h4>
            <button
              onClick={() => setIsAddingLabel(false)}
              className="p-1 text-surface-400 dark:text-dark-text/60 hover:text-surface-600 
                dark:hover:text-dark-text hover:bg-surface-100 dark:hover:bg-dark-hover 
                rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={newLabelText}
                onChange={(e) => setNewLabelText(e.target.value)}
                placeholder="Label text..."
                className="w-full px-3 py-2 border border-surface-200 dark:border-dark-border rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
                  focus:border-aura-500 dark:focus:border-aura-500 text-surface-700 dark:text-dark-text 
                  placeholder-surface-400 dark:placeholder-dark-text/60 bg-white dark:bg-dark-hover
                  transition-all duration-200"
              />
            </div>
            <div className="bg-white dark:bg-dark-card rounded-lg border border-surface-200 
              dark:border-dark-border shadow-sm dark:shadow-none transition-colors duration-200">
              <ColorPicker
                onColorSelect={(color) => {
                  const newLabel = onAddLabel(color);
                  if (newLabel) {
                    setIsAddingLabel(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {!isAddingLabel && availableLabels.length === 0 && (
        <p className="text-sm text-surface-500 dark:text-dark-text/60 mt-1">
          No labels created yet. Click "Add Label" to create your first label.
        </p>
      )}
    </div>
  );
};

export default TaskLabelSelect;
