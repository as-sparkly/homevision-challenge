import React from 'react';
import './SkeletonCard.css';

const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card" aria-label="Loading house information">
      <div className="skeleton-image"></div>
      <div className="skeleton-details">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-subtitle"></div>
        <div className="skeleton-text skeleton-price"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;