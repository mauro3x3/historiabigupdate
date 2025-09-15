import { addDailyNewsToGlobe, clearOldNewsArticles } from '../services/newsService';

// Script to add daily news to the globe
async function main() {
  try {
    console.log('Starting daily news integration...');
    
    // Optional: Clear old news articles first
    // await clearOldNewsArticles();
    
    // Add new news articles
    await addDailyNewsToGlobe();
    
    console.log('Daily news integration completed successfully!');
  } catch (error) {
    console.error('Daily news integration failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main as addDailyNews };
