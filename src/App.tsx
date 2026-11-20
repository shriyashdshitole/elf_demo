import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Bell, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Eye, Plus, Search, Send, Sparkles, WandSparkles } from 'lucide-react';
import Sidebar, { type ViewKey } from './components/Sidebar';
import ContentCard from './components/ContentCard';
import ItemEditor from './components/ItemEditor';
import PublishDialog from './components/PublishDialog';
import { sections } from './data/content';
import { defaultItem } from './lib/siteHtml';
import { loadContent, saveContent } from './lib/storage';
import type { ContentItem, SectionKey } from './types';

const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase();

export default function App() {
  const [active, setActive] = useState<ViewKey>('overview');
  const [items, setItems] = useState<ContentItem[]>(loadContent);
  const [draft, setDraft] = useState<ContentItem | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { saveContent(items); }, [items]);
  const selectedSection = sections.find((section) => section.id === active);
  const filteredItems = useMemo(() => items.filter((item) => item.section === active && `${item.title} ${item.detail} ${item.meta}`.toLowerCase().includes(query.toLowerCase())), [items, active, query]);
  const announcementCount = items.filter((item) => item.section === 'announcements').length;
  const latest = items.filter((item) => item.section === 'announcements').slice(0, 2);

  function openNew(section: SectionKey = active === 'overview' ? 'announcements' : active) { setDraft(defaultItem(section)); }
  function persistDraft(next: ContentItem) { setDraft(next); }
  function saveDraft(item: ContentItem) {
    setItems((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? item : entry) : [item, ...current]);
    setDraft(null); setSaved(true); window.setTimeout(() => setSaved(false), 2200);
  }
  function removeDraft(id: string) { setItems((current) => current.filter((item) => item.id !== id)); setDraft(null); }

  return <div className="app-shell">
    <Sidebar active={active} onNavigate={setActive} />
    <main className="main-shell">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><b>{selectedSection?.label || 'Overview'}</b></div><div className="topbar-actions"><span className="date-chip"><Clock3 size={14} />{today}</span><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><button className="help-button"><CircleHelp size={16} /> Help center</button></div></header>
      <div className="page-content">
        {active === 'overview' ? <>
          <div className="welcome-row"><div><div className="kicker">{todayLabel} <span className="kicker-spark">✦</span> YOUR SPACE TO MAKE AI REAL</div><h1>Good morning, Agam<span className="wave">✳</span></h1><p className="subhead">A little progress goes a long way. What will you share with the team today?</p></div><button className="primary-button create-button" onClick={() => openNew()}><Plus size={17} /> Create an update</button></div>
          <section className="feature-banner"><div className="feature-copy"><span className="feature-label"><Sparkles size={14} /> YOUR AIBLE MOMENT</span><h2>Curiosity is a team sport.</h2><p>Every experiment, question, and small win helps us learn together. Make space for the next one.</p><button className="banner-link" onClick={() => setActive('champions')}>Meet the community <ArrowUpRight size={15} /></button></div><div className="feature-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="orbit-star star-one">✦</span><span className="orbit-star star-two">✳</span><div className="orbit-center"><WandSparkles size={29} /></div><span className="art-pill pill-one">ideas</span><span className="art-pill pill-two">together</span></div></section>
          <section className="metric-grid"><div className="metric-card"><div className="metric-icon peach"><MegaphoneMini /></div><span className="metric-label">FRESH UPDATES</span><div className="metric-value">{announcementCount}<span className="metric-change"><ArrowUpRight size={14} /> 2 new</span></div><span className="metric-foot">Announcements this week</span></div><div className="metric-card"><div className="metric-icon lavender"><PeopleMini /></div><span className="metric-label">CHAMPIONS</span><div className="metric-value">{items.filter((item) => item.section === 'champions').length}<span className="metric-change neutral">✨ growing</span></div><span className="metric-foot">Sharing what’s possible</span></div><div className="metric-card"><div className="metric-icon mint"><TrophyMini /></div><span className="metric-label">COMMUNITY ENERGY</span><div className="metric-value">82<span className="metric-suffix">%</span><span className="metric-change"><ArrowUpRight size={14} /> 8%</span></div><span className="metric-foot">Engagement is up this month</span></div></section>
          <section className="section-heading"><div><div className="kicker">GOOD THINGS IN MOTION</div><h2>Fresh from the community</h2></div><button className="text-link" onClick={() => setActive('announcements')}>See all updates <ArrowUpRight size={15} /></button></section>
          <section className="overview-updates">{latest.map((item) => <ContentCard key={item.id} item={item} onEdit={setDraft} />)}<button className="new-card" onClick={() => openNew('announcements')}><div><Plus size={19} /></div><b>Share something new</b><span>A win, an idea, a question — it all counts.</span><small>CREATE UPDATE <ArrowUpRight size={12} /></small></button></section>
          <section className="section-heading lower-heading"><div><div className="kicker">AIBLE, AT A GLANCE</div><h2>Keep exploring</h2></div><span className="muted-label">YOUR COMMUNITY HUB</span></section>
          <section className="explore-grid">{sections.slice(1).map((section, index) => <button key={section.id} className={`explore-card explore-${index}`} onClick={() => setActive(section.id)}><span className="explore-number">0{index + 1}</span><span className="explore-icon">{index === 0 ? '✦' : index === 1 ? '↗' : index === 2 ? '◎' : '✳'}</span><b>{section.label}</b><span>{items.filter((item) => item.section === section.id).length} pieces to explore</span><ChevronRight size={16} /></button>)}</section>
          <div className="footnote-row"><span><Check size={14} /> Your edits are saved in this browser</span><button onClick={() => setPublishOpen(true)}><Eye size={14} /> Preview & publish</button></div>
        </> : <>
          <div className="section-page-intro"><div className="kicker">{selectedSection?.eyebrow}</div><h1>{selectedSection?.label}</h1><p className="subhead">{selectedSection?.description}</p><div className="section-actions"><div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${selectedSection?.label.toLowerCase()}`} /></div><button className="secondary-button filter-button"><ChevronDown size={15} /> All content</button><button className="primary-button" onClick={() => openNew()}><Plus size={16} /> Add content</button></div></div>
          <div className="section-count"><span>{filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}</span><span>Last edited just now <ChevronDown size={14} /></span></div>
          {filteredItems.length ? <div className="content-grid">{filteredItems.map((item) => <ContentCard key={item.id} item={item} onEdit={setDraft} />)}</div> : <div className="empty-state"><div>✦</div><h3>{query ? 'No matches yet' : 'A little space for something new'}</h3><p>{query ? 'Try another search, or clear the field to see everything.' : 'Add the first piece of content to this section.'}</p><button className="primary-button" onClick={() => openNew()}><Plus size={16} /> Add content</button></div>}
        </>}
      </div>
      {saved && <div className="toast"><Check size={15} /> Saved to this browser</div>}
      <button className="publish-fab" onClick={() => setPublishOpen(true)}><Send size={16} /> Preview & publish</button>
    </main>
    {draft && <ItemEditor item={draft} onChange={persistDraft} onSave={saveDraft} onDelete={removeDraft} onClose={() => setDraft(null)} />}
    {publishOpen && <PublishDialog items={items} onClose={() => setPublishOpen(false)} />}
  </div>;
}

function MegaphoneMini() { return <span className="mini-emoji">◖</span>; }
function PeopleMini() { return <span className="mini-emoji">◉</span>; }
function TrophyMini() { return <span className="mini-emoji">✳</span>; }
