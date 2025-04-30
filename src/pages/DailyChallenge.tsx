
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import DailyChallengeContainer from '@/components/dailychallenge/DailyChallengeContainer';
import { Calendar, BookOpen, Clock, Trophy } from 'lucide-react';

const DailyChallenge = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Set default Open Graph meta tags for the daily challenge page
    document.title = "Historia - Daily History Challenge";
    
    // Create or update meta tags
    const metaTags = [
      { property: 'og:title', content: 'Historia - Daily History Challenge' },
      { property: 'og:description', content: 'Test your knowledge of historical events in our daily chronology challenge!' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${window.location.origin}/lovable-uploads/405a26db-92ac-4dce-94a8-d36e1db4ff83.png` },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:image', content: `${window.location.origin}/lovable-uploads/405a26db-92ac-4dce-94a8-d36e1db4ff83.png` },
    ];
    
    metaTags.forEach(tag => {
      let meta = document.querySelector(`meta[property="${tag.property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', tag.content);
    });
    
    return () => {
      // No need to clean up as these are general page meta tags
    };
  }, []);

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Logo />
          <button 
            className="text-sm text-timelingo-purple font-semibold hover:text-timelingo-purple/80 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content column */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-timelingo-purple/10 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-timelingo-purple" />
              </div>
              <h1 className="text-2xl font-bold text-timelingo-navy">Daily Challenge</h1>
            </div>
            
            <div className="max-w-3xl">
              <DailyChallengeContainer onComplete={handleComplete} />
            </div>
          </div>
          
          {/* Sidebar/info column */}
          <div className="md:w-80 space-y-6">
            {/* Daily challenge benefits card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
              <h3 className="text-lg font-semibold text-timelingo-navy mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-timelingo-gold" />
                Benefits of Daily Challenges
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="mt-1 text-green-500">•</div>
                  <span>Strengthen your knowledge of historical chronology</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="mt-1 text-green-500">•</div>
                  <span>Earn extra XP to boost your learning progress</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="mt-1 text-green-500">•</div>
                  <span>Build a consistent learning habit with daily activities</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="mt-1 text-green-500">•</div>
                  <span>Compete with friends by sharing your results</span>
                </li>
              </ul>
            </div>
            
            {/* Historical fact of the day */}
            <div className="bg-gradient-to-br from-timelingo-navy to-indigo-900 p-6 rounded-xl shadow-md text-white">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Historical Fact of the Day
              </h3>
              <p className="text-sm mb-3">
                Did you know? The Great Wall of China is not visible from space with the naked eye, contrary to popular belief. This myth began in the 1930s and persists despite astronauts confirming they cannot see it from orbit.
              </p>
              <div className="text-xs text-blue-200 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Updated daily
              </div>
            </div>
            
            {/* Streak tracker */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
              <h3 className="text-lg font-semibold text-timelingo-navy mb-3">Your Challenge Streak</h3>
              <div className="flex justify-center mb-3">
                <div className="bg-timelingo-purple/10 rounded-full h-20 w-20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-timelingo-purple">7</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">Complete today's challenge to maintain your streak!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyChallenge;
