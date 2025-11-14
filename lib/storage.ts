import { JournalEntry } from '@/types/journal';

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
