import { useState, useCallback } from 'react';

export const useCanvas = (projectId) => {
  const [connections, setConnections] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);

  // Handle task position updates
  const updateTaskPosition = useCallback((taskId, position) => {
    return position; // Just return the position, parent component handles the update
  }, []);

  // Start creating a connection
  const startConnection = useCallback((taskId, connectionPoint) => {
    setActiveConnection({
      sourceId: taskId,
      sourcePoint: connectionPoint,
      targetId: null,
      targetPoint: null
    });
  }, []);

  // Complete a connection
  const completeConnection = useCallback((targetId, targetPoint) => {
    if (!activeConnection) return;

    const newConnection = {
      id: `${activeConnection.sourceId}-${targetId}-${Date.now()}`,
      sourceId: activeConnection.sourceId,
      sourcePoint: activeConnection.sourcePoint,
      targetId,
      targetPoint,
      created: new Date().toISOString()
    };

    setConnections(prev => [...prev, newConnection]);
    setActiveConnection(null);
  }, [activeConnection]);

  // Cancel active connection
  const cancelConnection = useCallback(() => {
    setActiveConnection(null);
  }, []);

  // Remove a connection
  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  }, []);

  // Calculate connection line coordinates
  const getConnectionCoordinates = useCallback((connection) => {
    // Get point coordinates based on the side of the task
    const getPointCoordinates = (position, point) => {
      const taskWidth = 240; // Match the width in CanvasTask
      const taskHeight = 100; // Approximate height

      switch (point) {
        case 'left':
          return { x: position.x, y: position.y + taskHeight / 2 };
        case 'right':
          return { x: position.x + taskWidth, y: position.y + taskHeight / 2 };
        case 'top':
          return { x: position.x + taskWidth / 2, y: position.y };
        case 'bottom':
          return { x: position.x + taskWidth / 2, y: position.y + taskHeight };
        default:
          return position;
      }
    };

    return {
      start: connection.sourcePosition ? getPointCoordinates(connection.sourcePosition, connection.sourcePoint) : null,
      end: connection.targetPosition ? getPointCoordinates(connection.targetPosition, connection.targetPoint) : null
    };
  }, []);

  return {
    connections,
    activeConnection,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    updateTaskPosition,
    startConnection,
    completeConnection,
    cancelConnection,
    removeConnection,
    getConnectionCoordinates
  };
};
