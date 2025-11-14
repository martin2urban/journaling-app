'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { JournalEntry } from '@/types/journal';
import ShareButtons from './ShareButtons';

interface EditorProps {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
}

export default function Editor({ entry, onSave }: EditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry) return;

    const updatedEntry: JournalEntry = {
      ...entry,
      title,
      content,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedEntry);
  };

  // Auto-save on content change with debounce
  useEffect(() => {
    if (!entry) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <svg
            className="w-24 h-24 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg">Select an entry or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-screen">
      {/* Toolbar */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="text-2xl font-bold text-gray-900 border-none outline-none bg-transparent flex-1"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPreview
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
        {/* Share Buttons */}
        <ShareButtons entry={entry} />
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-y-auto">
        {isPreview ? (
          <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{content || '*No content yet*'}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts... (Markdown supported)"
            className="w-full h-full px-8 py-8 text-gray-900 resize-none outline-none font-mono text-base leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}
