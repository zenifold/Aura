import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import TaskMetadataForm from './TaskMetadataForm';
import TaskPrioritySelect from './TaskPrioritySelect';
import TaskLabelSelect from './TaskLabelSelect';
import TaskHierarchySelect from './TaskHierarchySelect';
import TaskRelationshipSelect from './TaskRelationshipSelect';
import { useTaskForm } from '../hooks/useTaskForm';
import { useDialog } from '../hooks/useDialog';
import { useTheme } from '../hooks/useTheme';

const TaskDialog = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate,
  availableLabels = [],
  onCreateLabel,
  availableTasks = []
}) => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const {
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    setStartDate,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    selectedLabels,
    isAddingLabel,
    setIsAddingLabel,
    newLabelText,
    setNewLabelText,
    hierarchyType,
    setHierarchyType,
    relationships,
    handleSubmit,
    handleLabelToggle,
    handleAddLabel,
    handleAddRelationship,
    handleRemoveRelationship
  } = useTaskForm(task, onUpdate);

  const { handleBackdropClick } = useDialog(isOpen, onClose);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const handleClose = (save = true) => {
    if (save) {
      handleSubmit();
    }
    onClose();
  };

  const handleAddNewLabel = (color) => {
    const newLabel = handleAddLabel(color);
    if (newLabel && onCreateLabel) {
      onCreateLabel(newLabel);
    }
  };

  const isNewTask = !task.id;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-surface-900/20 dark:bg-black/40 
        backdrop-blur-sm transition-colors duration-200"
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 
          transition-opacity duration-300" />

        {/* Dialog */}
        <div className="relative bg-white dark:bg-dark-card rounded-xl shadow-aura-lg dark:shadow-none 
          w-full max-w-3xl my-4 transition-all duration-300 ease-out transform flex flex-col 
          max-h-[calc(100vh-2rem)] overflow-hidden border border-surface-200 dark:border-dark-border">
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-surface-200 
            dark:border-dark-border flex-shrink-0">
            <h2 className="text-xl font-semibold text-surface-800 dark:text-dark-text pr-8">
              {isNewTask ? 'Create New Task' : 'Edit Task'}
            </h2>
            <button
              onClick={() => handleClose(false)}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 p-2 hover:bg-surface-100 
                dark:hover:bg-dark-hover rounded-full transition-colors touch-manipulation"
            >
              <X size={20} className="text-surface-500 dark:text-dark-text/60 
                hover:text-surface-700 dark:hover:text-dark-text" />
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-6 space-y-8 
            ${isMobile ? 'pb-24' : ''}`}>
            <TaskMetadataForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              startDate={startDate}
              setStartDate={setStartDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
            />

            <TaskHierarchySelect
              selectedType={hierarchyType}
              onTypeSelect={setHierarchyType}
            />

            <TaskPrioritySelect
              selectedPriority={priority}
              onPrioritySelect={setPriority}
            />

            <TaskLabelSelect
              availableLabels={availableLabels}
              selectedLabels={selectedLabels}
              isAddingLabel={isAddingLabel}
              setIsAddingLabel={setIsAddingLabel}
              newLabelText={newLabelText}
              setNewLabelText={setNewLabelText}
              onLabelToggle={handleLabelToggle}
              onAddLabel={handleAddNewLabel}
            />

            {!isNewTask && (
              <TaskRelationshipSelect
                currentTaskId={task.id}
                relationships={relationships}
                availableTasks={availableTasks}
                onAddRelationship={handleAddRelationship}
                onRemoveRelationship={handleRemoveRelationship}
              />
            )}
          </div>

          {/* Footer */}
          <div className={`flex justify-end gap-3 px-4 sm:px-6 py-4 border-t border-surface-200 
            dark:border-dark-border bg-surface-50/50 dark:bg-dark-hover/30 flex-shrink-0 
            transition-colors duration-200 ${isMobile ? 'fixed bottom-0 left-0 right-0 shadow-lg' : ''}`}>
            <button
              onClick={() => handleClose(false)}
              className="px-4 py-2 text-surface-700 dark:text-dark-text hover:text-surface-800 
                dark:hover:text-white hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
                transition-colors font-medium touch-manipulation min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={() => handleClose(true)}
              className={`px-4 py-2 ${theme.colors.primary} text-white rounded-md hover:opacity-90 
                transition-all duration-200 font-medium shadow-sm hover:shadow dark:shadow-none 
                touch-manipulation min-h-[44px] ${isMobile ? 'flex-1' : ''}`}
            >
              {isNewTask ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDialog;
