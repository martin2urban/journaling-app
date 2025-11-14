'use client';

import { JournalEntry } from '@/types/journal';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (id: string) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
}

export default function Sidebar({
  entries,
  selectedEntryId,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry
}: SidebarProps) {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Journal</h1>
        <button
          onClick={onNewEntry}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + New Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No entries yet. Create your first one!
          </div>
        ) : (
          <div className="py-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`group relative px-6 py-4 cursor-pointer transition-colors border-l-4 ${
                  selectedEntryId === entry.id
                    ? 'bg-blue-50 border-l-blue-600'
                    : 'border-l-transparent hover:bg-gray-100'
                }`}
                onClick={() => onSelectEntry(entry.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {entry.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(entry.updatedAt), {
                        addSuffix: true
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEntry(entry.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-600 transition-opacity"
                    aria-label="Delete entry"
                  >
                    <svg
                      className="w-5 h-5"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
