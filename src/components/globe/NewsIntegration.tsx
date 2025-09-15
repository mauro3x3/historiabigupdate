import React, { useState } from 'react';
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

  const handleAddNews = async () => {
    setIsLoading(true);
    try {
      await addDailyNewsToGlobe();
      setLastUpdate(new Date().toLocaleString());
      onNewsAdded?.();
    } catch (error) {
      console.error('Failed to add news:', error);
      alert('Failed to add news articles. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

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
