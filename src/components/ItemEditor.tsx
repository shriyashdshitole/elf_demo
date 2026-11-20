import { X, Save, Trash2 } from 'lucide-react';
import type { ContentItem, SectionKey } from '../types';
import { sections } from '../data/content';

export default function ItemEditor({ item, onChange, onSave, onDelete, onClose }: { item: ContentItem; onChange: (item: ContentItem) => void; onSave: (item: ContentItem) => void; onDelete: (id: string) => void; onClose: () => void }) {
  const section = sections.find((candidate) => candidate.id === item.section)!;
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <form className="editor-modal" onSubmit={(event) => { event.preventDefault(); onSave(item); }}>
      <div className="modal-heading"><div><span className="kicker">{section.eyebrow}</span><h2>{item.title ? 'Edit content' : 'Add content'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div>
      <label>Section<select value={item.section} onChange={(event) => onChange({ ...item, section: event.target.value as SectionKey })}>{sections.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label>
      <label>Title<input autoFocus maxLength={90} value={item.title} onChange={(event) => onChange({ ...item, title: event.target.value })} placeholder="Give this update a clear title" /></label>
      <label>Description<textarea rows={4} maxLength={240} value={item.detail} onChange={(event) => onChange({ ...item, detail: event.target.value })} placeholder="What should people know? Keep it clear and human." /></label>
      <div className="editor-bottom"><label className="meta-field">Label<input maxLength={42} value={item.meta} onChange={(event) => onChange({ ...item, meta: event.target.value })} /></label><div className="tone-select"><span>Card accent</span><div>{(['plum', 'orange', 'green', 'blue'] as const).map((tone) => <button key={tone} type="button" className={`tone-dot ${tone} ${item.tone === tone ? 'selected' : ''}`} aria-label={tone} onClick={() => onChange({ ...item, tone })} />)}</div></div></div>
      <div className="modal-actions">{item.id && <button type="button" className="delete-button" onClick={() => onDelete(item.id)}><Trash2 size={15} /> Remove</button>}<button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit"><Save size={15} /> Done</button></div>
      <p className="editor-hint">Changes are saved in this browser until you publish.</p>
    </form>
  </div>;
}
