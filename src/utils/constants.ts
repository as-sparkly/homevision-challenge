export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://staging.homevision.co/api_project/houses',
  MAX_RETRIES: parseInt(process.env.REACT_APP_MAX_RETRIES || '3', 10),
  RETRY_DELAY: parseInt(process.env.REACT_APP_RETRY_DELAY || '1000', 10),
  HOUSES_PER_PAGE: parseInt(process.env.REACT_APP_HOUSES_PER_PAGE || '10', 10),
};

export const PERFORMANCE_CONFIG = {
  INTERSECTION_THRESHOLD: 0.1,
  DEBOUNCE_DELAY: 300,
  IMAGE_LOADING_TIMEOUT: 10000,
};