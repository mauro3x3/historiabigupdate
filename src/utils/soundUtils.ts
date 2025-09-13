// Sound utility functions for playing notification sounds

export const playSound = (soundName: string) => {
  // Check if sound is enabled in settings
  const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  if (!soundEnabled) return;

  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.3; // Set volume to 30% to avoid being too loud
    audio.play().catch(error => {
      console.warn(`Failed to play sound ${soundName}:`, error);
    });
  } catch (error) {
    console.warn(`Error loading sound ${soundName}:`, error);
  }
};

// Specific sound functions for common actions
export const playNewDotSound = () => {
  playSound('newdot');
};

export const playCorrectAnswerSound = () => {
  playSound('correct-answer');
};

export const playWrongAnswerSound = () => {
  playSound('wrong-answer');
};

export const playSelectOptionSound = () => {
  playSound('select-option');
};

export const playSwooshSound = () => {
  playSound('swoosh');
};
