import { useEffect, useState } from 'react';

/** Animates from its previous value to `to`, so counters tick when items are added or deleted. */
export default function Counter({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start = null, id;
    const from = v;
    const step = (t) => {
      start = start ?? t;
      const p = Math.min((t - start) / 1200, 1);
      setV(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return <>{Math.round(v)}</>;
}
