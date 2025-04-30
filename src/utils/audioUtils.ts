// Audio utilities for quiz feedback sounds
const correctSound = new Audio('/sounds/correct-answer.mp3');
const wrongSound = new Audio('/sounds/wrong-answer.mp3');
const selectSound = new Audio('/sounds/select-option.mp3');

// Audio utility functions
const sounds = {
  water: new Audio('/sounds/water.mp3'),
  joyful: new Audio('/sounds/joyful.mp3')
};

// Add a preload function to load the sounds when the app starts
export const preloadSounds = () => {
  // Setting preload attribute helps ensure sounds are ready
  correctSound.preload = 'auto';
  wrongSound.preload = 'auto';
  selectSound.preload = 'auto';
  
  // Load the sounds (this won't play them)
  correctSound.load();
  wrongSound.load();
  selectSound.load();
  
  // Test play the sounds at very low volume to overcome autoplay restrictions
  try {
    const originalVolume = selectSound.volume;
    selectSound.volume = 0.01;
    const playPromise = selectSound.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Immediately pause and reset volume
        selectSound.pause();
        selectSound.currentTime = 0;
        selectSound.volume = originalVolume;
        console.log('Sound preloaded successfully');
      }).catch(err => {
        console.log('Sound preload test failed:', err);
      });
    }
  } catch (error) {
    console.log('Error preloading sounds:', error);
  }

  // Preload all sounds
  Object.values(sounds).forEach(sound => {
    sound.load();
  });
};

export const playCorrectSound = () => {
  try {
    // Reset to beginning and play
    correctSound.currentTime = 0;
    correctSound.volume = 0.5; // Set appropriate volume
    const playPromise = correctSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Error playing correct sound:', err);
      });
    }
  } catch (error) {
    console.log('Error playing correct sound:', error);
  }
};

export const playWrongSound = () => {
  try {
    // Reset to beginning and play
    wrongSound.currentTime = 0;
    wrongSound.volume = 0.5; // Set appropriate volume
    const playPromise = wrongSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Error playing wrong sound:', err);
      });
    }
  } catch (error) {
    console.log('Error playing wrong sound:', error);
  }
};

// Use dedicated select sound with improved implementation
export const playSelectSound = () => {
  try {
    selectSound.volume = 0.4; // Set appropriate volume
    selectSound.currentTime = 0;
    
    // Important: Check if the browser requires user interaction first
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (context.state === 'suspended') {
      context.resume();
    }
    
    const playPromise = selectSound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Error playing select sound:', err);
        // If we can't play the sound due to browser policy, just continue silently
      });
    }
  } catch (error) {
    console.log('Error playing select sound:', error);
  }
};

// Play specific sounds
export const playBubblesSound = () => {
  sounds.water.currentTime = 0;
  sounds.water.play().catch(e => console.log('Audio play failed:', e));
};

export const playJoyfulSound = () => {
  sounds.joyful.currentTime = 0;
  sounds.joyful.play().catch(e => console.log('Audio play failed:', e));
};
