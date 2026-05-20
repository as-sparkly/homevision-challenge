interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' && 
                    process.env.REACT_APP_ANALYTICS_ENABLED === 'true';
  }

  track(name: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', name, properties);
    }

    console.log('Analytics Event:', event);
  }

  trackPageView(path: string) {
    this.track('page_view', { path });
  }

  trackHouseView(houseId: number) {
    this.track('house_view', { house_id: houseId });
  }

  trackInfiniteScroll(page: number) {
    this.track('infinite_scroll', { page });
  }

  trackError(error: string, context?: string) {
    this.track('error', { error, context });
  }

  trackPerformance(metric: string, value: number) {
    this.track('performance', { metric, value });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
}

export const analytics = new Analytics();