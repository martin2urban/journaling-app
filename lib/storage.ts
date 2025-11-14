import { JournalEntry, Folder } from '@/types/journal';

const STORAGE_KEY = 'journal-entries';

export const storageUtils = {
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  saveEntry: (entry: JournalEntry): void => {
    if (typeof window === 'undefined') return;

    const entries = storageUtils.getEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);

    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.unshift(entry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  deleteEntry: (id: string): void => {
    if (typeof window === 'undefined') return;

    const entries = storageUtils.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getEntry: (id: string): JournalEntry | null => {
    const entries = storageUtils.getEntries();
    return entries.find(e => e.id === id) || null;
  }
};

const FOLDERS_STORAGE_KEY = 'journal-folders';

export const folderUtils = {
  getFolders: (): Folder[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  createFolder: (name: string): Folder => {
    const folder: Folder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      const folders = folderUtils.getFolders();
      folders.push(folder);
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    }

    return folder;
  },

  updateFolder: (id: string, name: string): void => {
    if (typeof window === 'undefined') return;

    const folders = folderUtils.getFolders();
    const folder = folders.find(f => f.id === id);
    if (folder) {
      folder.name = name;
      folder.updatedAt = new Date().toISOString();
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    }
  },

  deleteFolder: (id: string): void => {
    if (typeof window === 'undefined') return;

    // Remove folder
    const folders = folderUtils.getFolders();
    const filtered = folders.filter(f => f.id !== id);
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(filtered));

    // Unfile entries that were in this folder
    const entries = storageUtils.getEntries();
    const entriesInFolder = entries.filter(e => e.folderId === id);
    entriesInFolder.forEach(entry => {
      delete entry.folderId;
      storageUtils.saveEntry(entry);
    });
  },

  getFolder: (id: string): Folder | null => {
    const folders = folderUtils.getFolders();
    return folders.find(f => f.id === id) || null;
  }
};
