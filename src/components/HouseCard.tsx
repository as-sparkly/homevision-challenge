import React, { useState, useCallback, memo, useMemo } from 'react';
import { House } from '../types/house';
import { analytics } from '../utils/analytics';
import './HouseCard.css';

interface HouseCardProps {
  house: House;
}

const HouseCard: React.FC<HouseCardProps> = ({ house }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
    analytics.trackError('Image loading failed', `house-${house.id}`);
  }, [house.id]);

  const handleCardClick = useCallback(() => {
    analytics.trackHouseView(house.id);
  }, [house.id]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(house.price);
  }, [house.price]);

  const ariaLabel = useMemo(() => 
    `House at ${house.address}, ${formattedPrice}`, 
    [house.address, formattedPrice]
  );

  return (
    <div 
      className="house-card" 
      onClick={handleCardClick} 
      onKeyDown={handleKeyPress}
      role="button" 
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <div className="house-image-container">
        {imageLoading && <div className="image-placeholder">Loading...</div>}
        {imageError ? (
          <div className="image-error">Image not available</div>
        ) : (
          <img
            src={house.photoURL}
            alt={`House at ${house.address}`}
            className={`house-image ${imageLoading ? 'loading' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="house-details">
        <h3 className="house-address">{house.address}</h3>
        <p className="house-owner">Owner: {house.homeowner}</p>
        <p className="house-price">{formattedPrice}</p>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(HouseCard);