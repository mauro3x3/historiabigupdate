export const playJohanDialogueSound = () => {
  const audio = new Audio('/sounds/correct-answer.mp3');
  audio.volume = 0.7;
  audio.play();
};

export function getSelectionRect() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0).cloneRange();
  if (range.collapsed) return null;
  const rect = range.getBoundingClientRect();
  return rect;
}

export function playDolphinSound() {
  const audio = new Audio('/sounds/dolphin.mp3');
  audio.volume = 0.7;
  audio.play();
}

export const MAX_LIVES = 3;
export const STREAK_KEY = 'historia_streak';
export const STREAK_DATE_KEY = 'historia_streak_date';
export const STREAK_REWARD_MILESTONE = 5; 