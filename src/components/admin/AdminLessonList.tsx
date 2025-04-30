
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HistoryLesson, HistoryEra } from '@/types';
import { lessons } from '@/data/historyData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LessonTableRow from './lesson/LessonTableRow';

interface AdminLessonListProps {
  onSelectLesson: (lessonId: string) => void;
  selectedLessonId: string | null;
}

const AdminLessonList = ({ onSelectLesson, selectedLessonId }: AdminLessonListProps) => {
  const [allLessons, setAllLessons] = useState<HistoryLesson[]>(lessons);
  
  useEffect(() => {
    // Fetch lessons from Supabase
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('*');
          
        if (error) {
          console.error("Error fetching lessons:", error);
          toast.error("Could not load lessons from database");
          return;
        }
        
        if (data && data.length > 0) {
          // Transform DB format to match our app's types
          const dbLessons = data.map(l => ({
            id: String(l.id), // Convert to string for consistency
            title: l.title || '',
            description: l.description || '',
            content: '', // Add empty content as required by type
            era: (l.era as HistoryEra) || 'ancient-egypt',
            xp_reward: l.xp_reward || 50,
            duration: l.duration || 5,
            level: l.level,
            position: l.position
          }));
          
          // Merge with local lessons
          const mergedLessons = [...lessons];
          
          // Update or add lessons from DB
          dbLessons.forEach(dbLesson => {
            const index = mergedLessons.findIndex(l => l.id === dbLesson.id);
            if (index >= 0) {
              mergedLessons[index] = dbLesson;
            } else {
              mergedLessons.push(dbLesson);
            }
          });
          
          setAllLessons(mergedLessons);
        }
      } catch (error) {
        console.warn("Couldn't fetch lessons from database:", error);
      }
    };
    
    fetchLessons();
  }, []);
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Era</TableHead>
            <TableHead>XP</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allLessons.map((lesson) => (
            <LessonTableRow 
              key={lesson.id}
              lesson={lesson}
              isSelected={selectedLessonId === lesson.id}
              onSelect={onSelectLesson}
            />
          ))}
          {allLessons.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No lessons found. Create a new lesson to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminLessonList;
