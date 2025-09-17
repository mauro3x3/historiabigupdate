import React, { useEffect, useState } from 'react';
import { addDailyNewsToGlobe, clearOldNewsArticles } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Newspaper, Trash2 } from 'lucide-react';

interface NewsIntegrationProps {
  onNewsAdded?: () => void;
}

export default function NewsIntegration({ onNewsAdded }: NewsIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  const LAST_UPDATE_KEY = 'news_last_update_at';

  const handleAddNews = async () => {
    setIsLoading(true);
    try {
      await addDailyNewsToGlobe();
      setLastUpdate(new Date().toLocaleString());
      localStorage.setItem(LAST_UPDATE_KEY, String(Date.now()));
      onNewsAdded?.();
    } catch (error) {
      console.error('Failed to add news:', error);
      alert('Failed to add news articles. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Silent variant used by the auto-scheduler (no alerts/UI blocking)
  const handleAddNewsSilently = async () => {
    try {
      await addDailyNewsToGlobe();
      setLastUpdate(new Date().toLocaleString());
      localStorage.setItem(LAST_UPDATE_KEY, String(Date.now()));
      onNewsAdded?.();
      console.log('[Auto News] Successfully added news articles');
    } catch (error) {
      console.warn('[Auto News] Failed to add news articles:', error);
    }
  };

  // Auto-trigger every 6 hours without any server/cron setup
  useEffect(() => {
    const checkAndRun = () => {
      const last = Number(localStorage.getItem(LAST_UPDATE_KEY) || '0');
      const now = Date.now();
      if (now - last >= SIX_HOURS_MS) {
        // Run silently to avoid user interruption
        handleAddNewsSilently();
      }
    };

    // Initial check on mount
    checkAndRun();

    // Re-check periodically (every 15 minutes)
    const interval = setInterval(checkAndRun, 15 * 60 * 1000);

    // Also run when the tab becomes visible again
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAndRun();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const handleClearOldNews = async () => {
    setIsClearing(true);
    try {
      await clearOldNewsArticles();
      alert('Old news articles cleared successfully!');
    } catch (error) {
      console.error('Failed to clear old news:', error);
      alert('Failed to clear old news articles. Check console for details.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          News Integration
        </CardTitle>
        <CardDescription>
          Add daily news articles to the globe from NewsAPI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleAddNews} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding News...
            </>
          ) : (
            <>
              <Newspaper className="mr-2 h-4 w-4" />
              Add Daily News (10 articles)
            </>
          )}
        </Button>

        <Button 
          onClick={handleClearOldNews} 
          disabled={isClearing}
          variant="outline"
          className="w-full"
        >
          {isClearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Clearing...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Old News (7+ days)
            </>
          )}
        </Button>

        {lastUpdate && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
