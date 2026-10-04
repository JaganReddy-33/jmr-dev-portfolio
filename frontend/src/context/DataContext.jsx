import { createContext, useContext } from 'react';
import useCollection from '../hooks/useCollection';
import { SEED } from '../data/seed';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

/** Each entry is [list, put, remove]. */
export function DataProvider({ children }) {
  const value = {
    skills: useCollection('skills', SEED.skills),
    experience: useCollection('experience', SEED.experience),
    projects: useCollection('projects', SEED.projects),
    ach: useCollection('ach', SEED.ach),
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
