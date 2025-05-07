import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, BookOpen } from "lucide-react";
import EraLabel from "@/components/admin/lesson/EraLabel";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface UserProfileHeaderProps {
  user: User | null;
  displayName: string;
  setDisplayName: (name: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  preferredEra: string | null;
  setShowEraSelector: (show: boolean) => void;
  avatarAltText?: string;
  avatarSrc?: string;
}

const AVATAR_MAP = {
  mascot_default: '/images/avatars/Johan.png',
  // Add more avatar options here in the future
};

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  displayName,
  setDisplayName,
  isEditing,
  setIsEditing,
  preferredEra,
  setShowEraSelector,
  avatarAltText,
  avatarSrc,
}) => {
  const form = useForm({
    defaultValues: {
      displayName: displayName,
    },
  });
  
  const navigate = useNavigate();

  const handleSaveProfile = async (data: { displayName: string }) => {
    if (!user) return;
    
    try {
      // Update both username and display_name fields
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          username: data.displayName,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setDisplayName(data.displayName);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setIsEditing(false);
  };
  
  const handleViewMap = () => {
    if (preferredEra) {
      navigate(`/historical-map/${preferredEra}`);
    } else {
      navigate('/historical-map/list'); // Navigate to the list of maps
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="relative flex flex-col items-center mb-2">
        <div className="rounded-full bg-gradient-to-br from-yellow-200 via-timelingo-gold to-purple-300 p-2 shadow-lg">
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
            <AvatarImage src={avatarSrc || AVATAR_MAP[user?.user_metadata?.avatar_base || 'mascot_default']} alt={avatarAltText || 'User avatar'} />
            <AvatarFallback className="bg-timelingo-purple text-4xl">
              {displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white drop-shadow-sm">{displayName}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-white/10"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} />
          </Button>
        </div>
      </div>
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-2">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Display name" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      autoFocus
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                size="sm" 
                className="bg-timelingo-gold hover:bg-amber-500 text-gray-900"
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Save
              </Button>
              <Button 
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="border-white/20 hover:bg-white/10 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default UserProfileHeader;
