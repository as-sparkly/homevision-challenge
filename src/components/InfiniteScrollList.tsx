import React, { useEffect, useRef, useCallback } from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import HouseCard from './HouseCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SkeletonCard from './SkeletonCard';
import { PERFORMANCE_CONFIG } from '../utils/constants';
import './InfiniteScrollList.css';

const InfiniteScrollList: React.FC = () => {
  const { houses, loading, error, errorType, hasMore, loadMore, retry } = useInfiniteScroll();
  const observerRef = useRef<HTMLDivElement>(null);


  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && !error) {
        loadMore();
      }
    },
    [hasMore, loading, error, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: PERFORMANCE_CONFIG.INTERSECTION_THRESHOLD,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div className="list-container">
      {loading && houses.length === 0 && (
        <div className="houses-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {error && houses.length === 0 && (
        <ErrorMessage message={error} onRetry={retry} errorType={errorType || 'general'} />
      )}

      <div className="houses-grid">
        {houses.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>

      {error && houses.length > 0 && (
        <ErrorMessage message={error} onRetry={retry} errorType={errorType || 'general'} />
      )}

      {loading && houses.length > 0 && <LoadingSpinner />}

      {!loading && !error && hasMore && (
        <div ref={observerRef} className="scroll-trigger">
          Loading more houses...
        </div>
      )}

      {!loading && !hasMore && houses.length > 0 && (
        <div className="end-message">
          🏠 You've seen all available houses!
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollList;