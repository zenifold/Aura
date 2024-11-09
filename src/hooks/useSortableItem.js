import { useState, useRef, useEffect } from 'react';

export const useSortableItem = (task, onUpdateTask) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [notification, setNotification] = useState(null);
  const [notificationProgress, setNotificationProgress] = useState(100);
  const inputRef = useRef(null);
  const deleteTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const NOTIFICATION_DURATION = 5000; // 5 seconds

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (notification) {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
      
      const timer = setTimeout(() => {
        setNotification(null);
        if (notification.type === 'delete' && !notification.undone) {
          onUpdateTask({ ...task, isDeleted: true });
        }
      }, NOTIFICATION_DURATION);

      deleteTimeoutRef.current = timer;
      return () => clearTimeout(timer);
    }
  }, [notification, task, onUpdateTask]);

  useEffect(() => {
    if (notification?.type === 'delete' && !notification.undone) {
      setNotificationProgress(100);
      const startTime = Date.now();
      const interval = 10; // Update every 10ms for smooth animation

      progressIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = 100 - (elapsedTime / NOTIFICATION_DURATION) * 100;
        
        if (progress <= 0) {
          clearInterval(progressIntervalRef.current);
        } else {
          setNotificationProgress(progress);
        }
      }, interval);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [notification]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(task.title);
      setNotification({ type: 'copy', message: 'Copied to clipboard' });
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDelete = () => {
    setNotification({ 
      type: 'delete', 
      message: 'Task deleted', 
      undone: false,
      task: { ...task }
    });
  };

  const handleUndo = () => {
    if (notification?.type === 'delete') {
      setNotification(prev => ({ ...prev, undone: true }));
      clearTimeout(deleteTimeoutRef.current);
      clearInterval(progressIntervalRef.current);
      setTimeout(() => setNotification(null), 1000);
    }
  };

  const handleTitleSubmit = () => {
    if (editedTitle.trim()) {
      onUpdateTask({
        ...task,
        title: editedTitle.trim()
      });
      setIsEditing(false);
    }
  };

  const handleArchive = () => {
    onUpdateTask({ ...task, isArchived: true });
  };

  return {
    isEditing,
    setIsEditing,
    editedTitle,
    setEditedTitle,
    notification,
    notificationProgress,
    inputRef,
    handleCopy,
    handleDelete,
    handleUndo,
    handleTitleSubmit,
    handleArchive
  };
};
