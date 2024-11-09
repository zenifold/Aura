import React, { useRef } from 'react';
import { MoreVertical, Pencil, Trash, Palette, Plus, ChevronUp, ChevronDown, MinusSquare, PlusSquare } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useClickOutside } from '../hooks/useClickOutside';
import { useProjectActions } from '../hooks/useProjectActions';
import { useTheme } from '../hooks/useTheme';

const ProjectHeader = ({ 
  project, 
  onUpdateProject, 
  onDeleteProject, 
  onAddTask,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  showAddTask = true,
  className = "",
  isCollapsed,
  onToggleCollapse
}) => {
  const optionsRef = useRef(null);
  const colorPickerRef = useRef(null);
  const titleInputRef = useRef(null);
  const [showOptions, setShowOptions] = React.useState(false);
  const [isPickingColor, setIsPickingColor] = React.useState(false);
  const { theme } = useTheme();

  const {
    editingTitle,
    setEditingTitle,
    editedTitle,
    setEditedTitle,
    handleTitleSubmit,
    handleColorSelect: handleColorSelectBase
  } = useProjectActions(project, onUpdateProject);

  const handleColorSelect = (color) => {
    handleColorSelectBase(color);
    setIsPickingColor(false);
    setShowOptions(false);
  };

  useClickOutside(optionsRef, () => setShowOptions(false));
  useClickOutside(colorPickerRef, () => setIsPickingColor(false));

  React.useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  // Calculate task count
  const taskCount = project.totalTasks !== undefined 
    ? project.totalTasks 
    : project.columns.reduce((total, column) => total + column.tasks.length, 0);

  return (
    <div className={`flex justify-between items-center bg-white dark:bg-dark-card p-3 sm:p-4 
      rounded-lg shadow-aura relative overflow-visible transition-colors duration-200 ${className}`}>
      {/* Color indicator line */}
      {project?.color && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${project.color.bg}`} />
      )}
      
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onMoveUp(project.id)}
            disabled={isFirst}
            className={`p-1 rounded hover:bg-surface-100 dark:hover:bg-dark-hover transition-colors 
              ${isFirst ? 'text-surface-300 dark:text-dark-text/30' : 'text-surface-600 dark:text-dark-text'}`}
            title="Move project up"
          >
            <ChevronUp size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => onMoveDown(project.id)}
            disabled={isLast}
            className={`p-1 rounded hover:bg-surface-100 dark:hover:bg-dark-hover transition-colors 
              ${isLast ? 'text-surface-300 dark:text-dark-text/30' : 'text-surface-600 dark:text-dark-text'}`}
            title="Move project down"
          >
            <ChevronDown size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-surface-100 dark:hover:bg-dark-hover 
              transition-colors text-surface-600 dark:text-dark-text"
            title={isCollapsed ? "Expand project" : "Collapse project"}
          >
            {isCollapsed ? (
              <PlusSquare size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <MinusSquare size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setEditedTitle(project.title);
                  setEditingTitle(false);
                }
              }}
              className="text-lg sm:text-xl font-bold px-2 py-1 border border-surface-200 
                dark:border-dark-border rounded focus:outline-none focus:ring-2 
                focus:ring-aura-200 dark:focus:ring-aura-500/30 focus:border-aura-500 
                dark:focus:border-aura-500 bg-white dark:bg-dark-hover text-surface-800 
                dark:text-dark-text transition-all duration-200 flex-1 min-w-0"
            />
          ) : (
            <h2 
              className="text-lg sm:text-xl font-bold text-surface-800 dark:text-dark-text 
                cursor-pointer hover:text-aura-600 dark:hover:text-aura-400 
                transition-colors truncate"
              onDoubleClick={() => {
                setEditingTitle(true);
                setEditedTitle(project.title);
              }}
              title={project.title}
            >
              {project.title}
            </h2>
          )}
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-surface-100 dark:bg-dark-hover 
            text-surface-700 dark:text-dark-text text-xs sm:text-sm rounded-full font-medium 
            whitespace-nowrap transition-colors duration-200">
            {taskCount}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 ml-2">
        {showAddTask && !isCollapsed && (
          <button
            onClick={onAddTask}
            className={`p-1.5 sm:px-3 sm:py-1.5 ${theme.colors.primary} text-white rounded-md 
              hover:opacity-90 transition-all duration-200 flex items-center gap-2 font-medium 
              touch-manipulation`}
            title="Add Task"
          >
            <Plus size={18} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Add Task</span>
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 sm:p-2 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-full 
              transition-colors touch-manipulation"
          >
            <MoreVertical size={18} className="sm:w-5 sm:h-5 text-surface-600 dark:text-dark-text" />
          </button>
          
          {showOptions && (
            <div 
              ref={optionsRef}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md 
                shadow-aura-lg z-50 border border-surface-200 dark:border-dark-border py-1 
                transition-colors duration-200"
            >
              <button
                onClick={() => {
                  setEditingTitle(true);
                  setEditedTitle(project.title);
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-dark-text 
                  hover:bg-surface-50 dark:hover:bg-dark-hover hover:text-aura-600 dark:hover:text-aura-400 
                  flex items-center gap-2 transition-colors touch-manipulation"
              >
                <Pencil size={14} />
                Edit Title
              </button>
              <button
                onClick={() => setIsPickingColor(true)}
                className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-dark-text 
                  hover:bg-surface-50 dark:hover:bg-dark-hover hover:text-aura-600 dark:hover:text-aura-400 
                  flex items-center gap-2 transition-colors touch-manipulation"
              >
                <Palette size={14} />
                Change Color
              </button>
              <button
                onClick={() => {
                  onDeleteProject(project.id);
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
                  hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 
                  transition-colors touch-manipulation"
              >
                <Trash size={14} />
                Delete Project
              </button>
            </div>
          )}

          {isPickingColor && (
            <div 
              ref={colorPickerRef}
              className="absolute right-0 mt-2 bg-white dark:bg-dark-card rounded-lg shadow-aura-lg 
                z-50 border border-surface-200 dark:border-dark-border transition-colors duration-200"
              onClick={e => e.stopPropagation()}
            >
              <ColorPicker
                selectedColor={project.color}
                onColorSelect={handleColorSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
