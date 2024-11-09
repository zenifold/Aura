import React from 'react';
import { Link, LayoutGrid, BookOpen, CheckSquare } from 'lucide-react';

const HIERARCHY_ICONS = {
  epic: { 
    icon: LayoutGrid, 
    color: {
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-500/20'
    }
  },
  story: { 
    icon: BookOpen, 
    color: {
      bg: 'bg-green-50 dark:bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-500/20'
    }
  },
  task: { 
    icon: CheckSquare, 
    color: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-500/20'
    }
  }
};

const TaskBar = ({ task, position, onTaskClick }) => {
  console.log('TaskBar rendering with task:', task);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'to do':
        return 'bg-violet-200/90 dark:bg-violet-300/30';
      case 'in progress':
        return 'bg-sky-200/90 dark:bg-sky-300/30';
      case 'done':
        return 'bg-emerald-200/90 dark:bg-emerald-300/30';
      default:
        return 'bg-slate-200/90 dark:bg-slate-300/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-300/90';
      case 'medium':
        return 'bg-amber-300/90';
      case 'low':
        return 'bg-emerald-300/90';
      default:
        return '';
    }
  };

  const hierarchyType = task.hierarchyType || 'task';
  const iconConfig = HIERARCHY_ICONS[hierarchyType] || HIERARCHY_ICONS.task;
  const HierarchyIcon = iconConfig.icon;
  const hierarchyColor = iconConfig.color;

  return (
    <div
      className={`absolute h-10 rounded-md cursor-pointer transition-all group mb-1
        hover:ring-2 ring-aura-200 dark:ring-aura-500/30 ${getStatusColor(task.mainStatus)}`}
      style={{
        ...position,
        opacity: 0.95
      }}
      onClick={() => onTaskClick?.(task)}
    >
      <div className="absolute inset-0 px-2.5 py-1.5 overflow-hidden flex items-center gap-2.5">
        {/* Task Type Icon */}
        <div 
          className={`p-1 rounded-md ${hierarchyColor.bg} border ${hierarchyColor.border} 
            shadow-sm transition-transform duration-200 shrink-0`}
          title={`${hierarchyType.charAt(0).toUpperCase() + hierarchyType.slice(1)}`}
        >
          <HierarchyIcon size={14} className={hierarchyColor.text} strokeWidth={2.5} />
        </div>

        {/* Task Title */}
        <span className="text-sm font-medium truncate flex-grow text-surface-900 dark:text-white">
          {task.title}
        </span>

        {/* Metadata (right side) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {task.priority && (
            <div 
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} 
              title={`${task.priority} Priority`}
            />
          )}
          {task.hasRelationships && (
            <Link 
              size={13} 
              className="flex-shrink-0 text-surface-600 dark:text-dark-text/70"
              title="Has relationships"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskBar;
