import React, { useState } from 'react';
import { playJohanDialogueSound } from '@/utils/lessonUtils';

const JohanDialogue = ({ lines, onComplete }: { lines: string[]; onComplete: () => void }) => {
  const [currentLine, setCurrentLine] = useState(0);

  const handleNext = () => {
    if (currentLine < lines.length - 1) {
      setCurrentLine(currentLine + 1);
      playJohanDialogueSound();
    } else {
      onComplete();
    }
  };

  return (
    <div className="johan-dialogue-box">
      <div className="johan-dialogue-text">{lines[currentLine]}</div>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default JohanDialogue; 