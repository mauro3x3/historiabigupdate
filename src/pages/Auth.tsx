
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/contexts/UserContext';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isOnboarded } = useUser();

  // Set initial tab based on URL parameter if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // If user is already onboarded, go to profile page
      if (isOnboarded) {
        navigate('/profile');
      } else {
        // If new user, go to onboarding
        navigate('/onboarding');
      }
    }
  }, [user, isOnboarded, navigate]);

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
