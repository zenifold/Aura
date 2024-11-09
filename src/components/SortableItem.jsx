import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ExternalLink, 
  GripVertical, 
  Calendar, 
  Flag,
  LayoutGrid,
  BookOpen,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Link as LinkIcon,
  GitMerge,
  GitBranch,
  Copy
} from 'lucide-react';
import TaskDialog from './TaskDialog';
import TaskContextMenu from './TaskContextMenu';
import NotificationToast from './NotificationToast';
import { useSortableItem } from '../hooks/useSortableItem';
import { useTheme } from '../hooks/useTheme';

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

const RELATIONSHIP_ICONS = {
  'blocks': { 
    icon: ArrowRight, 
    color: {
      bg: 'bg-red-50 dark:bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-500/20'
    }
  },
  'blocked-by': { 
    icon: ArrowLeft, 
    color: {
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-500/20'
    }
  },
  'relates-to': { 
    icon: LinkIcon, 
    color: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-500/20'
    }
  },
  'duplicates': { 
    icon: Copy, 
    color: {
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-500/20'
    }
  },
  'parent-of': { 
    icon: GitBranch, 
    color: {
      bg: 'bg-green-50 dark:bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-500/20'
    }
  },
  'child-of': { 
    icon: GitMerge, 
    color: {
      bg: 'bg-teal-50 dark:bg-teal-500/10',
      text: 'text-teal-600 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-500/20'
    }
  }
};

const SortableItem = ({ 
  id, 
  task, 
  onUpdateTask, 
  availableLabels,
  onCreateLabel,
  availableTasks = []
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const { theme } = useTheme();

  const {
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
  } = useSortableItem(task, onUpdateTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const hierarchyType = task.hierarchyType || 'task';
  const HierarchyIcon = HIERARCHY_ICONS[hierarchyType]?.icon || CheckSquare;
  const hierarchyColor = HIERARCHY_ICONS[hierarchyType]?.color;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white dark:bg-dark-card p-2.5 rounded-lg border border-surface-200 
          dark:border-dark-border group hover:border-aura-200 dark:hover:border-aura-500/30 
          hover:shadow-aura dark:hover:shadow-none transition-all duration-200 
          ${isDragging ? 'shadow-aura-lg dark:shadow-none rotate-2' : 'hover:shadow-sm dark:hover:shadow-none'}
          transform hover:-translate-y-0.5 hover:scale-[1.01]`}
        onContextMenu={handleContextMenu}
      >
        <div className="flex flex-col gap-1.5">
          {/* Title Row with Hierarchy Icon */}
          <div className="flex items-center gap-1.5">
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md p-1 
                transition-colors group-hover:text-aura-500 dark:group-hover:text-aura-400
                hover:scale-105 active:scale-95"
            >
              <GripVertical size={14} className="text-surface-400 dark:text-dark-text/60 group-hover:text-current" />
            </div>

            {/* Hierarchy Icon */}
            <div className={`p-1 rounded-md ${hierarchyColor.bg} border ${hierarchyColor.border} 
              shadow-sm transition-transform duration-200`}
              title={`${hierarchyType.charAt(0).toUpperCase() + hierarchyType.slice(1)}`}
            >
              <HierarchyIcon size={12} className={hierarchyColor.text} strokeWidth={2.5} />
            </div>

            {/* Title */}
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setEditedTitle(task.title);
                    setIsEditing(false);
                  }
                }}
                className="flex-1 px-2 py-1 border border-surface-200 dark:border-dark-border rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-aura-200 dark:focus:ring-aura-500/30 
                  focus:border-aura-500 dark:focus:border-aura-500 text-surface-700 dark:text-dark-text 
                  bg-white dark:bg-dark-hover transition-all duration-200"
              />
            ) : (
              <span 
                className="flex-1 select-none text-surface-700 dark:text-dark-text 
                  group-hover:text-surface-800 dark:group-hover:text-white font-medium
                  text-sm leading-tight"
                onDoubleClick={handleDoubleClick}
              >
                {task.title}
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowDialog(true)}
              className="p-1 hover:bg-surface-100 dark:hover:bg-dark-hover rounded-md 
                transition-colors hover:scale-105 active:scale-95"
            >
              <ExternalLink size={14} className="text-surface-400 dark:text-dark-text/60 
                group-hover:text-aura-500 dark:group-hover:text-aura-400" />
            </button>
          </div>

          {/* Metadata Row */}
          {(task.priority || task.dueDate || task.relationships?.length > 0 || task.labels?.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 pl-7">
              {/* Priority Icon */}
              {task.priority && (
                <div className={`p-1 rounded-md transition-colors duration-200 hover:scale-110
                  ${task.priority.color.light} border ${task.priority.color.border} 
                  shadow-sm hover:shadow-md`}
                  title={task.priority.label}
                >
                  <Flag size={12} className={`${task.priority.color.text}`} strokeWidth={2.5} />
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div className="p-1 rounded-md bg-surface-100 dark:bg-dark-hover 
                  transition-colors duration-200 hover:scale-110 border border-surface-200 
                  dark:border-dark-border shadow-sm hover:shadow-md"
                  title={new Date(task.dueDate).toLocaleDateString()}
                >
                  <Calendar size={12} className="text-surface-700 dark:text-dark-text" strokeWidth={2.5} />
                </div>
              )}

              {/* Relationship Icons */}
              {task.relationships?.map((rel, index) => {
                const relConfig = RELATIONSHIP_ICONS[rel.type];
                if (!relConfig) return null;
                const RelIcon = relConfig.icon;
                const relatedTask = availableTasks.find(t => t.id === rel.taskId);
                
                return (
                  <div
                    key={`${rel.type}-${rel.taskId}-${index}`}
                    className={`p-1 rounded-md ${relConfig.color.bg} border ${relConfig.color.border}
                      shadow-sm transition-transform duration-200 hover:scale-110`}
                    title={`${rel.type}: ${relatedTask?.title || 'Unknown Task'}`}
                  >
                    <RelIcon size={12} className={relConfig.color.text} strokeWidth={2.5} />
                  </div>
                );
              })}

              {/* Labels as small color dots */}
              {task.labels?.map(label => (
                <div
                  key={label.id}
                  className={`w-2 h-2 rounded-full transition-transform duration-200 hover:scale-150
                    ${label.color.light} shadow-sm ring-1 ring-surface-300 dark:ring-dark-border`}
                  title={label.text}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <TaskContextMenu
          position={contextMenu}
          onCopy={handleCopy}
          onCreateLink={() => setContextMenu(null)}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        progress={notificationProgress}
        onUndo={handleUndo}
      />

      {/* Task Dialog */}
      <TaskDialog
        task={task}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onUpdate={onUpdateTask}
        availableLabels={availableLabels}
        onCreateLabel={onCreateLabel}
        availableTasks={availableTasks}
      />
    </>
  );
};

export default SortableItem;
