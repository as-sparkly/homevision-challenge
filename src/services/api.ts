import { House, ApiResponse, PaginationParams } from '../types/house';
import { API_CONFIG } from '../utils/constants';
import { analytics } from '../utils/analytics';
import { performanceMonitor } from '../utils/performance';


export const fetchHouses = async (params: PaginationParams = {}): Promise<House[]> => {
  const { page = 1, per_page = API_CONFIG.HOUSES_PER_PAGE } = params;
  const url = new URL(API_CONFIG.BASE_URL);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  analytics.trackInfiniteScroll(page);
  
  return performanceMonitor.measureAsyncOperation(
    `fetch-houses-page-${page}`,
    async () => {
      // Single attempt - let user handle retries manually
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
        
        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorMessage = response.status === 404 
            ? 'Requested data not found'
            : response.status >= 500 
            ? 'Server error occurred, please try again later'
            : `Network error: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }

        let data: ApiResponse;
        try {
          data = await response.json();
        } catch (parseError) {
          throw new Error('Invalid response format received from server');
        }
        
        if (!data.ok) {
          throw new Error('Server responded with an error');
        }

        if (!Array.isArray(data.houses)) {
          throw new Error('Invalid data format received');
        }

        return data.houses;
      } catch (error) {
        let errorMessage = 'Failed to load houses';
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'Request timed out, please try again';
          } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Network connection failed, please check your internet connection';
          } else {
            errorMessage = error.message;
          }
        }
        
        console.warn(`Request failed for page ${page}:`, error);
        analytics.trackError(errorMessage, `fetch-houses-page-${page}`);
        
        const enhancedError = new Error(errorMessage);
        enhancedError.cause = error;
        throw enhancedError;
      }
    }
  );
};