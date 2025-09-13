import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Settings as SettingsIcon, User, Bell, Volume2, VolumeX, Calendar, LogOut, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { dateFormat, setDateFormat } = useSettings();
  
  // Sound settings state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });
  
  // Notifications settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') !== 'false';
  });

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('soundEnabled', enabled.toString());
    toast.success(enabled ? 'Sound effects enabled' : 'Sound effects disabled');
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('notificationsEnabled', enabled.toString());
    toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-timelingo-navy/95 to-purple-900/90 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-300">Manage your account preferences and application settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Settings */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Account
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Email</Label>
                  <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>
              </div>
              
              <Separator className="bg-white/20" />
              
              <Button 
                onClick={handleSignOut}
                className="w-full bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sliders className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription className="text-gray-300">
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Format */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white" />
                  <Label className="text-white font-medium">Date Format</Label>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-white/30 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="dateFormat"
                      value="european"
                      checked={dateFormat === 'european'}
                      onChange={(e) => setDateFormat(e.target.value as 'european')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-white">European (DD/MM/YYYY)</div>
                      <div className="text-sm text-gray-300">12 September 2025</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-white/30 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="dateFormat"
                      value="american"
                      checked={dateFormat === 'american'}
                      onChange={(e) => setDateFormat(e.target.value as 'american')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-white">American (MM/DD/YYYY)</div>
                      <div className="text-sm text-gray-300">September 12, 2025</div>
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                Audio
              </CardTitle>
              <CardDescription className="text-gray-300">
                Control sound effects and audio settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white font-medium">Sound Effects</Label>
                  <p className="text-sm text-gray-300">
                    Play sounds for interactions and notifications
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white font-medium">Browser Notifications</Label>
                  <p className="text-sm text-gray-300">
                    Show browser notifications for updates
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Historia v1.0.0 • Built with React and Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
