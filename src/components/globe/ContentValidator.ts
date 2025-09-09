// Content validation service to prevent spam and malicious content
export class ContentValidator {
  private static instance: ContentValidator;
  
  // Blacklisted words and phrases
  private blacklistedWords = [
    'spam', 'scam', 'fake', 'click here', 'free money', 'hack', 'crack',
    'virus', 'malware', 'phishing', 'nigerian prince', 'bitcoin scam',
    'adult', 'xxx', 'porn', 'nsfw', 'explicit'
  ];

  // Suspicious patterns
  private suspiciousPatterns = [
    /https?:\/\/[^\s]+/g, // URLs (might be spam)
    /[A-Z]{10,}/g, // Excessive caps
    /[!]{3,}/g, // Excessive exclamation marks
    /[?]{3,}/g, // Excessive question marks
    /(.)\1{4,}/g // Repeated characters (like "aaaaa")
  ];

  private constructor() {}

  public static getInstance(): ContentValidator {
    if (!ContentValidator.instance) {
      ContentValidator.instance = new ContentValidator();
    }
    return ContentValidator.instance;
  }

  // Validate content before submission
  public validateContent(content: {
    title: string;
    description: string;
    author: string;
    source: string;
    coordinates: [number, number];
    dateHappened: string;
    category: string;
  }): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for blacklisted words
    const textToCheck = `${content.title} ${content.description} ${content.author}`.toLowerCase();
    const foundBlacklisted = this.blacklistedWords.filter(word => 
      textToCheck.includes(word.toLowerCase())
    );
    
    if (foundBlacklisted.length > 0) {
      errors.push(`Content contains inappropriate words: ${foundBlacklisted.join(', ')}`);
    }

    // Check for suspicious patterns
    this.suspiciousPatterns.forEach(pattern => {
      if (pattern.test(content.title) || pattern.test(content.description)) {
        warnings.push('Content contains suspicious patterns that may be spam');
      }
    });

    // Length validation
    if (content.title.length < 3) {
      errors.push('Title must be at least 3 characters long');
    }
    if (content.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
    if (content.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    if (content.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }

    // Author validation
    if (content.author.length < 2) {
      errors.push('Author name must be at least 2 characters long');
    }
    if (content.author.length > 50) {
      errors.push('Author name must be less than 50 characters');
    }

    // Source validation
    if (content.source.length < 5) {
      errors.push('Source must be at least 5 characters long');
    }

    // Coordinate validation
    const [lng, lat] = content.coordinates;
    if (lat < -90 || lat > 90) {
      errors.push('Invalid latitude. Must be between -90 and 90 degrees');
    }
    if (lng < -180 || lng > 180) {
      errors.push('Invalid longitude. Must be between -180 and 180 degrees');
    }

    // Check for impossible locations (middle of ocean, etc.)
    if (this.isImpossibleLocation(lat, lng)) {
      warnings.push('This location appears to be in the middle of the ocean. Please verify coordinates.');
    }

    // Date validation
    if (!this.isValidHistoricalDate(content.dateHappened)) {
      errors.push('Please provide a valid historical date');
    }

    // Category validation
    const validCategories = [
      'Historical Event', 'Historical Figure', 'Archaeological Site', 
      'Battle', 'Monument', 'Cultural Site', 'Discovery', 'Other'
    ];
    if (!validCategories.includes(content.category)) {
      errors.push('Please select a valid category');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Check if location is impossible (middle of ocean, etc.)
  private isImpossibleLocation(lat: number, lng: number): boolean {
    // Simple check for middle of ocean areas
    const oceanAreas = [
      { lat: 0, lng: 0, radius: 5 }, // Atlantic Ocean
      { lat: 0, lng: 180, radius: 5 }, // Pacific Ocean
      { lat: 0, lng: -180, radius: 5 }, // Pacific Ocean
    ];

    return oceanAreas.some(area => {
      const distance = Math.sqrt(
        Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
      );
      return distance < area.radius;
    });
  }

  // Validate historical date
  private isValidHistoricalDate(dateString: string): boolean {
    // Allow various date formats
    const datePatterns = [
      /^\d{4}$/, // Just year (e.g., 1066)
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
      /^\d{1,2}\/\d{1,2}\/\d{4} BC$/, // MM/DD/YYYY BC
      /^\d{4} BC$/, // YYYY BC
    ];

    const hasValidFormat = datePatterns.some(pattern => pattern.test(dateString));
    if (!hasValidFormat) return false;

    // Extract year for range validation
    const yearMatch = dateString.match(/(\d{4})/);
    if (!yearMatch) return false;

    const year = parseInt(yearMatch[1]);
    const isBC = dateString.includes('BC');
    const actualYear = isBC ? -year : year;

    // Reasonable historical range: 5000 BC to 2024 AD
    return actualYear >= -5000 && actualYear <= 2024;
  }

  // Check for duplicate content
  public checkForDuplicates(newContent: any, existingContent: any[]): boolean {
    const newText = `${newContent.title} ${newContent.description}`.toLowerCase();
    
    return existingContent.some(existing => {
      const existingText = `${existing.title} ${existing.description}`.toLowerCase();
      const similarity = this.calculateSimilarity(newText, existingText);
      return similarity > 0.8; // 80% similarity threshold
    });
  }

  // Simple similarity calculation
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Levenshtein distance calculation
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Get content quality score
  public getContentQualityScore(content: any): number {
    let score = 0;
    
    // Length scoring
    if (content.title.length >= 10) score += 20;
    if (content.description.length >= 50) score += 30;
    if (content.source.length >= 10) score += 20;
    
    // Source quality
    const qualitySources = ['wikipedia', 'museum', 'university', 'library', 'archive'];
    if (qualitySources.some(source => content.source.toLowerCase().includes(source))) {
      score += 20;
    }
    
    // Historical accuracy indicators
    if (content.dateHappened.includes('BC') || content.dateHappened.includes('AD')) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }
}

export default ContentValidator;
