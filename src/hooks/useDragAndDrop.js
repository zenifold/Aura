import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export const useDragAndDrop = (project, onUpdateProject) => {
  const [activeTask, setActiveTask] = useState(null);

  const findColumnByTaskId = (taskId) => {
    return project.columns.find(column => 
      column.tasks.some(task => task.id === taskId)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const activeColumn = findColumnByTaskId(active.id);
    const activeTaskData = activeColumn?.tasks.find(task => task.id === active.id);
    setActiveTask(activeTaskData);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeColumn = findColumnByTaskId(active.id);
    if (!activeColumn) return;

    const activeTaskData = activeColumn.tasks.find(task => task.id === active.id);
    if (!activeTaskData) return;

    const overColumn = project.columns.find(col => col.id === over.id) || 
                      findColumnByTaskId(over.id);

    if (!overColumn) {
      setActiveTask(null);
      return;
    }

    if (activeColumn.id !== overColumn.id) {
      const updatedTaskData = {
        ...activeTaskData,
        mainStatus: overColumn.title
      };

      const updatedColumns = project.columns.map(col => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== active.id)
          };
        }
        if (col.id === overColumn.id) {
          const overTaskIndex = col.tasks.findIndex(task => task.id === over.id);
          const newTasks = [...col.tasks];
          
          if (overTaskIndex >= 0) {
            newTasks.splice(overTaskIndex, 0, updatedTaskData);
          } else {
            newTasks.push(updatedTaskData);
          }
          
          return {
            ...col,
            tasks: newTasks
          };
        }
        return col;
      });

      onUpdateProject({
        ...project,
        columns: updatedColumns
      });
    } else {
      const oldIndex = activeColumn.tasks.findIndex(task => task.id === active.id);
      const newIndex = activeColumn.tasks.findIndex(task => task.id === over.id);

      if (oldIndex !== newIndex) {
        const updatedColumns = project.columns.map(col => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              tasks: arrayMove(col.tasks, oldIndex, newIndex)
            };
          }
          return col;
        });

        onUpdateProject({
          ...project,
          columns: updatedColumns
        });
      }
    }

    setActiveTask(null);
  };

  return {
    activeTask,
    handleDragStart,
    handleDragEnd
  };
};
