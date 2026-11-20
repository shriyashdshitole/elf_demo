import type { ContentItem } from '../types';
import { initialContent } from '../data/content';

const KEY = 'aible-studio-content-v1';
export function loadContent(): ContentItem[] {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as ContentItem[];
  } catch { /* Fall back to the starter content if local storage is unavailable. */ }
  return initialContent;
}
export function saveContent(items: ContentItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* Editing remains available for this session. */ }
}
