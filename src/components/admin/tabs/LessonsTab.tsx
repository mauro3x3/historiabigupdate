
import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLessonForm from '@/components/admin/AdminLessonForm';
import AdminLessonList from '@/components/admin/AdminLessonList';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import AdminQuestionForm from '@/components/admin/AdminQuestionForm';

interface LessonsTabProps {
  currentLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

const LessonsTab = ({ currentLessonId, onSelectLesson }: LessonsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Create New Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminLessonForm 
              onSuccess={(lessonId) => {
                onSelectLesson(lessonId);
                toast.success("Lesson created successfully!");
                
                // Show a toast message with guidance to associate the lesson with a learning track
                setTimeout(() => {
                  toast.info("Don't forget to add this lesson to a learning track under the Learning Tracks tab!");
                }, 1000);
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Lessons</CardTitle>
            
            {currentLessonId && (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    Add Quiz Questions
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-6 max-h-[90vh] overflow-y-auto">
                  <DrawerHeader className="px-0">
                    <DrawerTitle>Add Quiz Questions</DrawerTitle>
                    <DrawerDescription>
                      Add questions to test student knowledge for this lesson.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="mt-4">
                    <AdminQuestionForm 
                      lessonId={currentLessonId}
                      onSuccess={() => toast.success("Question added successfully!")}
                    />
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          </CardHeader>
          <CardContent>
            <AdminLessonList 
              onSelectLesson={onSelectLesson} 
              selectedLessonId={currentLessonId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonsTab;
