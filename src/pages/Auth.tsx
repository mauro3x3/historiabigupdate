import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isOnboarded } = useUser();
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Set initial tab based on URL parameter if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [location]);

  // Wait for user and isOnboarded to be loaded before redirecting
  useEffect(() => {
    if ((user === null) || (user !== null && typeof isOnboarded === 'boolean')) {
      setProfileLoaded(true);
    }
  }, [user, isOnboarded]);

  useEffect(() => {
    if (profileLoaded) {
      if (user) {
        if (isOnboarded) {
          navigate('/profile');
        } else {
          navigate('/onboarding');
        }
      }
    }
  }, [profileLoaded, user, isOnboarded, navigate]);

  if (!profileLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <AuthLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm setActiveTab={setActiveTab} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default AuthPage;
