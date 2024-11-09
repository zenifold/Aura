import React, { useState } from 'react';
import { 
  Tag, 
  Calendar, 
  Folder, 
  ExternalLink,
  LayoutGrid,
  BookOpen,
  CheckSquare
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import TaskDialog from './TaskDialog';

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

const TaskListItem = ({ 
  task, 
  onUpdateTask, 
  projectColor, 
  showProject = false,
  availableTasks = [],
  availableLabels = [],
  activeColumns = []
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const { theme } = useTheme();

  const hierarchyType = task.hierarchyType || 'task';
  const HierarchyIcon = HIERARCHY_ICONS[hierarchyType]?.icon || CheckSquare;
  const hierarchyColor = HIERARCHY_ICONS[hierarchyType]?.color;

  return (
    <>
      <tr className="group hover:bg-surface-50/50 dark:hover:bg-dark-hover transition-colors">
        {/* Title Column - Always visible */}
        <td className="p-3">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md ${hierarchyColor.bg} border ${hierarchyColor.border} 
              shadow-sm transition-transform duration-200`}
              title={`${hierarchyType.charAt(0).toUpperCase() + hierarchyType.slice(1)}`}
            >
              <HierarchyIcon size={14} className={hierarchyColor.text} strokeWidth={2.5} />
            </div>

            <span className="font-medium text-surface-800 dark:text-dark-text 
              group-hover:text-aura-600 dark:group-hover:text-aura-400 transition-colors">
              {task.title}
            </span>

            <button
              onClick={() => setShowDialog(true)}
              className="p-1 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
                transition-colors hover:scale-105 active:scale-95"
            >
              <ExternalLink size={14} className="text-surface-400 dark:text-dark-text/60 
                group-hover:text-aura-500 dark:group-hover:text-aura-400" />
            </button>
          </div>
        </td>

        {/* Status Column */}
        {activeColumns.includes('status') && (
          <td className="p-3">
            <span className={`px-2.5 py-1 rounded-full text-sm font-medium
              ${task.statusColor?.light || 'bg-surface-100 dark:bg-dark-hover'} 
              ${task.statusColor?.text || 'text-surface-600 dark:text-dark-text'}
              dark:bg-opacity-30 shadow-sm dark:shadow-none`}>
              {task.mainStatus}
            </span>
          </td>
        )}

        {/* Priority Column */}
        {activeColumns.includes('priority') && (
          <td className="p-3">
            {task.priority && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                ${task.priority.color.light} dark:bg-opacity-30 ${task.priority.color.text}
                shadow-sm dark:shadow-none`}>
                {task.priority.label}
              </span>
            )}
          </td>
        )}

        {/* Due Date Column */}
        {activeColumns.includes('dueDate') && (
          <td className="p-3">
            {task.dueDate && (
              <span className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-dark-text/60">
                <Calendar size={14} className="text-surface-400 dark:text-dark-text/50" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </span>
            )}
          </td>
        )}

        {/* Labels Column */}
        {activeColumns.includes('labels') && (
          <td className="p-3">
            <div className="flex flex-wrap gap-1.5">
              {task.labels?.map(label => (
                <span
                  key={label.id}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${label.color.light} dark:bg-opacity-30 ${label.color.text}
                    shadow-sm dark:shadow-none transform transition-transform duration-200
                    hover:scale-105`}
                >
                  {label.text}
                </span>
              ))}
              {task.tags?.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-surface-100 dark:bg-dark-hover/50 text-surface-600 
                    dark:text-dark-text rounded-full text-xs font-medium flex items-center gap-1.5
                    shadow-sm dark:shadow-none transform transition-transform duration-200
                    hover:scale-105 hover:bg-surface-200 dark:hover:bg-dark-border"
                >
                  <Tag size={12} className="text-surface-500 dark:text-dark-text/60" />
                  {tag}
                </span>
              ))}
            </div>
          </td>
        )}

        {/* Project Column */}
        {activeColumns.includes('project') && showProject && (
          <td className="p-3">
            <span className="flex items-center gap-1.5 text-sm">
              <Folder size={14} className="text-surface-400 dark:text-dark-text/50" />
              <span className={`${task.projectColor?.text || 'text-surface-600 dark:text-dark-text'}`}>
                {task.projectTitle}
              </span>
            </span>
          </td>
        )}
      </tr>

      {/* Task Dialog */}
      <TaskDialog
        task={task}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onUpdate={onUpdateTask}
        availableLabels={availableLabels}
        availableTasks={availableTasks}
      />
    </>
  );
};

export default TaskListItem;