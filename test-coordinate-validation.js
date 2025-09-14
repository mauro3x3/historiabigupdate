// Test script to verify coordinate validation works
// Run this in your browser console to test the validation

// Test cases that should be rejected
const testCases = [
  // The problematic coordinates that caused the crash
  { coords: [4848488448.097027, 17.36450541468227], description: "Original crash coordinates - large longitude" },
  { coords: [4848488448.097027, 4884844884484849], description: "Original crash coordinates - both large" },
  { coords: [2.3522, 4884844884484849], description: "Large latitude" },
  
  // Other trolling attempts
  { coords: [9999999999, 50], description: "Extremely large longitude" },
  { coords: [50, 9999999999], description: "Extremely large latitude" },
  { coords: [NaN, 50], description: "NaN longitude" },
  { coords: [50, NaN], description: "NaN latitude" },
  { coords: [Infinity, 50], description: "Infinity longitude" },
  { coords: [50, Infinity], description: "Infinity latitude" },
  { coords: ["invalid", "data"], description: "String coordinates" },
  { coords: [200, 50], description: "Out of range longitude" },
  { coords: [50, 200], description: "Out of range latitude" },
  { coords: [-200, 50], description: "Negative out of range longitude" },
  { coords: [50, -200], description: "Negative out of range latitude" },
  
  // Valid coordinates that should pass
  { coords: [2.3522, 48.8566], description: "Valid Paris coordinates" },
  { coords: [-74.006, 40.7128], description: "Valid New York coordinates" },
  { coords: [0, 0], description: "Valid coordinates at origin" },
  { coords: [180, 90], description: "Valid edge case coordinates" },
  { coords: [-180, -90], description: "Valid edge case coordinates" }
];

// Mock validation function (copy from ContentValidator.ts)
function hasSuspiciousCoordinatePattern(str) {
  const cleanStr = str.replace('.', '');
  
  // Check for repeated digits (like 4848488448)
  if (/(\d)\1{4,}/.test(cleanStr)) {
    return true;
  }
  
  // Check for alternating patterns (like 484848)
  if (/(\d{2})\1{2,}/.test(cleanStr)) {
    return true;
  }
  
  // Check for sequences that are too long without variation
  if (cleanStr.length > 8 && /^\d+$/.test(cleanStr)) {
    const digitCounts = {};
    for (const digit of cleanStr) {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    }
    const maxCount = Math.max(...Object.values(digitCounts));
    if (maxCount / cleanStr.length > 0.8) {
      return true;
    }
  }
  
  // Check for suspiciously long sequences of the same digit
  if (/(\d)\1{6,}/.test(cleanStr)) {
    return true;
  }
  
  return false;
}

function validateCoordinates(coords) {
  const [lng, lat] = coords;
  const errors = [];
  
  // Check if coordinates are valid numbers
  if (typeof lat !== 'number' || typeof lng !== 'number' || 
      isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
    errors.push('Coordinates must be valid numbers');
  }
  
  // Check for extremely large numbers that could cause crashes
  if (Math.abs(lat) > 1e10 || Math.abs(lng) > 1e10) {
    errors.push('Coordinates contain extremely large numbers that could cause system issues');
  }
  
  // Check for suspiciously large numbers (potential trolling)
  if (Math.abs(lat) > 1000 || Math.abs(lng) > 1000) {
    errors.push('Coordinates appear to be invalid. Please check your values.');
  }
  
  // Standard range validation
  if (lat < -90 || lat > 90) {
    errors.push('Invalid latitude. Must be between -90 and 90 degrees');
  }
  if (lng < -180 || lng > 180) {
    errors.push('Invalid longitude. Must be between -180 and 180 degrees');
  }
  
  // Check for suspicious patterns (repeated digits, etc.)
  const latStr = lat.toString();
  const lngStr = lng.toString();
  if (hasSuspiciousCoordinatePattern(latStr) || hasSuspiciousCoordinatePattern(lngStr)) {
    errors.push('Coordinates contain suspicious patterns. Please verify your values.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Run tests
console.log('🧪 Testing coordinate validation...\n');

testCases.forEach((testCase, index) => {
  const result = validateCoordinates(testCase.coords);
  const status = result.isValid ? '✅ PASS' : '❌ REJECT';
  
  console.log(`Test ${index + 1}: ${status}`);
  console.log(`  Coordinates: [${testCase.coords[0]}, ${testCase.coords[1]}]`);
  console.log(`  Description: ${testCase.description}`);
  
  if (!result.isValid) {
    console.log(`  Errors: ${result.errors.join(', ')}`);
  }
  console.log('');
});

console.log('🎯 Validation test complete!');
console.log('✅ = Valid coordinates that should be accepted');
console.log('❌ = Invalid coordinates that should be rejected');
