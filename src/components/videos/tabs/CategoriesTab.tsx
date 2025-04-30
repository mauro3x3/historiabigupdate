
import React from 'react';
import { VideoCategory } from '@/types';
import CategoryCard from '../CategoryCard';

interface CategoriesTabProps {
  categories: VideoCategory[];
}

const CategoriesTab = ({ categories }: CategoriesTabProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoriesTab;
