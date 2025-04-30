
import { HistoryLesson } from '@/types';

export const useDragAndDrop = (
  trackLessons: HistoryLesson[],
  setTrackLessons: React.Dispatch<React.SetStateAction<HistoryLesson[]>>
) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(trackLessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index + 1
    }));
    
    setTrackLessons(updatedItems);
  };

  return { handleDragEnd };
};
