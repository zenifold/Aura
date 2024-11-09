import React, { useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Link, Copy, GitMerge, GitBranch } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const RELATIONSHIP_TYPES = [
  {
    id: 'blocks',
    label: 'Blocks',
    description: 'This task blocks another task',
    icon: ArrowRight,
    color: {
      light: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      hover: 'hover:bg-red-100'
    }
  },
  {
    id: 'blocked-by',
    label: 'Blocked By',
    description: 'This task is blocked by another task',
    icon: ArrowLeft,
    color: {
      light: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100'
    }
  },
  {
    id: 'relates-to',
    label: 'Related To',
    description: 'This task is related to another task',
    icon: Link,
    color: {
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    }
  },
  {
    id: 'duplicates',
    label: 'Duplicates',
    description: 'This task duplicates another task',
    icon: Copy,
    color: {
      light: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100'
    }
  },
  {
    id: 'parent-of',
    label: 'Parent Of',
    description: 'This task is a parent of another task',
    icon: GitBranch,
    color: {
      light: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    }
  },
  {
    id: 'child-of',
    label: 'Child Of',
    description: 'This task is a child of another task',
    icon: GitMerge,
    color: {
      light: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-200',
      hover: 'hover:bg-teal-100'
    }
  }
];

const RelationshipDialog = ({ 
  isOpen, 
  onClose,
  onSelect,
  sourceTask,
  targetTask
}) => {
  const { theme } = useTheme();

  console.log('RelationshipDialog render:', { isOpen, sourceTask, targetTask });

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when dialog is open
      document.body.style.overflow = 'hidden';
      
      // Add escape key handler
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  // Early return if dialog should be closed
  if (!isOpen || !sourceTask || !targetTask) {
    console.log('Dialog not showing due to:', { 
      isOpen, 
      hasSourceTask: !!sourceTask, 
      hasTargetTask: !!targetTask 
    });
    return null;
  }

  const handleSelect = (type) => {
    console.log('Selected relationship type:', type);
    onSelect?.(type);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
      <div 
        className="fixed inset-0 bg-black/30" 
        onClick={onClose}
        style={{ pointerEvents: 'auto' }}
      />
      <div 
        className="relative bg-white dark:bg-dark-card rounded-xl shadow-xl border border-surface-200 
          dark:border-dark-border w-[480px] max-w-[90vw]"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-surface-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-800 dark:text-dark-text">
              Define Relationship
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
                transition-colors"
            >
              <X size={20} className="text-surface-400 dark:text-dark-text/60" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm text-surface-600 dark:text-dark-text/80">
              Connecting:
            </div>
            <div className="mt-1 font-medium text-surface-800 dark:text-dark-text">
              {sourceTask?.title} → {targetTask?.title}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {RELATIONSHIP_TYPES.map((type) => {
              const TypeIcon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.id)}
                  className={`flex items-start gap-2 p-3 rounded-lg border transition-colors
                    ${type.color.border} ${type.color.light} dark:bg-opacity-10 text-left
                    ${type.color.hover} dark:hover:bg-opacity-20`}
                >
                  <TypeIcon size={16} className={`${type.color.text} mt-0.5`} />
                  <div>
                    <div className="font-medium text-surface-700 dark:text-dark-text">
                      {type.label}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-dark-text/60 mt-0.5">
                      {type.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDialog;
