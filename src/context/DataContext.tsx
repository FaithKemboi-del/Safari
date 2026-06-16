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
import type { CategorySpot } from '../categoryContent';
import { getAllLocalCategoryCards } from '../categoryContent';
import {
  fetchCategorySpots,
  fetchDestinations,
  fetchItineraries,
  getDataSourceLabel,
} from '../services/safariApi';

type DataContextValue = {
  destinations: Destination[];
  itineraries: Itinerary[];
  categorySpots: CategorySpot[];
  loading: boolean;
  error: string | null;
  source: 'supabase' | 'local';
  refresh: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(localDestinations);
  const [itineraries, setItineraries] = useState<Itinerary[]>(localItineraries);
  const [categorySpots, setCategorySpots] = useState<CategorySpot[]>(getAllLocalCategoryCards());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'supabase' | 'local'>(getDataSourceLabel());

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const [nextDestinations, nextItineraries, nextCategorySpots] = await Promise.all([
        fetchDestinations(),
        fetchItineraries(),
        fetchCategorySpots(),
      ]);
      setDestinations(nextDestinations);
      setItineraries(nextItineraries);
      setCategorySpots(nextCategorySpots);
      setSource(getDataSourceLabel());
    } catch (loadError) {
      console.error('Failed to load destinations and itineraries:', loadError);
      setDestinations(localDestinations);
      setItineraries(localItineraries);
      setCategorySpots(getAllLocalCategoryCards());
      setSource('local');
      setError('Could not load live data. Showing saved demo content instead.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const value = useMemo(
    () => ({
      destinations,
      itineraries,
      categorySpots,
      loading,
      error,
      source,
      refresh: load,
    }),
    [destinations, itineraries, categorySpots, loading, error, source],
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
