import React, { useCallback, useEffect, useRef } from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import HouseCard from './HouseCard';
import SkeletonCard from './SkeletonCard';
import ErrorMessage from './ErrorMessage';
import './VirtualizedInfiniteList.css';

const VirtualizedInfiniteList: React.FC = () => {
  const { houses, loading, error, hasMore, loadMore, retry } = useInfiniteScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom virtual scrolling implementation
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    // Load more when 80% scrolled
    if (scrollPercentage > 0.8 && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (error && houses.length === 0) {
    return (
      <div className="virtualized-container">
        <ErrorMessage message={error} onRetry={retry} />
      </div>
    );
  }

  if (loading && houses.length === 0) {
    return (
      <div className="virtualized-container">
        <div className="houses-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCard key={`initial-skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="virtualized-container">
      <div 
        ref={containerRef}
        className="virtual-list-wrapper"
        style={{ 
          height: '600px', 
          overflowY: 'auto',
          background: '#f9fafb',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '10px'
        }}
      >
        <div className="virtual-content">
          {houses.map((house) => (
            <div key={house.id} className="virtualized-item">
              <HouseCard house={house} />
            </div>
          ))}
          
          {loading && houses.length > 0 && (
            <div className="virtual-loading">
              🔄 Loading more houses...
            </div>
          )}
        </div>
      </div>

      {error && houses.length > 0 && (
        <ErrorMessage message={error} onRetry={retry} />
      )}

      {!loading && !hasMore && houses.length > 0 && (
        <div className="virtual-end-message">
          🏠 You've seen all available houses! ({houses.length} total)
        </div>
      )}
    </div>
  );
};

export default VirtualizedInfiniteList;