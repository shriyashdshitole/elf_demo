export interface Finding { severity: 'high' | 'medium'; title: string; detail: string }

export function reviewHtml(html: string): Finding[] {
  const findings: Finding[] = [];
  if (/<script\b[^>]*\bsrc\s*=\s*["']https?:\/\//i.test(html)) findings.push({ severity: 'high', title: 'External script reference', detail: 'Review external scripts before publishing. A script can execute code in every visitor’s browser.' });
  if (/\bon\w+\s*=\s*["']/i.test(html)) findings.push({ severity: 'high', title: 'Inline event handler', detail: 'Inline event handlers can execute JavaScript. Remove them or review the exact behavior.' });
  if (/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|(?:NETLIFY|GITHUB)_AUTH_TOKEN\s*[:=])/i.test(html)) findings.push({ severity: 'high', title: 'Possible credential in content', detail: 'A token-like string or credential variable was found. Remove it and rotate the secret if it was real.' });
  if (/\bjavascript\s*:/i.test(html)) findings.push({ severity: 'high', title: 'JavaScript URL', detail: 'Links using javascript: can execute code when clicked.' });
  if (/href\s*=\s*["']http:\/\//i.test(html)) findings.push({ severity: 'medium', title: 'Insecure external link', detail: 'Update external links to HTTPS where the destination supports it.' });
  return findings;
}
