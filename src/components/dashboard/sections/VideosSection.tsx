
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useVideosData } from '@/hooks/useVideosData';
import { AllVideosTab, CategoriesTab, WatchedVideosTab } from '@/components/videos';

const VideosSection = () => {
  const { user } = useUser();
  const { videos, categories, isLoading, searchQuery, setSearchQuery } = useVideosData();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "all");
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-timelingo-navy">Historical Videos</h2>
        <div className="relative w-64">
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="watched">Recently Watched</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <AllVideosTab videos={videos} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <CategoriesTab categories={categories} />
        </TabsContent>
        
        <TabsContent value="watched" className="mt-4">
          <WatchedVideosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideosSection;
