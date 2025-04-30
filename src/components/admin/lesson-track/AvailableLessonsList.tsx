
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HistoryLesson } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, PlusCircle, Book, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface AvailableLessonsListProps {
  lessons: HistoryLesson[];
  isLoading: boolean;
  onAddLesson: (lesson: HistoryLesson) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const AvailableLessonsList = ({ 
  lessons, 
  isLoading, 
  onAddLesson,
  searchTerm = '',
  onSearchChange
}: AvailableLessonsListProps) => {
  const availableLessons = lessons.filter(lesson => !lesson.level);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter by lesson type and search term
  const filteredLessons = availableLessons.filter(lesson => {
    // First apply type filter
    if (activeTab === 'storytelling' && lesson.lesson_type !== 'storytelling') {
      return false;
    }
    if (activeTab === 'standard' && lesson.lesson_type !== 'standard') {
      return false;
    }
    
    // Then apply search filter
    if (searchTerm) {
      return (
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lesson.description && lesson.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return true;
  });

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Available Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3 mb-3">
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-2">
              <TabsTrigger value="all">All Types</TabsTrigger>
              <TabsTrigger value="storytelling" className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Learning Journey</span>
              </TabsTrigger>
              <TabsTrigger value="standard" className="flex items-center gap-1">
                <Book className="h-3.5 w-3.5" />
                <span>Side Learning</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="border rounded-md overflow-hidden bg-white">
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-24 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mb-2" />
                        <span className="text-sm text-muted-foreground">Loading lessons...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLessons.map(lesson => (
                    <TableRow key={lesson.id} className="hover:bg-slate-50/80">
                      <TableCell className="font-medium">
                        {lesson.title}
                        {lesson.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {lesson.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`capitalize flex items-center gap-1 w-fit 
                          ${lesson.lesson_type === 'storytelling' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                        >
                          {lesson.lesson_type === 'storytelling' ? (
                            <BookOpen className="h-3 w-3" />
                          ) : (
                            <Book className="h-3 w-3" />
                          )}
                          {lesson.lesson_type === 'storytelling' ? 'Learning Journey' : 'Side Learning'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onAddLesson(lesson)}
                          className="h-8 px-2"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {!isLoading && filteredLessons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No {activeTab !== 'all' ? activeTab + ' ' : ''}lessons available.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use the "Create Learning Journey Lesson" or "Create Side Learning Content" buttons to add new lessons.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          {filteredLessons.length} available lesson{filteredLessons.length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableLessonsList;
