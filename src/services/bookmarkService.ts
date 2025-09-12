import { supabase } from '@/integrations/supabase/client';

export interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'module' | 'user_content';
  created_at: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  content_id: string;
  content_type: 'module' | 'user_content';
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

// Bookmark functions
export const addBookmark = async (contentId: string, contentType: 'module' | 'user_content'): Promise<Bookmark> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_bookmarks')
      .insert({
        user_id: user.id,
        content_id: contentId,
        content_type: contentType
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add bookmark:', error);
    throw error;
  }
};

export const removeBookmark = async (contentId: string, contentType: 'module' | 'user_content'): Promise<void> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
    throw error;
  }
};

export const getUserBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch bookmarks:', error);
    return [];
  }
};

export const isBookmarked = async (contentId: string, contentType: 'module' | 'user_content'): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return false;
    }

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking bookmark status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check bookmark status:', error);
    return false;
  }
};

// Report functions
export const reportContent = async (
  contentId: string, 
  contentType: 'module' | 'user_content',
  reason: string,
  description?: string
): Promise<ContentReport> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('content_reports')
      .insert({
        reporter_id: user.id,
        content_id: contentId,
        content_type: contentType,
        reason,
        description
      })
      .select()
      .single();

    if (error) {
      console.error('Error reporting content:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to report content:', error);
    throw error;
  }
};

export const getUserReports = async (): Promise<ContentReport[]> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('content_reports')
      .select('*')
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return [];
  }
};
