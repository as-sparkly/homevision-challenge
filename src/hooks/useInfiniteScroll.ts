import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchHouses } from '../services/api';
import { House } from '../types/house';
import { API_CONFIG } from '../utils/constants';

export interface UseInfiniteScrollState {
  houses: House[];
  loading: boolean;
  error: string | null;
  errorType: 'network' | 'server' | 'timeout' | 'general' | null;
  hasMore: boolean;
  loadMore: () => void;
  retry: () => void;
}


export const useInfiniteScroll = (): UseInfiniteScrollState => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'network' | 'server' | 'timeout' | 'general' | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastAttemptTime, setLastAttemptTime] = useState<number>(0);
  
  // Use ref to prevent double API calls in React StrictMode
  const initializationRef = useRef(false);
  // Use ref to track component mount status for cleanup
  const isMountedRef = useRef(true);

  const loadHouses = useCallback(async (page: number, reset = false) => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;
    
    // Prevent too frequent requests (minimum 500ms between attempts)
    if (loading || timeSinceLastAttempt < 500) return;

    setLoading(true);
    setError(null);
    setErrorType(null);
    setLastAttemptTime(now);

    try {
      const newHouses = await fetchHouses({
        page,
        per_page: API_CONFIG.HOUSES_PER_PAGE,
      });


      if (newHouses.length < API_CONFIG.HOUSES_PER_PAGE) {
        setHasMore(false);
      }

      setHouses(prev => {
        if (reset) return newHouses;
        
        // Filter out duplicates based on house ID
        const existingIds = new Set(prev.map(house => house.id));
        const uniqueNewHouses = newHouses.filter(house => !existingIds.has(house.id));
        
        return [...prev, ...uniqueNewHouses];
      });
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Determine error type based on error message
      let type: 'network' | 'server' | 'timeout' | 'general' = 'general';
      if (errorMessage.includes('Network connection failed') || errorMessage.includes('Failed to fetch')) {
        type = 'network';
      } else if (errorMessage.includes('Server error') || errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
        type = 'server';
      } else if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
        type = 'timeout';
      }
      setErrorType(type);
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
      setErrorType(null);
      if (houses.length === 0) {
        loadHouses(1, true);
      } else {
        // Try to load the next page instead of the current one
        loadHouses(currentPage + 1);
      }
    }
  }, [error, houses.length, currentPage, loadHouses]);

  useEffect(() => {
    // Only initialize once, even in StrictMode
    if (!initializationRef.current) {
      initializationRef.current = true;
      loadHouses(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove loadHouses dependency to prevent infinite re-renders

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    houses,
    loading,
    error,
    errorType,
    hasMore,
    loadMore,
    retry,
  };
};