import React from 'react';
import { Check, Trash, Undo } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const NotificationToast = ({ 
  notification, 
  progress, 
  onUndo 
}) => {
  const { theme, isDark } = useTheme();

  if (!notification) return null;

  return (
    <div className={`fixed bottom-6 right-6 ${isDark ? 'bg-dark-bg' : 'bg-surface-900'} 
      text-white rounded-xl shadow-aura-lg dark:shadow-none z-50 overflow-hidden 
      backdrop-blur-sm bg-opacity-90 border ${isDark ? 'border-dark-border' : 'border-surface-700'}
      transform transition-all duration-300 ease-out`}>
      <div className="px-4 py-3 flex items-center gap-3">
        {notification.type === 'copy' ? (
          <>
            <div className={`p-1 ${theme.colors.primary} bg-opacity-20 rounded-full`}>
              <Check size={16} className={theme.colors.text} />
            </div>
            <span className={isDark ? 'text-dark-text' : 'text-surface-100'}>
              {notification.message}
            </span>
          </>
        ) : notification.type === 'delete' && !notification.undone ? (
          <>
            <span className="flex items-center gap-3">
              <div className="p-1 bg-red-500 bg-opacity-20 rounded-full">
                <Trash size={16} className="text-red-400 dark:text-red-300" />
              </div>
              <span className={isDark ? 'text-dark-text' : 'text-surface-100'}>
                {notification.message}
              </span>
            </span>
            <button
              onClick={onUndo}
              className={`ml-2 px-3 py-1.5 ${isDark ? 'bg-dark-hover hover:bg-dark-border' : 'bg-surface-700 hover:bg-surface-600'} 
                rounded-lg flex items-center gap-2 text-sm font-medium
                transition-colors duration-200 border ${isDark ? 'border-dark-border' : 'border-surface-600'}`}
            >
              <Undo size={14} />
              Undo
            </button>
          </>
        ) : null}
      </div>
      
      {/* Progress Bar */}
      {notification?.type === 'delete' && !notification.undone && (
        <div className={isDark ? 'h-1 w-full bg-dark-border' : 'h-1 w-full bg-surface-800'}>
          <div 
            className={`h-full ${theme.colors.primary} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationToast;
