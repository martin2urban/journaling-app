'use client';

import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types/journal';
import { storageUtils } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedEntries = storageUtils.getEntries();
    setEntries(loadedEntries);
    if (loadedEntries.length > 0) {
      setSelectedEntryId(loadedEntries[0].id);
    }
  }, []);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: 'blue',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storageUtils.saveEntry(newEntry);
    setEntries([newEntry, ...entries]);
    setSelectedEntryId(newEntry.id);
  };

  const handleSaveEntry = (updatedEntry: JournalEntry) => {
    storageUtils.saveEntry(updatedEntry);
    setEntries(entries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      storageUtils.deleteEntry(id);
      const newEntries = entries.filter(e => e.id !== id);
      setEntries(newEntries);

      if (selectedEntryId === id) {
        setSelectedEntryId(newEntries.length > 0 ? newEntries[0].id : null);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        entries={entries}
        selectedEntryId={selectedEntryId}
        onSelectEntry={setSelectedEntryId}
        onNewEntry={handleNewEntry}
        onDeleteEntry={handleDeleteEntry}
      />
      <Editor
        entry={selectedEntry}
        onSave={handleSaveEntry}
      />
    </div>
  );
}
