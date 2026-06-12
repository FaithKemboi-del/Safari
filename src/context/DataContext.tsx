import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Destination, Itinerary } from '../data';
import { destinations as localDestinations, itineraries as localItineraries } from '../data';
import { fetchDestinations, fetchItineraries, getDataSourceLabel } from '../services/safariApi';

type DataContextValue = {
  destinations: Destination[];
  itineraries: Itinerary[];
  loading: boolean;
  source: 'supabase' | 'local';
  refresh: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(localDestinations);
  const [itineraries, setItineraries] = useState<Itinerary[]>(localItineraries);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'supabase' | 'local'>(getDataSourceLabel());

  const load = async () => {
    setLoading(true);
    const [nextDestinations, nextItineraries] = await Promise.all([
      fetchDestinations(),
      fetchItineraries(),
    ]);
    setDestinations(nextDestinations);
    setItineraries(nextItineraries);
    setSource(getDataSourceLabel());
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const value = useMemo(
    () => ({
      destinations,
      itineraries,
      loading,
      source,
      refresh: load,
    }),
    [destinations, itineraries, loading, source],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
