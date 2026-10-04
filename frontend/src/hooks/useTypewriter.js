import { useEffect, useState } from 'react';

export default function useTypewriter(words, speed = 90) {
  const [text, setText] = useState('');
  useEffect(() => {
    let i = 0, w = 0, del = false;
    const id = setInterval(() => {
      const s = words[w];
      i += del ? -1 : 1;
      setText(s.slice(0, i));
      if (!del && i === s.length) del = true;
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; }
    }, speed);
    return () => clearInterval(id);
  }, [words, speed]);
  return text;
}
