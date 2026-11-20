import { useMemo, useState } from 'react';
import { AlertTriangle, Check, ChevronLeft, ExternalLink, Eye, LoaderCircle, ShieldCheck, X } from 'lucide-react';
import type { ContentItem, PublishResult } from '../types';
import { makeSiteHtml } from '../lib/siteHtml';
import { reviewHtml } from '../lib/review';

export default function PublishDialog({ items, onClose }: { items: ContentItem[]; onClose: () => void }) {
  const [stage, setStage] = useState<'review' | 'preview' | 'result'>('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [result, setResult] = useState<PublishResult | null>(null);
  const html = useMemo(() => makeSiteHtml(items), [items]);
  const findings = useMemo(() => reviewHtml(html), [html]);
  const blocked = findings.some((finding) => finding.severity === 'high');

  async function publish() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/publish', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Aible-Editor-Password': passphrase }, body: JSON.stringify({ html }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Publish failed. Check the server configuration and try again.');
      setResult(payload as PublishResult); setStage('result');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not reach the Netlify publish function.'); }
    finally { setLoading(false); }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }}>
    <div className="publish-modal">
      <div className="modal-heading"><div><span className="kicker">PUBLISH WORKFLOW · {stage === 'review' ? '01 / 03' : stage === 'preview' ? '02 / 03' : '03 / 03'}</span><h2>{stage === 'review' ? 'Review before publishing' : stage === 'preview' ? 'Preview your update' : 'Deploy started'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close" disabled={loading}><X size={19} /></button></div>
      {stage === 'review' && <>
        <div className="review-summary"><div className={`review-icon ${blocked ? 'warning' : 'success'}`}>{blocked ? <AlertTriangle size={21} /> : <ShieldCheck size={21} />}</div><div><b>{blocked ? 'Fix these items before publishing' : 'No blocking issues found'}</b><span>Automated checks are a helpful first pass, not a full security audit.</span></div></div>
        <div className="finding-list">{findings.length ? findings.map((finding) => <div className="finding" key={finding.title}><span className={`severity ${finding.severity}`}>{finding.severity}</span><div><b>{finding.title}</b><p>{finding.detail}</p></div></div>) : <div className="clear-state"><span><Check size={15} /></span><div><b>Content checks passed</b><p>No external scripts, inline event handlers, or token patterns detected.</p></div></div>}</div>
        <div className="review-note"><ShieldCheck size={16} /><span>This POC checks a small set of risky patterns. Please review the preview yourself before deploying.</span></div>
        <div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={blocked} onClick={() => setStage('preview')}><Eye size={16} /> Review preview</button></div>
      </>}
      {stage === 'preview' && <>
        <div className="preview-frame"><iframe title="AIBLE website preview" srcDoc={html} sandbox="" /></div>
        {error && <div className="inline-error"><AlertTriangle size={16} />{error}</div>}
        <label className="password-field">Editor passphrase<input type="password" autoComplete="current-password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} placeholder="Enter the shared editor passphrase" /></label>
        <div className="publish-destination"><span className="destination-dot" /> <div><b>Draft deploy</b><span>This creates a preview URL; your production site will stay unchanged.</span></div><span className="destination-label">SAFE</span></div>
        <div className="modal-actions"><button className="secondary-button" onClick={() => { setError(''); setStage('review'); }}><ChevronLeft size={16} /> Back</button><button className="primary-button" disabled={loading} onClick={publish}>{loading ? <LoaderCircle className="spin" size={16} /> : <ExternalLink size={16} />}{loading ? 'Creating draft…' : 'Create draft preview'}</button></div>
      </>}
      {stage === 'result' && result && <div className="result-state"><div className="success-burst"><Check size={24} /></div><h3>Draft preview created.</h3><p>The production site stays unchanged. Review this deploy, then promote it from Netlify when it’s ready.</p><div className="deploy-detail"><span>DEPLOY STATUS</span><b>{result.state}</b></div>{(result.deployUrl || result.siteUrl) && <a href={result.deployUrl || result.siteUrl} target="_blank" rel="noreferrer" className="deploy-link">Open draft preview <ExternalLink size={15} /></a>}<div className="modal-actions"><button className="primary-button" onClick={onClose}>Done</button></div></div>}
    </div>
  </div>;
}
