import { useState } from 'react';
import { SITE } from '../../config/site';
import { contactApi } from '../../services/api';
import { store } from '../../utils/storage';
import useForm from '../../hooks/useForm';
import SectionHead from '../ui/SectionHead';

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { f, setF, bind } = useForm(EMPTY);
  const [status, setStatus] = useState('');

  const send = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const ok = await contactApi.send(f);
    if (!ok) store.set('msgs', [...store.get('msgs', []), { ...f, at: new Date().toISOString() }]); // offline fallback
    setStatus(ok ? 'server' : 'local');
    setF(EMPTY);
  };

  return (
    <section id="contact">
      <SectionHead n="04" title="Touch" accent="Get in" sub="Open to Java full-stack roles across India. I reply fast." />
      <div className="cg">
        <div className="cl rv">
          <div className="card"><small>Email</small><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
          <div className="card"><small>Phone</small><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></div>
          <div className="card"><small>Location</small>{SITE.location}</div>
          <div className="card"><small>Profiles</small>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a> · <a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
        <form className="rv" onSubmit={send}>
          <h3>Send a message</h3>
          <div className="row">
            <input required maxLength="100" placeholder="Your name" {...bind('name')} />
            <input required type="email" placeholder="Your email" {...bind('email')} />
          </div>
          <input maxLength="150" placeholder="Subject (e.g. Java Developer role)" {...bind('subject')} />
          <textarea required rows="5" maxLength="3000" placeholder="Tell me about the role or project…" {...bind('message')} />
          <div className="cnt">{f.message.length}/3000</div>
          <button className="btn" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send Message'}</button>
          {(status === 'server' || status === 'local') && (
            <div className="okbox">{status === 'server' ? 'Thanks! Your message was stored and I will get back to you soon.' : 'Thanks! Saved in this browser (the Java backend is not reachable right now).'}</div>
          )}
        </form>
      </div>
    </section>
  );
}
