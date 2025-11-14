import { JournalEntry } from '@/types/journal';

export const exportUtils = {
  /**
   * Export a single entry as a markdown file download
   */
  exportEntry: (entry: JournalEntry): void => {
    const content = formatEntryAsMarkdown(entry);
    const filename = generateFilename(entry);
    downloadFile(content, filename);
  },

  /**
   * Export all entries as separate markdown files in a zip
   */
  exportAllEntries: async (entries: JournalEntry[]): Promise<void> => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }

    // For browser-based export, we'll download each file individually
    // A proper implementation would use JSZip to create a zip file
    for (const entry of entries) {
      exportUtils.exportEntry(entry);
      // Small delay to avoid browser blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  },

  /**
   * Export all entries as a single combined markdown file
   */
  exportAllAsSingleFile: (entries: JournalEntry[]): void => {
    if (entries.length === 0) {
      alert('No entries to export');
      return;
    }

    const content = entries
      .map(entry => formatEntryAsMarkdown(entry))
      .join('\n\n---\n\n');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `journal-export-${timestamp}.md`;
    downloadFile(content, filename);
  }
};

/**
 * Format a journal entry as markdown
 */
function formatEntryAsMarkdown(entry: JournalEntry): string {
  const date = new Date(entry.createdAt).toLocaleString();
  const updated = new Date(entry.updatedAt).toLocaleString();

  return `# ${entry.title || 'Untitled Entry'}

**Created:** ${date}
**Updated:** ${updated}

${entry.content}
`;
}

/**
 * Generate a filename for an entry
 */
function generateFilename(entry: JournalEntry): string {
  const date = new Date(entry.createdAt).toISOString().split('T')[0];
  const title = (entry.title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${date}-${title}.md`;
}

/**
 * Trigger a file download in the browser
 */
function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
