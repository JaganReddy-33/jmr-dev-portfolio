import { useEffect, useRef, useState } from 'react';
import { contentApi } from '../services/api';
import { store } from '../utils/storage';

/**
 * A content collection (skills, projects...). Source of truth in the browser is localStorage seeded from `seed`;
 * every change is mirrored to the Java API. If the server answers with data, the server wins.
 */
export default function useCollection(name, seed) {
  const [list, setList] = useState(() => store.get('c_' + name, seed));
  const remote = useRef('off'); // off | empty | ok

  useEffect(() => {
    contentApi.list(name).then((r) => {
      if (!Array.isArray(r)) return;
      if (r.length) { remote.current = 'ok'; setList(r); store.set('c_' + name, r); } else remote.current = 'empty';
    });
  }, [name]);

  const save = (l) => { setList(l); store.set('c_' + name, l); };
  // First owner write to an empty server: upload the existing local items first, in order.
  const flush = (skipId) => {
    if (remote.current !== 'empty') return;
    remote.current = 'ok';
    list.filter((x) => x.id !== skipId).reduce((p, x) => p.then(() => contentApi.put(name, x)), Promise.resolve());
  };

  const put = (item) => {
    flush(item.id);
    save(list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]);
    contentApi.put(name, item);
  };
  const del = (id) => { flush(id); save(list.filter((x) => x.id !== id)); contentApi.remove(name, id); };
  return [list, put, del];
}
