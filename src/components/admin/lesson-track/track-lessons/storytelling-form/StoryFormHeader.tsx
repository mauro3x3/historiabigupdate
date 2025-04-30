
import React from 'react';
import { BookOpen } from 'lucide-react';

const StoryFormHeader = () => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <BookOpen className="h-5 w-5 text-purple-500" />
      <h3 className="text-lg font-medium">Create Storytelling Lesson</h3>
    </div>
  );
};

export default StoryFormHeader;
