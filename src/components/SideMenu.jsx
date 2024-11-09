import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutGrid,
  Columns,
  ListTodo, 
  Calendar, 
  Star, 
  Clock,
  ChevronDown,
  Tags,
  Settings,
  Sparkles,
  Palette,
  ChevronLeft,
  Pencil,
  StickyNote
} from 'lucide-react';
import ThemePicker from './ThemePicker';
import { useTheme } from '../hooks/useTheme.jsx';

const MIN_WIDTH = 180;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 220;
const COLLAPSED_WIDTH = 72;
const HEADER_HEIGHT = 57;
const TOP_OFFSET = 77;

const SideMenu = ({ 
  view, 
  onViewChange, 
  isCollapsed, 
  onToggleCollapse,
  isMobile 
}) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, setTheme, isDark, toggleDarkMode } = useTheme();
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    const handleMobileMenuToggle = () => {
      if (isMobile) {
        onToggleCollapse();
      }
    };

    window.addEventListener('toggleMobileMenu', handleMobileMenuToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleMobileMenuToggle);
  }, [isMobile, onToggleCollapse]);

  const getIconSize = (isCollapsed) => isCollapsed ? 24 : 20;

  const menuItems = [
    {
      group: "Views",
      items: [
        { id: 'board', icon: (collapsed) => <Columns size={getIconSize(collapsed)} />, label: 'Board View' },
        { id: 'list', icon: (collapsed) => <ListTodo size={getIconSize(collapsed)} />, label: 'List View' },
        { id: 'canvas', icon: (collapsed) => <Pencil size={getIconSize(collapsed)} />, label: 'Canvas View' },
        { id: 'calendar', icon: (collapsed) => <Calendar size={getIconSize(collapsed)} />, label: 'Calendar' },
        { id: 'notes', icon: (collapsed) => <StickyNote size={getIconSize(collapsed)} />, label: 'Notes' },
      ]
    },
    {
      group: "Filters",
      items: [
        { id: 'starred', icon: (collapsed) => <Star size={getIconSize(collapsed)} />, label: 'Starred' },
        { id: 'recent', icon: (collapsed) => <Clock size={getIconSize(collapsed)} />, label: 'Recent' },
        { id: 'tags', icon: (collapsed) => <Tags size={getIconSize(collapsed)} />, label: 'Tags' },
      ]
    }
  ];

  const handleMouseDown = (e) => {
    if (!isMobile) {
      e.preventDefault();
      setIsResizing(true);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Mobile touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if ((diff > 50 && !isCollapsed) || (diff < -50 && isCollapsed)) {
      setTouchStart(null);
      onToggleCollapse();
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleMenuItemClick = (itemId) => {
    onViewChange(itemId);
    // Small delay before closing menu to ensure the view change happens first
    setTimeout(() => {
      if (isMobile) {
        onToggleCollapse();
      }
    }, 150);
  };

  return (
    <aside 
      style={{ 
        width: !isMobile && isCollapsed ? COLLAPSED_WIDTH : (isMobile ? '280px' : width),
        height: `calc(100vh - ${TOP_OFFSET}px)`,
        top: `${TOP_OFFSET}px`
      }}
      className={`
        fixed left-0
        bg-surface-50 dark:bg-dark-bg 
        border-r border-surface-200 dark:border-dark-border 
        transition-all duration-300 ease-in-out 
        ${isResizing ? 'select-none' : ''} 
        flex flex-col z-50
        shadow-lg
        ${isMobile ? (isCollapsed ? '-translate-x-full' : 'translate-x-0') : ''}
      `}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <nav className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="p-2">
            {!isMobile && (
              <button
                onClick={onToggleCollapse}
                className={`
                  w-full flex items-center gap-2 p-2 
                  hover:bg-surface-100 dark:hover:bg-dark-hover 
                  rounded-lg mb-3 text-surface-600 dark:text-dark-text 
                  hover:text-aura-600 dark:hover:text-aura-400 
                  transition-colors ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <LayoutGrid size={getIconSize(isCollapsed)} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left font-medium">Views & Filters</span>
                    <ChevronLeft size={getIconSize(isCollapsed)} className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            )}

            {menuItems.map((group) => (
              <div key={group.group} className="mb-4">
                {(!isCollapsed || isMobile) && (
                  <h3 className="text-sm font-semibold text-surface-500 dark:text-dark-text/70 mb-2 px-2">
                    {group.group}
                  </h3>
                )}
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`
                      w-full flex items-center gap-2 p-2 rounded-lg mb-1 
                      transition-all duration-200 touch-manipulation 
                      active:bg-surface-200 dark:active:bg-dark-border
                      ${isCollapsed ? 'justify-center' : ''}
                      ${view === item.id 
                        ? `${theme.colors.light} dark:bg-dark-hover ${theme.colors.text} dark:text-aura-400 font-medium shadow-sm dark:shadow-none` 
                        : 'hover:bg-surface-100 dark:hover:bg-dark-hover text-surface-600 dark:text-dark-text hover:text-aura-600 dark:hover:text-aura-400'
                      }
                    `}
                  >
                    {item.icon(isCollapsed)}
                    {(!isCollapsed || isMobile) && <span className="text-base flex-1">{item.label}</span>}
                  </button>
                ))}
              </div>
            ))}

            {(!isCollapsed || isMobile) && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-surface-500 dark:text-dark-text/70 mb-2 px-2">
                  Settings
                </h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`
                    w-full flex items-center gap-2 p-2 rounded-lg mb-1 
                    transition-all duration-200 touch-manipulation 
                    active:bg-surface-200 dark:active:bg-dark-border
                    ${showSettings 
                      ? `${theme.colors.light} dark:bg-dark-hover ${theme.colors.text} dark:text-aura-400 font-medium shadow-sm dark:shadow-none` 
                      : 'hover:bg-surface-100 dark:hover:bg-dark-hover text-surface-600 dark:text-dark-text hover:text-aura-600 dark:hover:text-aura-400'
                    }
                  `}
                >
                  <Settings size={getIconSize(isCollapsed)} />
                  <span className="flex-1 text-left text-base">Settings</span>
                  <ChevronDown 
                    size={getIconSize(isCollapsed)} 
                    className={`transform transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`} 
                  />
                </button>

                {showSettings && (
                  <div className="mt-2 p-4 bg-white dark:bg-dark-card rounded-lg border border-surface-200 dark:border-dark-border shadow-sm transition-colors duration-200">
                    <div className="mb-4">
                      <h4 className="text-base font-medium text-surface-700 dark:text-dark-text mb-3 flex items-center gap-2">
                        <Palette size={getIconSize(isCollapsed)} />
                        Theme
                      </h4>
                      <ThemePicker
                        selectedTheme={theme}
                        onThemeSelect={setTheme}
                        isDark={isDark}
                        onToggleMode={toggleDarkMode}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {!isCollapsed && !isMobile && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-0 right-0 w-4 h-full -mr-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={`w-0.5 h-8 ${theme.colors.primary} rounded-full shadow-sm`} />
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideMenu;
