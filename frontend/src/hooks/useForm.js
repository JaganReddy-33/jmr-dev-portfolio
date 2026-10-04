import { useState } from 'react';

export default function useForm(initial) {
  const [f, setF] = useState(initial);
  const bind = (k) => ({ value: f[k] ?? '', onChange: (e) => setF((o) => ({ ...o, [k]: e.target.value })) });
  return { f, setF, bind };
}
