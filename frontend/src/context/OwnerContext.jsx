import { createContext, useContext, useState } from 'react';
import { adminKey, authApi } from '../services/api';

const OwnerContext = createContext({ own: false });
export const useOwner = () => useContext(OwnerContext);

/** Owner mode shows add/edit/delete buttons. The Java API enforces the key on every write. */
export function OwnerProvider({ children }) {
  const [own, setOwn] = useState(!!adminKey.get());
  const login = async (key) => {
  adminKey.set(key);
  const r = await authApi.check();
  if (r === true) { setOwn(true); return true; }
  adminKey.set(''); // wrong key OR server unreachable: never enter owner mode without a verified key
  return false;
};
  const logout = () => { adminKey.set(''); setOwn(false); };
  return <OwnerContext.Provider value={{ own, login, logout }}>{children}</OwnerContext.Provider>;
}
