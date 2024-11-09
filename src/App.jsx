import React, { useRef, useState } from 'react';
import AuraBoard from './components/AuraBoard';
import ThemePicker from './components/ThemePicker';
import { ThemeProvider, useTheme } from './hooks/useTheme.jsx';
import { Menu, BookOpen, Settings as SettingsIcon, Grid, X } from 'lucide-react';
import { useClickOutside } from './hooks/useClickOutside';

function AppContent() {
  const { theme, isDark, toggleDarkMode } = useTheme();
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const appSwitcherRef = useRef(null);
  const settingsRef = useRef(null);

  useClickOutside(appSwitcherRef, () => setShowAppSwitcher(false));
  useClickOutside(settingsRef, () => setShowSettings(false));
  
  return (
    <div className={`min-h-screen bg-surface-100 dark:bg-dark-bg transition-colors duration-200
      text-surface-700 dark:text-dark-text`}>
      <header className={`${theme.colors.sample} text-white shadow-aura-md sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-3 py-3 md:px-6 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-white/10 active:bg-white/20 rounded-lg 
                transition-colors touch-manipulation"
              onClick={() => {
                const event = new CustomEvent('toggleMobileMenu');
                window.dispatchEvent(event);
              }}
            >
              <Menu size={20} />
            </button>
            <div className="text-xl md:text-2xl font-bold bg-white bg-opacity-20 rounded-lg px-2.5 py-1 md:px-3">
              aura
            </div>
            <span className="text-xs md:text-sm font-medium text-white text-opacity-80 hidden sm:inline">
              Task Management
            </span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              className="p-2 md:px-3 md:py-1.5 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20 
                active:bg-opacity-30 transition-colors text-sm font-medium flex items-center gap-2
                touch-manipulation"
            >
              <BookOpen size={18} className="md:hidden" />
              <span className="hidden md:inline">Documentation</span>
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 md:px-3 md:py-1.5 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20 
                active:bg-opacity-30 transition-colors text-sm font-medium flex items-center gap-2
                touch-manipulation"
            >
              <SettingsIcon size={18} className="md:hidden" />
              <span className="hidden md:inline">Settings</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowAppSwitcher(!showAppSwitcher)}
                className="p-2 md:px-3 md:py-1.5 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20 
                  active:bg-opacity-30 transition-colors text-sm font-medium flex items-center gap-2
                  touch-manipulation"
                title="Switch apps"
              >
                <Grid size={18} className="md:hidden" />
                <span className="hidden md:inline">Apps</span>
              </button>
              {showAppSwitcher && (
                <div 
                  ref={appSwitcherRef}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-md 
                    shadow-aura-lg z-50 border border-surface-200 dark:border-dark-border py-1"
                >
                  <div className="px-4 py-2 text-sm text-surface-400 dark:text-dark-text font-medium">
                    Coming Soon
                  </div>
                  <div className="px-4 py-2 text-sm text-surface-600 dark:text-dark-text">
                    App switching functionality will be available in a future update.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
          <div 
            ref={settingsRef}
            className="w-full max-w-sm h-full bg-white dark:bg-dark-bg shadow-lg 
              overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-dark-bg border-b 
              border-surface-200 dark:border-dark-border p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-hover
                  transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <ThemePicker 
                selectedTheme={theme}
                onThemeSelect={(newTheme) => {
                  const { setTheme } = useTheme();
                  setTheme(newTheme);
                }}
                isDark={isDark}
                onToggleMode={toggleDarkMode}
              />
            </div>
          </div>
        </div>
      )}

      <AuraBoard />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
