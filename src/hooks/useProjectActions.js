import { useState } from 'react';

export const useProjectActions = (project, onUpdateProject) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project?.title || '');

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== project.title) {
      onUpdateProject({
        ...project,
        title: editedTitle.trim()
      });
    } else {
      setEditedTitle(project.title);
    }
    setEditingTitle(false);
  };

  const handleColorSelect = (color) => {
    onUpdateProject({
      ...project,
      color: color
    });
  };

  const handleAddTask = (columnId, taskTitle) => {
    const column = project.columns.find(col => col.id === columnId);
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: '',
      mainStatus: column.title,
      createdAt: new Date().toISOString(),
    };

    const updatedColumns = project.columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    );

    onUpdateProject({
      ...project,
      columns: updatedColumns
    });
  };

  const handleUpdateTask = (updatedTask) => {
    const updatedColumns = project.columns.map(column => ({
      ...column,
      tasks: updatedTask.isDeleted
        ? column.tasks.filter(task => task.id !== updatedTask.id)
        : column.tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
    }));

    onUpdateProject({
      ...project,
      columns: updatedColumns
    });
  };

  const handleStatusChange = (task, newStatus) => {
    const updatedColumns = project.columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.id !== task.id)
    }));

    const targetColumn = updatedColumns.find(col => col.title === newStatus);
    if (targetColumn) {
      targetColumn.tasks.push({
        ...task,
        mainStatus: newStatus
      });
    }

    onUpdateProject({
      ...project,
      columns: updatedColumns
    });
  };

  return {
    editingTitle,
    setEditingTitle,
    editedTitle,
    setEditedTitle,
    handleTitleSubmit,
    handleColorSelect,
    handleAddTask,
    handleUpdateTask,
    handleStatusChange
  };
};
