import React from 'react';
import { Copy, Link, Archive, Trash } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const TaskContextMenu = ({ 
  position, 
  onCopy, 
  onCreateLink, 
  onArchive, 
  onDelete, 
  onClose 
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="fixed bg-white dark:bg-dark-card rounded-xl shadow-aura-lg dark:shadow-none 
        border border-surface-200 dark:border-dark-border py-1.5 z-50
        backdrop-blur-sm bg-white/95 dark:bg-dark-card/95 min-w-[180px]
        transition-colors duration-200"
      style={{
        top: position.y,
        left: position.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full px-4 py-2.5 text-sm text-left text-surface-700 dark:text-dark-text 
          hover:bg-surface-50 dark:hover:bg-dark-hover hover:text-aura-600 dark:hover:text-aura-400 
          flex items-center gap-3 transition-colors duration-200 font-medium"
        onClick={() => {
          onCopy();
          onClose();
        }}
      >
        <Copy size={15} className="text-surface-500 dark:text-dark-text/60" />
        Copy
      </button>
      <button
        className="w-full px-4 py-2.5 text-sm text-left text-surface-700 dark:text-dark-text 
          hover:bg-surface-50 dark:hover:bg-dark-hover hover:text-aura-600 dark:hover:text-aura-400 
          flex items-center gap-3 transition-colors duration-200 font-medium"
        onClick={() => {
          onCreateLink();
          onClose();
        }}
      >
        <Link size={15} className="text-surface-500 dark:text-dark-text/60" />
        Create Link
      </button>
      <button
        className="w-full px-4 py-2.5 text-sm text-left text-surface-700 dark:text-dark-text 
          hover:bg-surface-50 dark:hover:bg-dark-hover hover:text-aura-600 dark:hover:text-aura-400 
          flex items-center gap-3 transition-colors duration-200 font-medium"
        onClick={() => {
          onArchive();
          onClose();
        }}
      >
        <Archive size={15} className="text-surface-500 dark:text-dark-text/60" />
        Archive
      </button>
      <div className="border-t border-surface-200 dark:border-dark-border my-1.5" />
      <button
        className="w-full px-4 py-2.5 text-sm text-left text-red-600 dark:text-red-400 
          hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3
          transition-colors duration-200 font-medium group"
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <Trash size={15} className="text-red-500 dark:text-red-400 
          group-hover:text-red-600 dark:group-hover:text-red-300" />
        Delete
      </button>
    </div>
  );
};

export default TaskContextMenu;
