import { createHash, timingSafeEqual } from 'node:crypto';

const API = 'https://api.netlify.com/api/v1';
const MAX_HTML_BYTES = 500_000;
const MAX_SOURCE_FILES = 250;
const MAX_TOTAL_BYTES = 45_000_000;

function response(statusCode, body) {
  return { statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify(body) };
}

function inspect(html) {
  const patterns = [
    [/<script\b[^>]*\bsrc\s*=\s*["']https?:\/\//i, 'External script references are blocked.'],
    [/\bon\w+\s*=\s*["']/i, 'Inline event handlers are blocked.'],
    [/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|(?:NETLIFY|GITHUB)_AUTH_TOKEN\s*[:=])/i, 'A credential-like value was found in the page.'],
    [/\bjavascript\s*:/i, 'javascript: URLs are blocked.'],
  ];
  return patterns.filter(([pattern]) => pattern.test(html)).map(([, message]) => message);
}

async function netlify(path, token, init = {}) {
  const result = await fetch(`${API}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  if (!result.ok) {
    const detail = await result.text();
    throw new Error(`Netlify API returned ${result.status}: ${detail.slice(0, 300)}`);
  }
  return result;
}

function encodeFilePath(path) {
  return path.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return response(405, { error: 'Use POST to publish.' });
  const token = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  const editorPassword = process.env.AIBLE_EDITOR_PASSWORD;
  if (!token || !siteId || !editorPassword) return response(503, { error: 'Publishing is not configured. Add the required server-side variables in the Netlify site settings.' });
  const providedPassword = event.headers?.['x-aible-editor-password'] || event.headers?.['X-Aible-Editor-Password'] || '';
  const expected = Buffer.from(editorPassword);
  const provided = Buffer.from(providedPassword);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return response(401, { error: 'Enter the editor passphrase configured for this site.' });

  try {
    const { html } = JSON.parse(event.body || '{}');
    if (typeof html !== 'string' || !html.trim()) return response(400, { error: 'The page content is empty.' });
    if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) return response(413, { error: 'The generated page exceeds the 500 KB POC limit.' });
    const findings = inspect(html);
    if (findings.length) return response(422, { error: `Security review blocked this publish: ${findings.join(' ')}` });

    const listResult = await netlify(`/sites/${encodeURIComponent(siteId)}/files`, token);
    const listed = await listResult.json();
    if (!Array.isArray(listed) || listed.length > MAX_SOURCE_FILES) return response(422, { error: `Expected at most ${MAX_SOURCE_FILES} published files for this POC.` });

    let totalBytes = 0;
    const files = new Map();
    for (const entry of listed) {
      const path = `/${String(entry.path || entry.id || '').replace(/^\/+/, '')}`;
      if (path === '/') continue;
      const raw = await netlify(`/sites/${encodeURIComponent(siteId)}/files/${encodeFilePath(path)}`, token, { headers: { 'content-type': 'application/vnd.bitballoon.v1.raw' } });
      const bytes = Buffer.from(await raw.arrayBuffer());
      totalBytes += bytes.byteLength;
      if (totalBytes > MAX_TOTAL_BYTES) return response(413, { error: 'The existing site is larger than the 45 MB POC limit.' });
      files.set(path, bytes);
    }
    files.set('/index.html', Buffer.from(html, 'utf8'));

    const digests = {};
    for (const [path, bytes] of files) digests[path] = createHash('sha1').update(bytes).digest('hex');
    const create = await netlify(`/sites/${encodeURIComponent(siteId)}/deploys`, token, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ files: digests, draft: true }),
    });
    const deploy = await create.json();
    const required = new Set(deploy.required || []);
    const uploadedHashes = new Set();
    for (const [path, bytes] of files) {
      const digest = digests[path];
      if (!required.has(digest) || uploadedHashes.has(digest)) continue;
      uploadedHashes.add(digest);
      const uploadPath = encodeFilePath(path);
      await netlify(`/deploys/${encodeURIComponent(deploy.id)}/files/${uploadPath}?size=${bytes.byteLength}`, token, {
        method: 'PUT', headers: { 'content-type': 'application/octet-stream' }, body: bytes,
      });
    }
    const status = await netlify(`/deploys/${encodeURIComponent(deploy.id)}`, token);
    const completed = await status.json();
    return response(200, { state: completed.state || deploy.state || 'processing', deployUrl: completed.deploy_url, siteUrl: completed.ssl_url || completed.url });
  } catch (error) {
    console.error('Netlify publish failed:', error instanceof Error ? error.message : 'unknown error');
    return response(502, { error: 'Netlify could not publish this update. Check the site ID, token permissions, and deploy status, then try again.' });
  }
};
