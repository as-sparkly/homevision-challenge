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
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        
        if (!data.ok) {
          throw new Error('API responded with ok: false');
        }

        return data.houses;
      } catch (error) {
        console.warn(`Request failed:`, error);
        analytics.trackError(String(error), `fetch-houses-page-${page}`);
        throw error;
      }
    }
  );
};