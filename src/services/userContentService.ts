import { UserGeneratedContent } from '@/components/globe/AddContentModal';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { playNewDotSound } from '@/utils/soundUtils';

// Service for managing user-generated content
export const saveUserContent = async (content: Omit<UserGeneratedContent, 'id' | 'createdAt'>): Promise<UserGeneratedContent> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Enhanced coordinate validation to prevent crashes and trolling
    const [lng, lat] = content.coordinates;
    
    // Check if coordinates are valid numbers
    if (typeof lat !== 'number' || typeof lng !== 'number' || 
        isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
      throw new Error('Coordinates must be valid numbers');
    }
    
    // Check for extremely large numbers that could cause crashes
    if (Math.abs(lat) > 1e10 || Math.abs(lng) > 1e10) {
      throw new Error('Coordinates contain extremely large numbers that could cause system issues');
    }
    
    // Check for suspiciously large numbers (potential trolling)
    if (Math.abs(lat) > 1000 || Math.abs(lng) > 1000) {
      throw new Error('Coordinates appear to be invalid. Please check your values.');
    }
    
    // Standard range validation
    const isValidLat = lat >= -90 && lat <= 90;
    const isValidLng = lng >= -180 && lng <= 180;
    
    if (!isValidLat || !isValidLng) {
      throw new Error(`Invalid coordinates: latitude must be between -90 and 90, longitude must be between -180 and 180. Received: [${lng}, ${lat}]`);
    }
    
    // Additional pattern detection for trolling
    const latStr = lat.toString();
    const lngStr = lng.toString();
    if (this.hasSuspiciousCoordinatePattern(latStr) || this.hasSuspiciousCoordinatePattern(lngStr)) {
      throw new Error('Coordinates contain suspicious patterns. Please verify your values.');
    }

    // Prepare data for database
    const contentData = {
      user_id: user.id,
      title: content.title,
      description: content.description,
      category: content.category,
      coordinates: content.coordinates, // [longitude, latitude]
      image_url: content.imageUrl,
      author: content.author,
      date_happened: content.dateHappened,
      source: content.source,
      is_approved: true,
      is_public: true
    };

    // Insert into database
    const { data, error } = await supabase
      .from('userdots')
      .insert(contentData)
      .select()
      .single();

    if (error) {
      console.error('Error saving user content:', error);
      throw error;
    }

    // Convert database format back to UserGeneratedContent format
    const newContent: UserGeneratedContent = {
      id: data.id,
      title: data.title,
      description: data.description,
      author: data.author,
      createdAt: data.created_at,
      coordinates: data.coordinates,
      category: data.category,
      imageUrl: data.image_url,
      dateHappened: content.dateHappened, // Store in description or separate field
      source: content.source // Store in description or separate field
    };

    // Play sound effect for new dot added
    playNewDotSound();

    return newContent;
  } catch (error) {
    console.error('Failed to save user content:', error);
    // Fallback to localStorage if database fails
    const newContent: UserGeneratedContent = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
    existingContent.push(newContent);
    localStorage.setItem('userContent', JSON.stringify(existingContent));
    
    return newContent;
  }
};

