export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** Scrolls to an item and gives it a short glow after it is added or edited. */
export function flash(id) {
  setTimeout(() => {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('new');
    setTimeout(() => el.classList.remove('new'), 2300);
  }, 120);
}

export function tilt(e) {
  const c = e.currentTarget, r = c.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  c.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
}
export const untilt = (e) => { e.currentTarget.style.transform = ''; };
