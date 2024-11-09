import { useState, useMemo } from 'react';
import { defaultColumns } from '../components/ListViewColumns';

export const useListView = (projects = []) => {
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [groupBy, setGroupBy] = useState('project');
  const [activeColumns, setActiveColumns] = useState(
    defaultColumns.map(col => col.id)
  );
  // Track column order separately from active columns
  const [columnOrder, setColumnOrder] = useState(
    defaultColumns.map(col => col.id)
  );

  // Extract all tasks from all projects
  const allTasks = useMemo(() => {
    return projects.flatMap(project => 
      project.columns.flatMap(column => 
        column.tasks.map(task => ({
          ...task,
          projectId: project.id,
          projectTitle: project.title,
          projectColor: project.color,
          mainStatus: column.title,
          statusColor: {
            light: column.color?.light || 'bg-surface-100',
            text: column.color?.text || 'text-surface-600',
            dark: column.color?.dark || 'dark:bg-dark-hover'
          }
        }))
      )
    );
  }, [projects]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    if (!allTasks || allTasks.length === 0) return [];
    
    return [...allTasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'dueDate':
          comparison = (a.dueDate || '').localeCompare(b.dueDate || '');
          break;
        case 'status':
          comparison = (a.mainStatus || '').localeCompare(b.mainStatus || '');
          break;
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          const aPriority = a.priority?.id ? priorityOrder[a.priority.id] : 4;
          const bPriority = b.priority?.id ? priorityOrder[b.priority.id] : 4;
          comparison = aPriority - bPriority;
          break;
        case 'project':
          comparison = (a.projectTitle || '').localeCompare(b.projectTitle || '');
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [allTasks, sortBy, sortDirection]);

  // Group tasks
  const groupedTasks = useMemo(() => {
    if (!sortedTasks || sortedTasks.length === 0) {
      return { 'No Tasks': [] };
    }

    if (groupBy === 'none') {
      return { 'All Tasks': sortedTasks };
    }

    return sortedTasks.reduce((groups, task) => {
      let groupKey;
      
      switch (groupBy) {
        case 'project':
          groupKey = task.projectTitle || 'No Project';
          break;
        case 'status':
          groupKey = task.mainStatus || 'No Status';
          break;
        case 'dueDate':
          if (!task.dueDate) {
            groupKey = 'No Due Date';
          } else {
            const date = new Date(task.dueDate);
            groupKey = date.toLocaleDateString();
          }
          break;
        default:
          groupKey = 'Other';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
      return groups;
    }, {});
  }, [sortedTasks, groupBy]);

  // Get all unique statuses
  const availableStatuses = useMemo(() => {
    const statuses = new Set();
    projects.forEach(project => {
      project.columns.forEach(column => {
        statuses.add(column.title);
      });
    });
    return Array.from(statuses);
  }, [projects]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const toggleColumn = (columnId) => {
    setActiveColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      }
      return [...prev, columnId];
    });
  };

  // Handle column reordering
  const handleColumnReorder = (sourceIndex, destinationIndex) => {
    setColumnOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const [removed] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(destinationIndex, 0, removed);
      return newOrder;
    });
  };

  // Get ordered columns (both active and all)
  const orderedColumns = useMemo(() => {
    return columnOrder
      .map(id => defaultColumns.find(col => col.id === id))
      .filter(Boolean);
  }, [columnOrder]);

  const orderedActiveColumns = useMemo(() => {
    return columnOrder.filter(id => activeColumns.includes(id));
  }, [columnOrder, activeColumns]);

  return {
    sortBy,
    sortDirection,
    groupBy,
    setGroupBy,
    handleSort,
    groupedTasks,
    availableStatuses,
    activeColumns,
    toggleColumn,
    columnOrder,
    orderedColumns,
    orderedActiveColumns,
    handleColumnReorder,
    _debug: {
      allTasks,
      sortedTasks
    }
  };
};
