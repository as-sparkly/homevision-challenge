import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchHouses } from '../services/api';
import { House } from '../types/house';
import { API_CONFIG } from '../utils/constants';

export interface UseInfiniteScrollState {
  houses: House[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  retry: () => void;
}


export const useInfiniteScroll = (): UseInfiniteScrollState => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastAttemptTime, setLastAttemptTime] = useState<number>(0);
  
  // Use ref to prevent double API calls in React StrictMode
  const initializationRef = useRef(false);

  const loadHouses = useCallback(async (page: number, reset = false) => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;
    
    // Prevent too frequent requests (minimum 500ms between attempts)
    if (loading || timeSinceLastAttempt < 500) return;

    setLoading(true);
    setError(null);
    setLastAttemptTime(now);

    try {
      const newHouses = await fetchHouses({
        page,
        per_page: API_CONFIG.HOUSES_PER_PAGE,
      });

      if (newHouses.length < API_CONFIG.HOUSES_PER_PAGE) {
        setHasMore(false);
      }

      setHouses(prev => reset ? newHouses : [...prev, ...newHouses]);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [loading, lastAttemptTime]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !error) {
      loadHouses(currentPage + 1);
    }
  }, [loading, hasMore, error, currentPage, loadHouses]);

  const retry = useCallback(() => {
    if (error) {
      setError(null); // Clear error first
      if (houses.length === 0) {
        loadHouses(1, true);
      } else {
        loadHouses(currentPage);
      }
    }
  }, [error, houses.length, currentPage, loadHouses]);

  useEffect(() => {
    // Only initialize once, even in StrictMode
    if (!initializationRef.current) {
      initializationRef.current = true;
      loadHouses(1, true);
    }
  }, [loadHouses]);

  return {
    houses,
    loading,
    error,
    hasMore,
    loadMore,
    retry,
  };
};