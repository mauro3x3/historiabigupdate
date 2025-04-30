
// Calculate score based on accuracy of guess
export const calculateScore = (guess: number, correctYear: number): number => {
  // Maximum score is 100
  // Calculate accuracy based on how close the guess is to the correct year
  const diff = Math.abs(guess - correctYear);
  const maxYearDiff = 100; // Maximum year difference for scoring
  
  // Score decreases linearly with difference, down to 0 at maxYearDiff
  let calculatedScore = Math.max(0, 100 - Math.floor((diff / maxYearDiff) * 100));
  
  return calculatedScore;
};

// Parse year range from hint string
export const parseYearRangeFromHint = (hint: string | null): [number, number] => {
  if (!hint) return [1000, 2023]; // Default range
  
  try {
    // Try to parse hint as a year range like "1800-1900"
    const match = hint.match(/(\d{3,4})\s*-\s*(\d{3,4})/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2])];
    }
  } catch (e) {
    // Fall back to default range
  }
  
  return [1000, 2023]; // Default range
};
