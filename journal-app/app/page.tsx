'use client';

import { useState, useEffect } from 'react';
import { JournalEntry, Folder } from '@/types/journal';
import { storageUtils, folderUtils } from '@/lib/storage';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedEntries = storageUtils.getEntries();
    const loadedFolders = folderUtils.getFolders();
    setEntries(loadedEntries);
    setFolders(loadedFolders);
    if (loadedEntries.length > 0) {
      setSelectedEntryId(loadedEntries[0].id);
    }
  }, []);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(selectedFolderId && { folderId: selectedFolderId })
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

  const handleCreateFolder = (name: string) => {
    const newFolder = folderUtils.createFolder(name);
    setFolders([...folders, newFolder]);
  };

  const handleUpdateFolder = (id: string, name: string) => {
    folderUtils.updateFolder(id, name);
    setFolders(folders.map(f => f.id === id ? { ...f, name, updatedAt: new Date().toISOString() } : f));
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm('Are you sure you want to delete this folder? Entries will be moved to unfiled.')) {
      folderUtils.deleteFolder(id);
      setFolders(folders.filter(f => f.id !== id));
      setEntries(entries.map(e => e.folderId === id ? { ...e, folderId: undefined } : e));
      if (selectedFolderId === id) {
        setSelectedFolderId(null);
      }
    }
  };

  const handleAssignEntryToFolder = (entryId: string, folderId: string | undefined) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      const updatedEntry = { ...entry, folderId };
      storageUtils.saveEntry(updatedEntry);
      setEntries(entries.map(e => e.id === entryId ? updatedEntry : e));
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
        folders={folders}
        selectedEntryId={selectedEntryId}
        selectedFolderId={selectedFolderId}
        onSelectEntry={setSelectedEntryId}
        onSelectFolder={setSelectedFolderId}
        onNewEntry={handleNewEntry}
        onDeleteEntry={handleDeleteEntry}
        onCreateFolder={handleCreateFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
        onAssignEntryToFolder={handleAssignEntryToFolder}
      />
      <Editor
        entry={selectedEntry}
        folders={folders}
        onSave={handleSaveEntry}
        onAssignToFolder={handleAssignEntryToFolder}
      />
    </div>
  );
}
