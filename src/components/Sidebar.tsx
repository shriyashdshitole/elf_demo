import { BookOpen, CalendarDays, ChartNoAxesColumnIncreasing, Compass, Gem, LayoutDashboard, LibraryBig, Megaphone, Sparkles, Trophy, UsersRound } from 'lucide-react';
import type { SectionKey } from '../types';

const nav = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'champions', label: 'Champion stories', icon: UsersRound },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'learning', label: 'Learning paths', icon: BookOpen },
  { id: 'resources', label: 'Resources', icon: LibraryBig },
] as const;

export type ViewKey = 'overview' | SectionKey;

export default function Sidebar({ active, onNavigate }: { active: ViewKey; onNavigate: (view: ViewKey) => void }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><Gem size={19} strokeWidth={2.2} /></div><div><strong>AIBLE</strong><span>STUDIO</span></div></div>
    <div className="workspace-switch"><div className="workspace-avatar">e</div><div><small>WORKSPACE</small><b>e.l.f. Beauty</b></div><span className="chevron">⌄</span></div>
    <div className="nav-label">WORKSPACE</div>
    <nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onNavigate(id)}><Icon size={17} /><span>{label}</span>{id === 'announcements' && <i className="nav-dot" />}</button>)}</nav>
    <div className="sidebar-bottom"><div className="nav-label">YOUR SPACE</div><button className="nav-item"><Compass size={17} /><span>Explore AIBLE</span></button><button className="nav-item"><CalendarDays size={17} /><span>Events calendar</span></button><div className="sidebar-card"><Sparkles size={17} /><b>Ideas begin here.</b><span>Share a small experiment. Inspire a big one.</span><button onClick={() => onNavigate('announcements')}>Add an update <ChartNoAxesColumnIncreasing size={14} /></button></div><div className="user-row"><div className="user-avatar">AS</div><div><b>Agam Singh</b><small>Workspace editor</small></div><span className="user-menu">···</span></div></div>
  </aside>;
}
