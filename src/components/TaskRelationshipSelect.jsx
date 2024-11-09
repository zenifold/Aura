import React, { useState, useEffect, useRef } from 'react';
import { 
  Link, 
  ArrowRight, 
  ArrowLeft, 
  GitMerge, 
  GitBranch, 
  Copy, 
  Trash2,
  Search,
  X,
  ChevronLeft
} from 'lucide-react';
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
    label: 'Relates To',
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

const TaskRelationshipSelect = ({ 
  currentTaskId,
  relationships = [], 
  availableTasks = [],
  onAddRelationship,
  onRemoveRelationship
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedType(null);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedType && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [selectedType]);

  const filteredTasks = availableTasks
    .filter(task => task.id !== currentTaskId)
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !relationships.some(rel => rel.taskId === task.id && rel.type === selectedType)
    );

  const handleAddRelationship = (taskId) => {
    if (selectedType && taskId) {
      onAddRelationship({
        type: selectedType,
        taskId
      });
      setIsOpen(false);
      setSelectedType(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-surface-600 dark:text-dark-text/80">
          Task Relationships
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`px-3 py-1.5 text-sm ${theme.colors.primary} text-white rounded-md 
            hover:opacity-90 transition-all duration-200 font-medium shadow-sm hover:shadow 
            dark:shadow-none`}
        >
          Add Relationship
        </button>
      </div>

      {/* Existing Relationships */}
      {relationships.length > 0 && (
        <div className="space-y-2">
          {relationships.map((rel) => {
            const relType = RELATIONSHIP_TYPES.find(type => type.id === rel.type);
            const relatedTask = availableTasks.find(task => task.id === rel.taskId);
            const RelIcon = relType?.icon || Link;

            return (
              <div 
                key={`${rel.type}-${rel.taskId}`}
                className={`flex items-center justify-between p-2 rounded-md border
                  ${relType?.color.border} ${relType?.color.light} dark:bg-opacity-10
                  transition-all duration-200`}
              >
                <div className="flex items-center gap-2">
                  <RelIcon size={16} className={relType?.color.text} />
                  <span className="text-sm font-medium text-surface-700 dark:text-dark-text">
                    {relType?.label}:
                  </span>
                  <span className="text-sm text-surface-600 dark:text-dark-text/80">
                    {relatedTask?.title}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveRelationship(rel)}
                  className="p-1 hover:bg-surface-200/50 dark:hover:bg-dark-hover rounded-md 
                    transition-colors"
                  title="Remove relationship"
                >
                  <Trash2 size={14} className="text-surface-400 dark:text-dark-text/60" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Relationship Dialog */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 
              transition-opacity" aria-hidden="true"></div>

            <div className="relative bg-white dark:bg-dark-card rounded-xl shadow-xl 
              transform transition-all w-full max-w-lg border border-surface-200 
              dark:border-dark-border">
              {/* Header */}
              <div className="px-4 py-3 border-b border-surface-200 dark:border-dark-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedType && (
                      <button
                        onClick={() => setSelectedType(null)}
                        className="p-1 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
                          transition-colors"
                      >
                        <ChevronLeft size={16} className="text-surface-400 dark:text-dark-text/60" />
                      </button>
                    )}
                    <h3 className="text-lg font-semibold text-surface-800 dark:text-dark-text">
                      {selectedType ? 'Select Task' : 'Add Task Relationship'}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSelectedType(null);
                      setSearchQuery('');
                    }}
                    className="p-1 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
                      transition-colors"
                  >
                    <X size={20} className="text-surface-400 dark:text-dark-text/60" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {!selectedType ? (
                  <div className="grid grid-cols-2 gap-2">
                    {RELATIONSHIP_TYPES.map((type) => {
                      const TypeIcon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
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
                ) : (
                  <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 
                        text-surface-400 dark:text-dark-text/60" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-dark-border 
                          rounded-lg focus:outline-none focus:ring-2 focus:ring-aura-200 
                          dark:focus:ring-aura-500/30 focus:border-aura-500 dark:focus:border-aura-500 
                          text-surface-700 dark:text-dark-text bg-white dark:bg-dark-hover 
                          placeholder-surface-400 dark:placeholder-dark-text/60"
                      />
                    </div>

                    {/* Task List */}
                    <div className="max-h-60 overflow-y-auto space-y-1 overscroll-contain">
                      {filteredTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => handleAddRelationship(task.id)}
                          className="w-full p-2 text-left hover:bg-surface-50 dark:hover:bg-dark-hover 
                            rounded-md transition-colors"
                        >
                          <div className="font-medium text-surface-700 dark:text-dark-text">
                            {task.title}
                          </div>
                        </button>
                      ))}
                      {filteredTasks.length === 0 && (
                        <div className="text-center py-3 text-surface-500 dark:text-dark-text/60">
                          No matching tasks found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskRelationshipSelect;
