import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";

interface UserActionsProps {
  signOut: () => Promise<void>;
  user: any; // Accept user object for email check
}

const ADMIN_EMAILS = ["maurokjaer@gmail.com", "test@gmail.com"];

const UserActions: React.FC<UserActionsProps> = ({ signOut, user }) => {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
      {isAdmin && (
        <Button 
          variant="outline" 
          asChild 
          className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white"
        >
          <Link to="/admin" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Admin</span>
          </Link>
        </Button>
      )}
      <Button 
        variant="outline" 
        onClick={handleSignOut}
        className="bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white flex items-center gap-2"
      >
        <LogOut size={16} />
        <span>Sign Out</span>
      </Button>
    </div>
  );
};

export default UserActions;
