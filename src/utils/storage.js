// Storage provider interface that can be implemented for different storage solutions
class StorageProvider {
  async save(key, data) { throw new Error('Not implemented'); }
  async load(key) { throw new Error('Not implemented'); }
}

// Local storage implementation
class LocalStorageProvider extends StorageProvider {
  async save(key, data) {
    try {
      console.log('Saving state:', data);
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      // Verify the save was successful
      const saved = localStorage.getItem(key);
      return saved === serialized;
    } catch (error) {
      console.error('LocalStorage save error:', error);
      return false;
    }
  }

  async load(key) {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        console.log('No saved state found');
        return null;
      }
      const parsed = JSON.parse(data);
      console.log('Loaded state:', parsed);
      return parsed;
    } catch (error) {
      console.error('LocalStorage load error:', error);
      return null;
    }
  }
}

// Storage manager that handles multiple storage providers
class StorageManager {
  constructor() {
    this.providers = [new LocalStorageProvider()];
    this.STORAGE_KEY = 'kanbanState';  // Changed key to be more specific
    this.BACKUP_KEY = 'kanbanStateBackup';
    this.LAST_BACKUP_KEY = 'kanbanLastBackup';
    this.BACKUP_INTERVAL = 1000 * 60 * 5; // Reduced to 5 minutes for more frequent backups
  }

  isValidState(state) {
    try {
      if (!state || typeof state !== 'object') {
        console.log('Invalid state: not an object');
        return false;
      }
      if (!Array.isArray(state.projects)) {
        console.log('Invalid state: projects is not an array');
        return false;
      }
      return true;
    } catch (error) {
      console.error('State validation error:', error);
      return false;
    }
  }

  async createBackup(state) {
    try {
      const success = await this.providers[0].save(this.BACKUP_KEY, state);
      if (success) {
        await this.providers[0].save(this.LAST_BACKUP_KEY, Date.now().toString());
        console.log('Backup created successfully');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  shouldBackup() {
    const lastBackup = parseInt(localStorage.getItem(this.LAST_BACKUP_KEY) || '0');
    return Date.now() - lastBackup >= this.BACKUP_INTERVAL;
  }

  async saveState(state) {
    if (!this.isValidState(state)) {
      console.error('Invalid state structure:', state);
      return false;
    }

    let savedSuccessfully = false;
    for (const provider of this.providers) {
      try {
        const success = await provider.save(this.STORAGE_KEY, state);
        if (success) {
          savedSuccessfully = true;
          console.log('State saved successfully');
        }
      } catch (error) {
        console.error('Error saving state:', error);
      }
    }

    if (savedSuccessfully && this.shouldBackup()) {
      await this.createBackup(state);
    }

    return savedSuccessfully;
  }

  async loadState() {
    for (const provider of this.providers) {
      try {
        // Try main storage first
        const state = await provider.load(this.STORAGE_KEY);
        if (state && this.isValidState(state)) {
          console.log('Successfully loaded valid state');
          return state;
        }

        // Try backup if main storage failed
        const backupState = await provider.load(this.BACKUP_KEY);
        if (backupState && this.isValidState(backupState)) {
          console.log('Recovered state from backup');
          await this.saveState(backupState);
          return backupState;
        }
      } catch (error) {
        console.error('Error loading state:', error);
      }
    }

    console.log('No valid state found');
    return undefined;
  }

  addStorageProvider(provider) {
    if (provider instanceof StorageProvider) {
      this.providers.push(provider);
    }
  }
}

const storageManager = new StorageManager();

export const saveState = (state) => storageManager.saveState(state);
export const loadState = () => storageManager.loadState();
export const getStorageManager = () => storageManager;
