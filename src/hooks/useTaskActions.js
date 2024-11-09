import { useState } from 'react';

export const useTaskActions = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTaskForProject, setAddingTaskForProject] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleAddTaskClick = (projectId) => {
    setAddingTaskForProject(projectId);
    setNewTaskTitle('');
  };

  const handleCancelAddTask = () => {
    setAddingTaskForProject(null);
    setNewTaskTitle('');
  };

  const getAvailableStatuses = (projects) => {
    const statusSet = new Set();
    projects.forEach(project => {
      project.columns.forEach(column => {
        statusSet.add(column.title);
      });
    });
    return Array.from(statusSet);
  };

  return {
    selectedTask,
    isDialogOpen,
    newTaskTitle,
    setNewTaskTitle,
    addingTaskForProject,
    handleTaskClick,
    handleTaskDialogClose,
    handleAddTaskClick,
    handleCancelAddTask,
    getAvailableStatuses
  };
};
