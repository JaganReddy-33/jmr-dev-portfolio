import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOwner } from '../../context/OwnerContext';
import { messagesApi } from '../../services/api';
import { SITE } from '../../config/site';
import '../../styles/inbox.css';

const BASE_TITLE = document.title;
const PALETTE = [['#7c5cff', '#00e0c6'], ['#ff5ca8', '#7c5cff'], ['#00b8ff', '#7c5cff'], ['#ff9a3c', '#ff5ca8'], ['#22c55e', '#00b8ff']];
const hash = (s) => [...(s || '?')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const gradient = (name) => { const [a, b] = PALETTE[hash(name) % PALETTE.length]; return `linear-gradient(135deg,${a},${b})`; };
const initials = (n) => (n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const ago = (iso) => {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
};

/** Pre-filled compose links. Gmail opens in your own account, so no desktop mail app is needed. */
const replyLinks = (m) => {
  const first = (m.name || '').trim().split(/\s+/)[0] || 'there';
  const when = m.createdAt ? new Date(m.createdAt).toLocaleString() : '';
  const quoted = (m.message || '').slice(0, 600).split('\n').map((l) => '> ' + l).join('\n');
  const subject = 'Re: ' + (m.subject || 'your message');
  const body = `Hi ${first},\n\nThank you for reaching out.\n\n\n\nBest regards,\n${SITE.name}\n\nOn ${when}, ${m.name} wrote:\n${quoted}`;
  const e = encodeURIComponent;
  return {
    gmail: `https://mail.google.com/mail/?authuser=${e(SITE.email)}&view=cm&fs=1&to=${e(m.email)}&su=${e(subject)}&body=${e(body)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${e(m.email)}&subject=${e(subject)}&body=${e(body)}`,
    mailto: `mailto:${m.email}?subject=${e(subject)}&body=${e(body)}`,
  };
};

function MessageCard({ m, index, onSeen, onDelete }) {
  const [pin, setPin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sure, setSure] = useState(false);
  const timer = useRef();
  const links = replyLinks(m);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Read = hovered ~0.8s, clicked, or replied to.
  const enter = () => { if (!m.seen) timer.current = setTimeout(() => onSeen(m.id, true), 800); };
  const leave = () => clearTimeout(timer.current);
  const toggle = () => { setPin((p) => !p); if (!m.seen) onSeen(m.id, true); };
  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
  const copy = async () => {
    try { await navigator.clipboard.writeText(m.email); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ }
  };
  const del = () => { if (sure) return onDelete(m.id); setSure(true); setTimeout(() => setSure(false), 2500); };
  const markReplied = () => { if (!m.seen) onSeen(m.id, true); };

  return (
    <article className={'im' + (m.seen ? '' : ' unread') + (pin ? ' pin' : '')} style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
      onMouseEnter={enter} onMouseLeave={leave}>
      <div className="im-row" role="button" tabIndex={0} aria-expanded={pin} onClick={toggle} onKeyDown={onKey}>
        <span className="im-av" style={{ background: gradient(m.name) }}>{initials(m.name)}</span>
        <span className="im-name">{m.name || 'Anonymous'}{!m.seen && <i className="im-dot" title="Unread" />}</span>
        <time>{ago(m.createdAt)}</time>
        <a className="im-rep" href={links.gmail} target="_blank" rel="noopener noreferrer" title="Reply" aria-label={`Reply to ${m.name}`}
          onClick={(e) => { e.stopPropagation(); markReplied(); }}>↩</a>
      </div>

      <div className="im-more">
        <div className="im-inner">
          <div className="im-meta">
            <button className="im-mail" onClick={copy} title="Click to copy">✉ {copied ? 'Copied ✓' : m.email}</button>
            {m.subject && <span className="im-role">💼 {m.subject}</span>}
          </div>
          <blockquote className="im-body">{m.message}</blockquote>
          <p className="im-when">Received {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</p>
          <div className="im-acts">
            <a className="im-btn pri" href={links.gmail} target="_blank" rel="noopener noreferrer" onClick={markReplied}>↩ Reply by email</a>
            <button className="im-btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy email'}</button>
          </div>
          <div className="im-sub">
            <a href={links.outlook} target="_blank" rel="noopener noreferrer" onClick={markReplied}>Outlook</a>
            <a href={links.mailto} onClick={markReplied}>Mail app</a>
            <button onClick={() => onSeen(m.id, !m.seen)}>{m.seen ? 'Mark unread' : 'Mark read'}</button>
            <button className={'danger' + (sure ? ' sure' : '')} onClick={del}>{sure ? 'Confirm delete?' : 'Delete'}</button>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Owner-only floating inbox. The badge shows UNREAD messages and drops as you read them. */
export default function FloatingInbox() {
  const { own } = useOwner();
  const [msgs, setMsgs] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | auth | offline
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    const r = await messagesApi.list();
    if (Array.isArray(r)) { setMsgs(r); setStatus('ok'); } else setStatus(r === false ? 'auth' : 'offline');
    setBusy(false);
  }, []);

  useEffect(() => {
    if (!own) return undefined;
    load();
    const id = setInterval(load, 30000);
    const onVisible = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
  }, [own, load]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  const unread = msgs.filter((m) => !m.seen).length;

  useEffect(() => {
    if (!own) return undefined;
    document.title = unread ? `(${unread}) ${BASE_TITLE}` : BASE_TITLE;
    return () => { document.title = BASE_TITLE; };
  }, [unread, own]);

  const setSeen = useCallback((id, seen) => {
    setMsgs((l) => l.map((m) => (m.id === id ? { ...m, seen } : m)));
    messagesApi.setSeen(id, seen);
  }, []);
  const markAll = () => { setMsgs((l) => l.map((m) => ({ ...m, seen: true }))); messagesApi.markAllSeen(); };
  const remove = useCallback((id) => { setMsgs((l) => l.filter((m) => m.id !== id)); messagesApi.remove(id); }, []);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return msgs
      .filter((m) => tab === 'all' || !m.seen)
      .filter((m) => !t || [m.name, m.email, m.subject, m.message].some((v) => (v || '').toLowerCase().includes(t)));
  }, [msgs, tab, q]);

  if (!own) return null;

  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 30}deg`);
    e.currentTarget.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 30}deg`);
  };
  const untilt = (e) => { e.currentTarget.style.setProperty('--ry', '0deg'); e.currentTarget.style.setProperty('--rx', '0deg'); };

  return (
    <>
      <button className={'inbox-fab' + (unread ? ' has-new' : '')} onClick={() => { setOpen(true); load(); }}
        onMouseMove={tilt} onMouseLeave={untilt} aria-label={`Open inbox, ${unread} unread`} title="Messages">
        <span className="fab-glow" />
        <span className="fab-face">
          <svg className="fab-ico" viewBox="0 0 48 48" aria-hidden="true">
            <defs>
              <linearGradient id="inboxGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d9d0ff" />
              </linearGradient>
            </defs>
            <g className="fab-letter">
              <rect x="12" y="8" width="24" height="20" rx="3" fill="#fff" />
              <path d="M17 14h14M17 19h9" stroke="#b9a8ff" strokeWidth="2" strokeLinecap="round" />
            </g>
            <rect x="5" y="15" width="38" height="25" rx="6" fill="url(#inboxGrad)" />
            <path d="M7 19.5l15.2 11a3.4 3.4 0 0 0 3.6 0L41 19.5" fill="none" stroke="#7c5cff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {unread > 0 && <span className="fab-badge" key={unread}>{unread > 99 ? '99+' : unread}</span>}
      </button>

      {open && (
        <div className="inbox-ov" onClick={() => setOpen(false)}>
          <div className="inbox" role="dialog" aria-modal="true" aria-label="Inbox" onClick={(e) => e.stopPropagation()}>
            <header className="inbox-head">
              <div>
                <h3>Inbox</h3>
                <small>{unread} unread · {msgs.length} total</small>
              </div>
              <div className="inbox-tools">
                {unread > 0 && <button className="inbox-all" onClick={markAll}>✓ Mark all read</button>}
                <button className={'ib' + (busy ? ' spin' : '')} onClick={load} aria-label="Refresh">⟳</button>
                <button className="ib" onClick={() => setOpen(false)} aria-label="Close">✕</button>
              </div>
            </header>

            <div className="inbox-bar">
              <div className="inbox-tabs" role="tablist">
                <button className={tab === 'all' ? 'sel' : ''} onClick={() => setTab('all')}>All ({msgs.length})</button>
                <button className={tab === 'unread' ? 'sel' : ''} onClick={() => setTab('unread')}>Unread ({unread})</button>
              </div>
              <input className="inbox-search" type="search" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            <div className="inbox-list">
              {status === 'auth' && <p className="inbox-note err">The server rejected your owner key. Use “Exit owner mode” in the footer, then log in again.</p>}
              {status === 'offline' && <p className="inbox-note err">Can’t reach the server (it may be waking up). Press refresh in a few seconds.</p>}
              {status === 'loading' && <p className="inbox-note">Loading messages…</p>}
              {status === 'ok' && !msgs.length && <div className="inbox-empty"><span>📭</span><b>No messages yet</b><p>When someone uses your contact form, it shows up here.</p></div>}
              {status === 'ok' && !!msgs.length && !shown.length && <div className="inbox-empty"><span>{tab === 'unread' ? '🎉' : '🔍'}</span><b>{tab === 'unread' ? 'All caught up' : 'No matches'}</b></div>}
              {shown.map((m, i) => <MessageCard key={m.id ?? i} m={m} index={i} onSeen={setSeen} onDelete={remove} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}