import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// List of known problematic titles and their fixes
const titleFixes: Record<string, string> = {
  'Middleeast': 'Middle East',
  'Southasia': 'South Asia',
  'Iberia': 'Iberia', // Example, add more as needed
  // Add more mappings as needed
};

function insertSpaces(title: string): string {
  // Try to fix common cases, fallback to inserting space before capital letters
  if (titleFixes[title]) return titleFixes[title];
  return title.replace(/([a-z])([A-Z])/g, '$1 $2');
}

async function fixTitles() {
  const { data: videos, error } = await supabase.from('videos').select('id, title');
  if (error) {
    console.error('Error fetching videos:', error);
    return;
  }
  for (const video of videos) {
    const fixedTitle = insertSpaces(video.title);
    if (fixedTitle !== video.title) {
      const { error: updateError } = await supabase.from('videos').update({ title: fixedTitle }).eq('id', video.id);
      if (updateError) {
        console.error(`Failed to update title for video ${video.id}:`, updateError);
      } else {
        console.log(`Updated title: '${video.title}' -> '${fixedTitle}'`);
      }
    }
  }
  console.log('Video title fix complete.');
}

fixTitles(); 