import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreVertical, Plus } from 'lucide-react';
import SortableItem from './SortableItem';
import EditableTitle from './EditableTitle';
import { useTheme } from '../hooks/useTheme';
import ColorPicker from './ColorPicker';

const DroppableColumn = ({ 
  column, 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onUpdateColumn,
  projectLabels,
  onCreateLabel
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { theme } = useTheme();

  const { setNodeRef } = useDroppable({
    id: column.id
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleColorSelect = (color) => {
    onUpdateColumn({ ...column, color });
    setShowColorPicker(false);
    setShowMenu(false);
  };

  // Get all tasks from all columns for relationship management
  const getAllTasks = () => {
    const allColumns = column.projectColumns || [];
    return allColumns.reduce((acc, col) => [...acc, ...col.tasks], []);
  };

  const handleTaskUpdate = (updatedTask) => {
    // Directly call onUpdateTask with the updated task
    onUpdateTask(updatedTask);
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-[280px] md:w-80 bg-white dark:bg-dark-card rounded-lg shadow-aura 
        border border-surface-200 dark:border-dark-border transition-colors duration-200 p-2"
    >
      {/* Header */}
      <div className="p-3 border-b border-surface-200 dark:border-dark-border flex items-center 
        justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${column.color?.bg || 'bg-surface-400'} 
            shadow-sm dark:shadow-none`} />
          <EditableTitle
            title={column.title}
            onUpdate={(newTitle) => onUpdateColumn({ ...column, title: newTitle })}
            className="font-medium text-surface-800 dark:text-dark-text"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
              transition-colors"
          >
            <MoreVertical size={16} className="text-surface-400 dark:text-dark-text/60" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-card rounded-lg 
              shadow-lg border border-surface-200 dark:border-dark-border z-10">
              <button
                onClick={() => {
                  setShowColorPicker(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-surface-700 dark:text-dark-text 
                  hover:bg-surface-50 dark:hover:bg-dark-hover first:rounded-t-lg 
                  last:rounded-b-lg transition-colors"
              >
                Edit Column Color
              </button>
            </div>
          )}
          {showColorPicker && (
            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-dark-card rounded-lg 
              shadow-lg border border-surface-200 dark:border-dark-border z-10">
              <ColorPicker
                selectedColor={column.color}
                onColorSelect={handleColorSelect}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="p-3 space-y-2 min-h-[200px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableItem
              key={task.id}
              id={task.id}
              task={{
                ...task,
                statusColor: column.color // Pass column color as status color
              }}
              onUpdateTask={handleTaskUpdate}
              availableLabels={projectLabels}
              onCreateLabel={onCreateLabel}
              availableTasks={getAllTasks()}
            />
          ))}
        </SortableContext>

        {/* Add Task Form */}
        {isAddingTask ? (
          <form onSubmit={handleAddTask} className="mt-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-surface-200 dark:border-dark-border 
                rounded-lg focus:outline-none focus:ring-2 focus:ring-aura-200 
                dark:focus:ring-aura-500/30 focus:border-aura-500 dark:focus:border-aura-500 
                text-surface-700 dark:text-dark-text placeholder-surface-400 
                dark:placeholder-dark-text/60 bg-white dark:bg-dark-hover 
                transition-all duration-200"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className={`flex-1 px-3 py-1.5 ${theme.colors.primary} text-white rounded-md 
                  hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-sm 
                  hover:shadow dark:shadow-none`}
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
                className="flex-1 px-3 py-1.5 bg-surface-100 dark:bg-dark-hover text-surface-600 
                  dark:text-dark-text rounded-md hover:bg-surface-200 dark:hover:bg-dark-border 
                  transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full mt-2 px-3 py-2 text-surface-500 dark:text-dark-text/60 
              hover:text-surface-700 dark:hover:text-dark-text hover:bg-surface-50 
              dark:hover:bg-dark-hover rounded-lg transition-colors text-sm flex items-center 
              justify-center gap-2"
          >
            <Plus size={16} />
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default DroppableColumn;
