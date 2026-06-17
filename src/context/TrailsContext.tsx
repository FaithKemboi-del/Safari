import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SavannaTrail } from '../data/savannaTrails';
import { fetchTrails, trailsDataSourceLabel } from '../services/trailsApi';
import { useAuth } from './AuthContext';

type TrailsContextValue = {
  trails: SavannaTrail[];
  loading: boolean;
  error: string | null;
  dataSource: 'supabase' | 'local';
  refreshTrails: () => Promise<void>;
  getTrail: (id: string) => SavannaTrail | undefined;
};

const TrailsContext = createContext<TrailsContextValue | null>(null);

export function TrailsProvider({ children }: { children: ReactNode }) {
  const [trails, setTrails] = useState<SavannaTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshTrails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTrails();
      setTrails(data);
    } catch (loadError) {
      console.error('Failed to load trails:', loadError);
      setError('Could not load trails. Try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTrails();
  }, [refreshTrails, user?.id]);

  const value = useMemo<TrailsContextValue>(
    () => ({
      trails,
      loading,
      error,
      dataSource: trailsDataSourceLabel(),
      refreshTrails,
      getTrail: (id: string) => trails.find((trail) => trail.id === id),
    }),
    [trails, loading, error, refreshTrails],
  );

  return <TrailsContext.Provider value={value}>{children}</TrailsContext.Provider>;
}

export function useTrails() {
  const context = useContext(TrailsContext);
  if (!context) {
    throw new Error('useTrails must be used within TrailsProvider');
  }
  return context;
}
