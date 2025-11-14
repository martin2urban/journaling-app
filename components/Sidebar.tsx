'use client';

import { useState } from 'react';
import { JournalEntry, Folder } from '@/types/journal';
import { formatDistanceToNow } from 'date-fns';
import { exportUtils } from '@/lib/export';

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  selectedEntryId: string | null;
  selectedFolderId: string | null;
  onSelectEntry: (id: string) => void;
  onSelectFolder: (id: string | null) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onUpdateFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  onAssignEntryToFolder: (entryId: string, folderId: string | undefined) => void;
}

export default function Sidebar({
  entries,
  folders,
  selectedEntryId,
  selectedFolderId,
  onSelectEntry,
  onSelectFolder,
  onNewEntry,
  onDeleteEntry,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onAssignEntryToFolder
}: SidebarProps) {
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(folders.map(f => f.id)));

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleUpdateFolder = () => {
    if (editingFolderName.trim() && editingFolderId) {
      onUpdateFolder(editingFolderId, editingFolderName);
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };

  const toggleFolderExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getEntriesInFolder = (folderId: string) => {
    return entries.filter(e => e.folderId === folderId);
  };

  const getUnfiledEntries = () => {
    return entries.filter(e => !e.folderId);
  };

  const renderEntry = (entry: JournalEntry) => (
    <div
      key={entry.id}
      className={`group relative px-4 py-3 cursor-pointer transition-colors border-l-4 ${
        selectedEntryId === entry.id
          ? 'bg-blue-50 border-l-blue-600'
          : 'border-l-transparent hover:bg-gray-100'
      }`}
      onClick={() => onSelectEntry(entry.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {entry.title || 'Untitled'}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDistanceToNow(new Date(entry.updatedAt), {
              addSuffix: true
            })}
          </p>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              exportUtils.exportEntry(entry);
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-600 transition-opacity"
            aria-label="Export entry"
            title="Export as Markdown"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteEntry(entry.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
            aria-label="Delete entry"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Journal</h1>
        <button
          onClick={onNewEntry}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          + New Entry
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No entries yet. Create your first one!
          </div>
        ) : (
          <>
            {/* Folders Section */}
            {folders.length > 0 && (
              <div className="border-b border-gray-200">
                <div className="px-4 py-3">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Folders
                  </h3>
                  <div className="space-y-1">
                    {folders.map((folder) => (
                      <div key={folder.id}>
                        <div
                          className={`group flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
                            selectedFolderId === folder.id
                              ? 'bg-blue-100 text-blue-900'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div
                            className="flex items-center flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              onSelectFolder(selectedFolderId === folder.id ? null : folder.id);
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFolderExpanded(folder.id);
                              }}
                              className="mr-1 text-gray-400"
                            >
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  expandedFolders.has(folder.id) ? 'rotate-90' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                            {editingFolderId === folder.id ? (
                              <input
                                autoFocus
                                type="text"
                                value={editingFolderName}
                                onChange={(e) => setEditingFolderName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleUpdateFolder();
                                  if (e.key === 'Escape') {
                                    setEditingFolderId(null);
                                    setEditingFolderName('');
                                  }
                                }}
                                onBlur={handleUpdateFolder}
                                className="flex-1 px-2 py-1 bg-white border border-blue-300 rounded text-sm"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <svg
                                className="w-4 h-4 mr-2 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                              </svg>
                            )}
                            {editingFolderId !== folder.id && (
                              <span className="text-sm font-medium truncate">
                                {folder.name}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {editingFolderId !== folder.id && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFolderId(folder.id);
                                    setEditingFolderName(folder.name);
                                  }}
                                  className="text-gray-400 hover:text-blue-600"
                                  title="Rename folder"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteFolder(folder.id);
                                  }}
                                  className="text-gray-400 hover:text-red-600"
                                  title="Delete folder"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Entries in Folder */}
                        {expandedFolders.has(folder.id) && (
                          <div className="bg-gray-100 pl-6">
                            {getEntriesInFolder(folder.id).length === 0 ? (
                              <div className="px-4 py-2 text-xs text-gray-400">
                                No entries
                              </div>
                            ) : (
                              getEntriesInFolder(folder.id).map((entry) =>
                                renderEntry(entry)
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* New Folder Input */}
            {showNewFolderInput ? (
              <div className="px-4 py-3 border-b border-gray-200">
                <input
                  autoFocus
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder();
                    if (e.key === 'Escape') {
                      setShowNewFolderInput(false);
                      setNewFolderName('');
                    }
                  }}
                  onBlur={() => {
                    if (!newFolderName.trim()) {
                      setShowNewFolderInput(false);
                    }
                  }}
                  placeholder="Folder name..."
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded text-sm"
                />
              </div>
            ) : (
              <div className="px-4 py-2">
                <button
                  onClick={() => setShowNewFolderInput(true)}
                  className="w-full text-left text-sm text-gray-600 hover:text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  + New Folder
                </button>
              </div>
            )}

            {/* Unfiled Entries Section */}
            {getUnfiledEntries().length > 0 && (
              <div>
                <div className="px-4 py-3 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Unfiled
                  </h3>
                </div>
                <div>
                  {getUnfiledEntries().map((entry) =>
                    renderEntry(entry)
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Export All Button */}
      {entries.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => exportUtils.exportAllAsSingleFile(entries)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export All
          </button>
        </div>
      )}
    </div>
  );
}
