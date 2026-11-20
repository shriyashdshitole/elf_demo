export type SectionKey = 'announcements' | 'champions' | 'leaderboard' | 'learning' | 'resources';

export interface ContentItem {
  id: string;
  section: SectionKey;
  title: string;
  detail: string;
  meta: string;
  tone: 'plum' | 'orange' | 'green' | 'blue';
}

export interface PublishResult {
  state: string;
  deployUrl?: string;
  siteUrl?: string;
}