export const getUserContent = async (): Promise<UserGeneratedContent[]> => {
  console.log('🔍 getUserContent called - starting fetch...');
  
  try {
    console.log('🔍 Fetching user content from userdots table...');
    console.log('🔍 Supabase client:', supabase);
    
    // First, let's try a simple query without filters to see if we can connect
    const { data: allData, error: allError } = await supabase
      .from('userdots')
      .select('*');
    
    console.log('🔍 All userdots data (no filters):', allData);
    console.log('🔍 All userdots error:', allError);
    
    // Now try with filters
    const { data, error } = await supabase
      .from('userdots')
      .select('*')
      .eq('is_public', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    console.log('🔍 Filtered query result:', { data, error });
    console.log('🔍 Number of filtered results:', data?.length || 0);
    
    // Also try without filters to see all data
    const { data: allDataFiltered, error: allErrorFiltered } = await supabase
      .from('userdots')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('🔍 All data without filters:', allDataFiltered);
    console.log('🔍 All data count:', allDataFiltered?.length || 0);
    
    // Check specific fields for news articles
    if (allDataFiltered) {
      const newsArticles = allDataFiltered.filter(item => item.category === 'News Event');
      const apiArticles = allDataFiltered.filter(item => item.user_id === 'api');
      console.log('🔍 News articles found:', newsArticles.length);
      console.log('🔍 API articles found:', apiArticles.length);
      newsArticles.forEach(article => {
        console.log(`🔍 News article: ${article.title}`);
        console.log(`   user_id: ${article.user_id}`);
        console.log(`   is_public: ${article.is_public}`);
        console.log(`   is_approved: ${article.is_approved}`);
        console.log(`   coordinates: ${JSON.stringify(article.coordinates)}`);
      });
    }

    if (error) {
      console.error('❌ Error fetching user content:', error);
      throw error;
    }

    console.log('📊 Raw database data:', data);
    console.log('📊 Number of records:', data?.length || 0);

    // If no data with filters, try to get all data and filter manually
    let finalData = data;
    if (!data || data.length === 0) {
      console.log('⚠️ No filtered content found, trying to get all data...');
      if (allDataFiltered && allDataFiltered.length > 0) {
        // Filter manually to include news articles even if they don't have proper flags
        finalData = allDataFiltered.filter(item => {
          // Include if it's public and approved, OR if it's a news event, OR if it's API content
          return (item.is_public === true && item.is_approved === true) || 
                 (item.category === 'News Event') ||
                 (item.user_id === 'api');
        });
        console.log('📊 Manual filtered data:', finalData);
        console.log('📊 Manual filtered count:', finalData.length);
      }
    }

    if (!finalData || finalData.length === 0) {
      console.log('⚠️ No user content found in database');
      return [];
    }

    // Convert database format to UserGeneratedContent format
    const content: UserGeneratedContent[] = finalData.map(item => {
      console.log('🔄 Converting item:', item);
      return {
        id: item.id.toString(), // Convert to string
        title: item.title,
        description: item.description,
        author: item.author,
        createdAt: item.created_at,
        coordinates: item.coordinates,
        category: item.category,
        imageUrl: item.image_url,
        dateHappened: item.date_happened || '', // Use the actual field
        source: item.source || '' // Use the actual field
      };
    });

    console.log('✅ Converted user content:', content);
    return content;
  } catch (error) {
    console.error('❌ Failed to fetch user content from database:', error);
    console.error('❌ Error details:', error);
    // Fallback to localStorage
    const content = JSON.parse(localStorage.getItem('userContent') || '[]');
    console.log('🔄 Fallback to localStorage:', content);
    return content;
  }
};

// Real-time subscription for live updates
export const subscribeToUserContent = (onUpdate: (content: UserGeneratedContent[]) => void) => {
  const subscription = supabase
    .channel('user_content_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'userdots'
      },
      async () => {
        // Refetch all content when any change occurs
        const content = await getUserContent();
        onUpdate(content);
      }
    )
    .subscribe();

  return subscription;
};

// Interface for the backend response
interface SubmitContentResponse {
  success: boolean;
  contentId?: string;
  message: string;
}

// Interface for content review status
interface ContentReviewStatus {
  contentId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerNotes?: string;
  reviewedAt?: string;
}

/**
 * Service for handling user-generated content submissions
 * This is where you would integrate with your backend API
 */
export class UserContentService {
  private static instance: UserContentService;
  private baseUrl: string = 'http://localhost:3001/api'; // Default API URL

  private constructor() {
    // For now, use a hardcoded URL to avoid environment variable issues
    // You can configure this later when setting up your backend
  }

  public static getInstance(): UserContentService {
    if (!UserContentService.instance) {
      UserContentService.instance = new UserContentService();
    }
    return UserContentService.instance;
  }

