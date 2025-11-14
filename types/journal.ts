export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color?: string; // Color code for the entry (e.g., 'red', 'blue', 'green', etc.)
}
