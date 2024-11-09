import React from 'react';
import { ChevronDown, LayoutGrid, BookOpen, CheckSquare } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const HIERARCHY_TYPES = [
  {
    id: 'epic',
    label: 'Epic',
    description: 'A large body of work that can be broken down into smaller stories',
    icon: LayoutGrid,
    color: {
      light: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100'
    }
  },
  {
    id: 'story',
    label: 'Story',
    description: 'A user-focused feature or enhancement that delivers value',
    icon: BookOpen,
    color: {
      light: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    }
  },
  {
    id: 'task',
    label: 'Task',
    description: 'A specific piece of work that needs to be done',
    icon: CheckSquare,
    color: {
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    }
  }
];

const TaskHierarchySelect = ({ selectedType, onTypeSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const { theme } = useTheme();

  const selectedHierarchy = HIERARCHY_TYPES.find(type => type.id === selectedType) || HIERARCHY_TYPES[2];
  const Icon = selectedHierarchy.icon;

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80">
        Task Type
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 border border-surface-200 
            dark:border-dark-border rounded-lg text-left focus:outline-none focus:ring-2 
            focus:ring-aura-200 dark:focus:ring-aura-500/30 focus:border-aura-500 
            dark:focus:border-aura-500 bg-white dark:bg-dark-hover transition-all duration-200
            ${selectedHierarchy.color.hover} dark:hover:bg-dark-hover/80`}
        >
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${selectedHierarchy.color.light} dark:bg-opacity-10`}>
              <Icon size={16} className={selectedHierarchy.color.text} />
            </div>
            <span className="text-surface-700 dark:text-dark-text font-medium">
              {selectedHierarchy.label}
            </span>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-surface-400 dark:text-dark-text/60 transition-transform duration-200
              ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-card rounded-lg shadow-lg 
            border border-surface-200 dark:border-dark-border overflow-hidden">
            {HIERARCHY_TYPES.map((type) => {
              const TypeIcon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    onTypeSelect(type.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-colors
                    ${type.color.hover} dark:hover:bg-dark-hover/80
                    ${type.id === selectedType ? type.color.light + ' dark:bg-dark-hover' : ''}`}
                >
                  <div className={`p-1 rounded ${type.color.light} dark:bg-opacity-10 mt-0.5`}>
                    <TypeIcon size={16} className={type.color.text} />
                  </div>
                  <div>
                    <div className="font-medium text-surface-700 dark:text-dark-text">
                      {type.label}
                    </div>
                    <div className="text-sm text-surface-500 dark:text-dark-text/60 mt-0.5">
                      {type.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHierarchySelect;
