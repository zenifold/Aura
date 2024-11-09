import React from 'react';
import { Flag } from 'lucide-react';

const priorities = [
  {
    id: 'high',
    label: 'High',
    color: {
      light: 'bg-red-50',
      base: 'bg-status-error',
      text: 'text-status-error',
      hover: 'hover:bg-red-100',
      ring: 'ring-status-error',
      darkBg: 'dark:bg-red-500/30',
      darkHover: 'dark:hover:bg-red-500/40'
    }
  },
  {
    id: 'medium',
    label: 'Medium',
    color: {
      light: 'bg-amber-50',
      base: 'bg-status-warning',
      text: 'text-status-warning',
      hover: 'hover:bg-amber-100',
      ring: 'ring-status-warning',
      darkBg: 'dark:bg-amber-500/30',
      darkHover: 'dark:hover:bg-amber-500/40'
    }
  },
  {
    id: 'low',
    label: 'Low',
    color: {
      light: 'bg-blue-50',
      base: 'bg-status-info',
      text: 'text-status-info',
      hover: 'hover:bg-blue-100',
      ring: 'ring-status-info',
      darkBg: 'dark:bg-blue-500/30',
      darkHover: 'dark:hover:bg-blue-500/40'
    }
  }
];

const TaskPrioritySelect = ({
  selectedPriority,
  onPrioritySelect
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80">
        Priority
      </label>
      <div className="flex flex-wrap gap-2">
        {priorities.map(priority => (
          <button
            key={priority.id}
            onClick={() => onPrioritySelect(priority)}
            className={`
              px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-2
              transition-all duration-200 shadow-sm dark:shadow-none
              ${selectedPriority?.id === priority.id 
                ? `${priority.color.light} ${priority.darkBg} ${priority.color.text} 
                   ring-2 ring-offset-2 dark:ring-offset-dark-card ${priority.color.ring}` 
                : `bg-surface-100 dark:bg-dark-hover text-surface-600 dark:text-dark-text/80 
                   ${priority.color.hover} ${priority.darkHover} hover:text-surface-700 
                   dark:hover:text-dark-text`
              }
            `}
          >
            <Flag 
              size={14} 
              className={selectedPriority?.id === priority.id 
                ? priority.color.text 
                : 'text-surface-500 dark:text-dark-text/60'} 
            />
            {priority.label}
          </button>
        ))}
        {selectedPriority && (
          <button
            onClick={() => onPrioritySelect(null)}
            className="px-3.5 py-1.5 rounded-full text-sm font-medium bg-surface-100 
              dark:bg-dark-hover text-surface-600 dark:text-dark-text/80 
              hover:bg-surface-200 dark:hover:bg-dark-border hover:text-surface-700 
              dark:hover:text-dark-text transition-colors duration-200 shadow-sm dark:shadow-none"
          >
            Clear
          </button>
        )}
      </div>
      {!selectedPriority && (
        <p className="text-sm text-surface-500 dark:text-dark-text/60 mt-1">
          Select a priority level for this task
        </p>
      )}
    </div>
  );
};

export default TaskPrioritySelect;
