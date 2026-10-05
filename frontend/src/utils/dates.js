const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const pad = (n) => String(n).padStart(2, '0');

/** 'YYYY-MM' from "2025-11" or "Nov 2025"; '' if it can't be read. */
export function toMonth(text) {
  const s = String(text || '').trim();
  if (/^\d{4}-\d{2}$/.test(s)) return s;
  const m = s.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/);
  if (m) { const i = MON.indexOf(m[1].toLowerCase()); if (i >= 0) return `${m[2]}-${pad(i + 1)}`; }
  return '';
}
const yearOf = (t) => (String(t || '').match(/\b(?:19|20)\d{2}\b/) || [])[0] || '';

/** Sortable number (months since year 0); 0 means unknown. */
export function monthKey(text) {
  const mo = toMonth(text);
  if (mo) { const [y, m] = mo.split('-').map(Number); return y * 12 + m; }
  const y = yearOf(text);
  return y ? Number(y) * 12 + 12 : 0;
}

export function fmtMonth(v) {
  const mo = toMonth(v);
  if (!mo) return String(v || '');
  const [y, m] = mo.split('-');
  const name = MON[+m - 1];
  return `${name[0].toUpperCase()}${name.slice(1)} ${y}`;
}

/** Reads "Nov 2025 – Feb 2026" / "Jan 2027 – Present" into { start, end, current }. */
export function parsePeriod(period) {
  const s = String(period || '');
  const found = [...s.matchAll(/[A-Za-z]{3}[a-z]*\.?\s+\d{4}/g)].map((m) => toMonth(m[0])).filter(Boolean);
  const current = /present|current|now|ongoing/i.test(s);
  return { start: found[0] || '', end: current ? '' : found[1] || '', current };
}

export const expRange = (x) => (x.start ? { start: x.start, end: x.end || '', current: !!x.current } : parsePeriod(x.period));

export function periodLabel(x) {
  const r = expRange(x);
  if (!r.start) return x.period || '';
  const end = r.current ? 'Present' : r.end ? fmtMonth(r.end) : '';
  return end ? `${fmtMonth(r.start)} – ${end}` : fmtMonth(r.start);
}

/** Newest first: ongoing roles on top, then by end date, then by start date. */
export function sortExperience(list) {
  const key = (x) => { const r = expRange(x); return [r.current ? 1e9 : monthKey(r.end), monthKey(r.start)]; };
  return [...list].sort((a, b) => {
    const [ae, as] = key(a), [be, bs] = key(b);
    return be - ae || bs - as;
  });
}

/** Newest first; items without a date go last (stable). */
export function sortByDateDesc(list, get) {
  return list.map((x, i) => [x, i]).sort(([a, i], [b, j]) => {
    const ka = monthKey(get(a)), kb = monthKey(get(b));
    if (!ka && !kb) return i - j;
    if (!ka) return 1;
    if (!kb) return -1;
    return kb - ka || i - j;
  }).map(([x]) => x);
}