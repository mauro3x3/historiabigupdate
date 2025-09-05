import { UserGeneratedContent } from '@/components/globe/AddContentModal';

// Service for managing user-generated content
export const saveUserContent = async (content: Omit<UserGeneratedContent, 'id' | 'createdAt'>): Promise<UserGeneratedContent> => {
  // For now, we'll just return the content with generated ID and timestamp
  // In a real app, this would save to a database
  const newContent: UserGeneratedContent = {
    ...content,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  // Store in localStorage for persistence
  const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
  existingContent.push(newContent);
  localStorage.setItem('userContent', JSON.stringify(existingContent));
  
  return newContent;
};

export const getUserContent = async (): Promise<UserGeneratedContent[]> => {
  // Retrieve from localStorage
  const content = JSON.parse(localStorage.getItem('userContent') || '[]');
  return content;
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
