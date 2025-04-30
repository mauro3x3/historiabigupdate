
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoCategory } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface CategoryCardProps {
  category: VideoCategory;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/videos/category/${category.id}`)}
    >
      <div className="relative">
        <img
          src={category.thumbnailUrl}
          alt={category.name}
          className="h-32 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold">{category.name}</h3>
          <p className="text-white/80 text-xs mt-1">{category.videoCount} videos</p>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
        <Button variant="link" className="p-0 h-auto mt-2 text-sm text-timelingo-purple flex items-center">
          Browse category
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
