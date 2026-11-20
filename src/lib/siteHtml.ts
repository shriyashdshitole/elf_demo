import type { ContentItem, SectionKey } from '../types';
import { sections } from '../data/content';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!));

export function makeSiteHtml(items: ContentItem[]) {
  const body = sections.map((section) => {
    const rows = items.filter((item) => item.section === section.id);
    return `<section><p class="eyebrow">${escapeHtml(section.eyebrow)}</p><h2>${escapeHtml(section.label)}</h2><p class="intro">${escapeHtml(section.description)}</p><div class="grid">${rows.map((item) => `<article><small>${escapeHtml(item.meta)}</small><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p></article>`).join('')}</div></section>`;
  }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIBLE · Your AI community</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f7f6f2;color:#231f20;font:16px/1.6 Arial,sans-serif}header{padding:68px max(calc((100vw - 1080px)/2),24px) 72px;background:#221b23;color:#fff}header p{color:#e9b5d4;letter-spacing:.14em;font-size:12px;font-weight:700}header h1{max-width:760px;font-size:clamp(42px,7vw,76px);line-height:1.03;margin:18px 0}header .sub{color:#d8d1d7;max-width:620px}main{max-width:1080px;margin:auto;padding:28px 24px 72px}section{padding:45px 0;border-bottom:1px solid #dfd9dc}.eyebrow,small{color:#81506e;font-size:11px;letter-spacing:.12em;font-weight:700}h2{font-size:32px;margin:6px 0}.intro{color:#6e6870;margin:0 0 22px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}article{padding:22px;background:#fff;border:1px solid #eee8ed;border-radius:14px}h3{font-size:19px;margin:10px 0 6px}article p{color:#706a71;margin:0}footer{max-width:1080px;margin:auto;padding:26px 24px;color:#807980;font-size:13px}
    </style></head><body><header><p>AIBLE · YOUR AI COMMUNITY</p><h1>Curiosity is a team sport.</h1><div class="sub">Explore what’s new, learn from each other, and find your next way to make AI useful.</div></header><main>${body}</main><footer>Made for curious minds. Keep exploring, keep sharing.</footer></body></html>`;
}

export const defaultItem = (section: SectionKey): ContentItem => ({
  id: crypto.randomUUID(), section, title: '', detail: '', meta: 'NEW · JUST ADDED', tone: 'plum',
});

export const esc = escapeHtml;
