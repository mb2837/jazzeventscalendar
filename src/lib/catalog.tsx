import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Catalog, Venue } from '../types';
import { editionLabel, events, ongoing } from '../data/events';
import { venues } from '../data/venues';
import { api } from './api';

const fallback: Catalog = {
  editionLabel,
  venues,
  events,
  ongoing,
};

interface CatalogContextValue {
  catalog: Catalog;
  loading: boolean;
  error: string | null;
  venueById: Record<string, Venue>;
  refresh: () => Promise<void>;
  setCatalog: (catalog: Catalog) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getCatalog();
      setCatalog(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const venueById = useMemo(
    () => Object.fromEntries(catalog.venues.map((v) => [v.id, v])) as Record<string, Venue>,
    [catalog.venues],
  );

  const value = useMemo(
    () => ({ catalog, loading, error, venueById, refresh, setCatalog }),
    [catalog, loading, error, venueById, refresh],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
