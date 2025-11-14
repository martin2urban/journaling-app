export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  folderId?: string; // Optional folder association
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
