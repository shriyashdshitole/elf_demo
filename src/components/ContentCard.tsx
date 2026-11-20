import { ArrowUpRight, MoreHorizontal, Pencil, Star } from 'lucide-react';
import type { ContentItem } from '../types';

const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

export default function ContentCard({ item, onEdit }: { item: ContentItem; onEdit: (item: ContentItem) => void }) {
  const isChampion = item.section === 'champions';
  const isLeaderboard = item.section === 'leaderboard';
  const isLearning = item.section === 'learning';
  return <article className={`content-card ${item.tone} ${isLeaderboard ? 'rank-card' : ''}`}>
    <div className="card-top"><span className={`tag ${item.tone}`}>{item.meta}</span><button className="icon-button subtle" aria-label={`Edit ${item.title}`} onClick={() => onEdit(item)}><MoreHorizontal size={19} /></button></div>
    {isChampion && <div className={`person-mark ${item.tone}`}>{initials(item.title)}</div>}
    {isLeaderboard && <div className="rankline"><span>{item.meta === '01' ? <Star size={16} fill="currentColor" /> : `#${item.meta}`}</span><span className={`person-mark mini ${item.tone}`}>{initials(item.title)}</span></div>}
    {isLearning && <div className={`learning-art ${item.tone}`}><BookOpenIcon /></div>}
    <h3>{item.title || 'Untitled update'}</h3><p>{item.detail || 'Add a short description to bring this item to life.'}</p>
    <button className="card-link" onClick={() => onEdit(item)}>{isLearning ? 'Edit learning path' : isChampion ? 'Edit story' : isLeaderboard ? 'Edit entry' : 'Edit update'} <ArrowUpRight size={15} /></button>
  </article>;
}

function BookOpenIcon() { return <Pencil size={19} />; }
