import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useUser } from '@/contexts/UserContext';
import GuestContent from '@/components/home/hero/GuestContent';

const Index = () => {
  const navigate = useNavigate();
  const { user, isOnboarded } = useUser();
  
  React.useEffect(() => {
    // If user is already authenticated and onboarded, redirect to dashboard
    if (user && isOnboarded) {
      navigate('/dashboard');
    }
  }, [user, isOnboarded, navigate]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
        <GuestContent />
      </div>
    );
  }

  // If user is logged in, show the original content (or redirect)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      <div className="container mx-auto px-4">
        <header className="py-6 flex justify-between items-center">
          <Logo />
          <div>
            <Button variant="outline" className="mr-2" onClick={() => navigate('/auth')}>
              Log In
            </Button>
            <Button className="bg-timelingo-purple hover:bg-purple-700" onClick={() => navigate('/auth?tab=signup')}>
              Sign Up
            </Button>
          </div>
        </header>
        
        <main className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-timelingo-navy leading-tight">
                Learn History<br />
                <span className="text-timelingo-purple">The Fun Way</span>
              </h1>
              <p className="text-lg text-gray-600">
                Discover the past through interactive lessons, historical role-playing, and exciting challenges. Become a history expert one lesson at a time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-timelingo-purple hover:bg-purple-700"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm">Join 10,000+ history enthusiasts</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="aspect-square rounded-xl bg-gray-100 flex flex-col items-center justify-center p-8 mb-4">
                <div className="text-6xl mb-4">🏛️</div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-timelingo-navy mb-2">
                    Explore Ancient Civilizations
                  </h3>
                  <p className="text-gray-600">
                    Dive into the world of ancient Egypt, Rome, and more through interactive lessons
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-amber-100 rounded-lg p-3 flex flex-col items-center justify-center">
                  <span className="text-2xl">⚔️</span>
                  <span className="text-xs font-medium text-center mt-1">Wars & Battles</span>
                </div>
                <div className="bg-blue-100 rounded-lg p-3 flex flex-col items-center justify-center">
                  <span className="text-2xl">👑</span>
                  <span className="text-xs font-medium text-center mt-1">Famous Leaders</span>
                </div>
                <div className="bg-green-100 rounded-lg p-3 flex flex-col items-center justify-center">
                  <span className="text-2xl">🔍</span>
                  <span className="text-xs font-medium text-center mt-1">Discoveries</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center text-timelingo-navy mb-12">
              How TimeLingo Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-timelingo-purple/10 flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🎯</div>
                </div>
                <h3 className="text-xl font-bold text-timelingo-navy mb-2">
                  Personalized Learning
                </h3>
                <p className="text-gray-600">
                  Tell us your interests and we'll tailor content just for you
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-timelingo-purple/10 flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🎮</div>
                </div>
                <h3 className="text-xl font-bold text-timelingo-navy mb-2">
                  Interactive Scenarios
                </h3>
                <p className="text-gray-600">
                  Make decisions as historical figures and see how events unfold
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-timelingo-purple/10 flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">🏆</div>
                </div>
                <h3 className="text-xl font-bold text-timelingo-navy mb-2">
                  Track Your Progress
                </h3>
                <p className="text-gray-600">
                  Earn XP, unlock achievements, and track your learning journey
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
