// Storage provider interface that can be implemented for different storage solutions
class StorageProvider {
  async save(key, data) { throw new Error('Not implemented'); }
  async load(key) { throw new Error('Not implemented'); }
}

// Local storage implementation
class LocalStorageProvider extends StorageProvider {
  serializeData(data) {
    try {
      // First, convert the data to a string to ensure we're not dealing with JSHandle objects
      const stringified = JSON.stringify(data);
      // Then parse it back to get a clean JavaScript object
      const parsed = JSON.parse(stringified);
      return parsed;
    } catch (error) {
      console.error('Data serialization error:', error);
      return null;
    }
  }

  async save(key, data) {
    try {
      // Special handling for backup timestamp
      if (key === 'kanbanLastBackup') {
        localStorage.setItem(key, data);
        console.log(`Saved backup timestamp: ${data}`);
        return true;
      }

      // For regular state data
      const cleanData = this.serializeData(data);
      if (!cleanData) {
        console.error('Failed to serialize data');
        return false;
      }

      // Log the actual data structure
      console.log(`Saving to localStorage key '${key}':`, JSON.stringify(cleanData, null, 2));

      const serialized = JSON.stringify(cleanData);
      localStorage.setItem(key, serialized);

      // Verify the save was successful
      const saved = localStorage.getItem(key);
      const success = saved === serialized;
      
      if (success) {
        console.log(`Successfully saved ${(serialized.length / 1024).toFixed(2)}KB to localStorage key '${key}'`);
        // Double check the saved data can be parsed
        try {
          const parsed = JSON.parse(saved);
          console.log('Verified saved data can be parsed:', parsed);
        } catch (error) {
          console.error('Failed to verify saved data:', error);
          return false;
        }
      } else {
        console.error(`Failed to verify save to localStorage key '${key}'`);
      }
      
      return success;
    } catch (error) {
      console.error(`LocalStorage save error for key '${key}':`, error);
      return false;
    }
  }

  async load(key) {
    try {
      // Special handling for backup timestamp
      if (key === 'kanbanLastBackup') {
        const timestamp = localStorage.getItem(key);
        console.log(`Loaded backup timestamp: ${timestamp}`);
        return timestamp ? parseInt(timestamp) : 0;
      }

      // For regular state data
      console.log(`Attempting to load from localStorage key '${key}'`);
      const data = localStorage.getItem(key);
      
      if (!data) {
        console.log(`No data found in localStorage for key '${key}'`);
        return null;
      }

      try {
        const parsed = JSON.parse(data);
        console.log(`Successfully loaded from localStorage key '${key}':`, JSON.stringify(parsed, null, 2));
        return parsed;
      } catch (parseError) {
        console.error(`Failed to parse data from localStorage key '${key}':`, parseError);
        // If parse fails, try to clear the corrupted data
        localStorage.removeItem(key);
        console.log(`Cleared corrupted data from localStorage key '${key}'`);
        return null;
      }
    } catch (error) {
      console.error(`LocalStorage load error for key '${key}':`, error);
      return null;
    }
  }
}

// Storage manager that handles multiple storage providers
class StorageManager {
  constructor() {
    this.providers = [new LocalStorageProvider()];
    this.STORAGE_KEY = 'kanbanState';
    this.BACKUP_KEY = 'kanbanStateBackup';
    this.LAST_BACKUP_KEY = 'kanbanLastBackup';
    this.BACKUP_INTERVAL = 1000 * 60 * 5; // 5 minutes
    this.savePromise = Promise.resolve(); // Track ongoing save operations
    this.pendingSave = false; // Track if there's a pending save
    console.log('Storage manager initialized with keys:', {
      main: this.STORAGE_KEY,
      backup: this.BACKUP_KEY,
      lastBackup: this.LAST_BACKUP_KEY
    });

    // Handle HMR for development
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        // Save state immediately when HMR triggers
        if (this.pendingSave) {
          this.forceSave();
        }
      });
    }
  }

  isValidState(state) {
    try {
      if (!state || typeof state !== 'object') {
        console.log('Invalid state: not an object');
        return false;
      }

      // Validate projects (required)
      if (!Array.isArray(state.projects)) {
        console.log('Invalid state: projects is not an array');
        return false;
      }

      // Validate projects structure
      const hasValidProjects = state.projects.every(project => {
        const hasRequiredProps = project.id && 
          project.title && 
          Array.isArray(project.columns);

        if (!hasRequiredProps) {
          console.log('Invalid project structure:', project);
          return false;
        }

        return project.columns.every(column => {
          const hasColumnProps = column.id && 
            column.title && 
            Array.isArray(column.tasks);

          if (!hasColumnProps) {
            console.log('Invalid column structure:', column);
            return false;
          }

          return column.tasks.every(task => {
            const hasTaskProps = task.id && task.title;
            if (!hasTaskProps) {
              console.log('Invalid task structure:', task);
              return false;
            }
            return true;
          });
        });
      });

      if (!hasValidProjects) {
        console.log('Projects validation failed');
        return false;
      }

      // Validate notes (optional)
      if (state.notes !== undefined) {
        if (!Array.isArray(state.notes)) {
          console.log('Invalid state: notes is not an array');
          return false;
        }

        const hasValidNotes = state.notes.every(note => {
          const hasRequiredProps = note.id && 
            (note.title || note.content) && 
            note.type && 
            note.createdAt && 
            note.updatedAt;

          if (!hasRequiredProps) {
            console.log('Invalid note structure:', note);
            return false;
          }

          if (note.type === 'checklist' && !Array.isArray(note.items)) {
            console.log('Invalid checklist note: items is not an array');
            return false;
          }

          return true;
        });

        if (!hasValidNotes) {
          console.log('Notes validation failed');
          return false;
        }
      }

      console.log('State validation successful');
      return true;
    } catch (error) {
      console.error('State validation error:', error);
      return false;
    }
  }

  // ... (keep all other methods unchanged)
}

const storageManager = new StorageManager();

export const saveState = (state) => storageManager.saveState(state);
export const loadState = () => storageManager.loadState();
export const getStorageManager = () => storageManager;
