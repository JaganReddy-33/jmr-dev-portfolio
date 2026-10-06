import { useEffect, useRef, useState } from 'react';
import { contentApi } from '../services/api';
import { store } from '../utils/storage';


export default function useCollection(name, seed) {
  const [list, setList] = useState(() => {
    const cached = store.get('c_' + name);
   
    return Array.isArray(cached) && cached.length > 0 ? cached : seed;
  });

  const remote = useRef('off'); 

  useEffect(() => {
    contentApi.list(name)
      .then((r) => {
        if (!Array.isArray(r)) return;
        if (r.length > 0) {
          remote.current = 'ok';
          setList(r);
          store.set('c_' + name, r);
        } else {
          remote.current = 'empty';
          
          if (!list || list.length === 0) {
            setList(seed);
          }
        }
      })
      .catch((err) => {
        console.warn(`Backend server unreachable for ${name}. Using local seed data.`, err);
        
        setList((prev) => (prev && prev.length > 0 ? prev : seed));
      });
  }, [name]);

  const save = (l) => {
    setList(l);
    store.set('c_' + name, l);
  };

  
  const flush = (skipId) => {
    if (remote.current !== 'empty') return;
    remote.current = 'ok';
    list
      .filter((x) => x.id !== skipId)
      .reduce((p, x) => p.then(() => contentApi.put(name, x)), Promise.resolve());
  };

  const put = (item) => {
    flush(item.id);
    save(
      list.some((x) => x.id === item.id)
        ? list.map((x) => (x.id === item.id ? item : x))
        : [...list, item]
    );
    contentApi.put(name, item);
  };

  const del = (id) => {
    flush(id);
    save(list.filter((x) => x.id !== id));
    contentApi.remove(name, id);
  };

  return [list, put, del];
}
