import { useCallback } from 'react';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export const useAnalytics = () => {
  const track = useCallback((event: AnalyticsEvent) => {
    // Track with Vercel Analytics
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', event.properties);
    }

    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, event.properties);
    }

    // Console log for development
    console.log('Analytics Event:', event);
  }, []);

  const trackEpisodeClick = useCallback((episodeTitle: string, episodeYear: number) => {
    track({
      name: 'episode_clicked',
      properties: {
        episode_title: episodeTitle,
        episode_year: episodeYear,
        timestamp: new Date().toISOString(),
      }
    });
  }, [track]);

  const trackSearch = useCallback((searchTerm: string, resultsCount: number) => {
    track({
      name: 'search_performed',
      properties: {
        search_term: searchTerm,
        results_count: resultsCount,
        timestamp: new Date().toISOString(),
      }
    });
  }, [track]);

  const trackYearClick = useCallback((year: number, eventsCount: number) => {
    track({
      name: 'year_clicked',
      properties: {
        year,
        events_count: eventsCount,
        timestamp: new Date().toISOString(),
      }
    });
  }, [track]);

  const trackPodcastListen = useCallback((platform: string, episodeTitle: string) => {
    track({
      name: 'podcast_listen_intent',
      properties: {
        platform,
        episode_title: episodeTitle,
        timestamp: new Date().toISOString(),
      }
    });
  }, [track]);

  const trackImageView = useCallback((imageUrl: string, episodeTitle: string) => {
    track({
      name: 'image_viewed',
      properties: {
        image_url: imageUrl,
        episode_title: episodeTitle,
        timestamp: new Date().toISOString(),
      }
    });
  }, [track]);

  return {
    track,
    trackEpisodeClick,
    trackSearch,
    trackYearClick,
    trackPodcastListen,
    trackImageView,
  };
};
