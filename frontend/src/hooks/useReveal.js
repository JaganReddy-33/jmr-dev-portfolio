import { useEffect } from 'react';

/** Fades sections in as they scroll into view; also catches nodes added later (tabs, new items). */
export default function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    }), { threshold: 0.1 });
    const scan = () => document.querySelectorAll('.rv:not(.on)').forEach((n) => io.observe(n));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}