  /**
   * Submit user-generated content for review
   */
  async submitContent(content: UserGeneratedContent): Promise<SubmitContentResponse> {
    try {
      console.log('📝 Submitting user content:', content);

      // Create FormData for image upload
      const formData = new FormData();
      formData.append('title', content.title);
      formData.append('description', content.description);
      formData.append('topic', content.topic);
      formData.append('coordinates', JSON.stringify(content.coordinates));
      formData.append('quiz', JSON.stringify(content.quiz));
      formData.append('status', content.status);

      if (content.image) {
        formData.append('image', content.image);
      }

      // TODO: Replace with your actual API endpoint
      const response = await fetch(`${this.baseUrl}/user-content`, {
        method: 'POST',
        body: formData,
        // Add authentication headers if needed
        // headers: {
        //   'Authorization': `Bearer ${getAuthToken()}`,
        // },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('📝 Content submitted successfully:', result);
      
      return {
        success: true,
        contentId: result.contentId,
        message: 'Content submitted successfully for review!'
      };

    } catch (error) {
      console.error('📝 Error submitting content:', error);
      
      // For now, simulate successful submission
      // Remove this when you implement the actual backend
      return this.simulateSubmission(content);
    }
  }

  /**
   * Get content review status
   */
  async getContentStatus(contentId: string): Promise<ContentReviewStatus | null> {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`${this.baseUrl}/user-content/${contentId}/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('📝 Error getting content status:', error);
      return null;
    }
  }

  /**
   * Get all user-submitted content for the current user
   */
  async getUserContent(): Promise<UserGeneratedContent[]> {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`${this.baseUrl}/user-content/my-content`, {
        // headers: {
        //   'Authorization': `Bearer ${getAuthToken()}`,
        // },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('📝 Error getting user content:', error);
      return [];
    }
  }

  /**
   * Simulate content submission for development/testing
   * Remove this when you implement the actual backend
   */
  private simulateSubmission(content: UserGeneratedContent): SubmitContentResponse {
    console.log('📝 Simulating content submission for development');
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store in localStorage for demo purposes
        const storedContent = {
          ...content,
          id: contentId,
          submittedAt: new Date().toISOString(),
          status: 'pending' as const
        };
        
        const existingContent = JSON.parse(localStorage.getItem('userGeneratedContent') || '[]');
        existingContent.push(storedContent);
        localStorage.setItem('userGeneratedContent', JSON.stringify(existingContent));
        
        resolve({
          success: true,
          contentId,
          message: 'Content submitted successfully for review! (Demo mode)'
        });
      }, 1000);
    });
  }

  /**
   * Get all pending content for admin review
   * This would be used by your admin panel
   */
  async getPendingContent(): Promise<UserGeneratedContent[]> {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch(`${this.baseUrl}/user-content/pending`, {
        // headers: {
        //   'Authorization': `Bearer ${getAdminToken()}`,
        // },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('📝 Error getting pending content:', error);
      
      // For demo purposes, return from localStorage
      const storedContent = JSON.parse(localStorage.getItem('userGeneratedContent') || '[]');
      return storedContent.filter((content: any) => content.status === 'pending');
    }
  }

  /**
   * Check for suspicious patterns in coordinate strings (anti-trolling)
   */
  private hasSuspiciousCoordinatePattern(str: string): boolean {
    // Remove decimal point for pattern analysis
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
      // Check if more than 80% of digits are the same
      const digitCounts: { [key: string]: number } = {};
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

  /**
   * Approve or reject content (admin function)
   */
  async reviewContent(contentId: string, status: 'approved' | 'rejected', notes?: string): Promise<boolean> {
    try {
      // For demo purposes, just update localStorage directly
      // TODO: Replace with your actual API endpoint when backend is ready
      console.log('📝 Reviewing content:', { contentId, status, notes });
      
      const storedContent = JSON.parse(localStorage.getItem('userGeneratedContent') || '[]');
      const contentIndex = storedContent.findIndex((content: any) => content.id === contentId);
      
      if (contentIndex !== -1) {
        storedContent[contentIndex].status = status;
        storedContent[contentIndex].reviewerNotes = notes;
        storedContent[contentIndex].reviewedAt = new Date().toISOString();
        localStorage.setItem('userGeneratedContent', JSON.stringify(storedContent));
        console.log('📝 Content reviewed successfully:', storedContent[contentIndex]);
        return true;
      } else {
        console.error('📝 Content not found:', contentId);
        return false;
      }

    } catch (error) {
      console.error('📝 Error reviewing content:', error);
      return false;
    }
  }
}

// Export singleton instance
export const userContentService = UserContentService.getInstance();
