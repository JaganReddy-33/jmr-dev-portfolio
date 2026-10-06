import { useEffect, useState } from 'react';
import { adminKey, contentApi } from '../services/api';
import { store } from '../utils/storage';

export default function useCollection(name, seed) {
  const [list, setList] = useState(() => {
    const cached = store.get('c_' + name);
    return Array.isArray(cached) && cached.length > 0 ? cached : seed;
  });

  useEffect(() => {
    contentApi.list(name).then(async (r) => {
      if (!Array.isArray(r)) return; // server unreachable: keep cached/seed data
      if (r.length > 0) {
        setList(r);
        store.set('c_' + name, r);
      } else if (adminKey.get()) {
        // server is empty and the owner is logged in: upload what this browser has
        const local = store.get('c_' + name, []);
        for (const item of local) await contentApi.put(name, item);
      }
    });
  }, [name]);

  const warn = () => alert('Not saved to the server. Log in again as owner and retry.');

  const put = async (item) => {
    const next = list.some((x) => x.id === item.id)
      ? list.map((x) => (x.id === item.id ? item : x))
      : [...list, item];
    setList(next);
    store.set('c_' + name, next);
    if ((await contentApi.put(name, item)) !== true) warn();
  };

  const del = async (id) => {
    const next = list.filter((x) => x.id !== id);
    setList(next);
    store.set('c_' + name, next);
    if ((await contentApi.remove(name, id)) !== true) warn();
  };

  return [list, put, del];
}
