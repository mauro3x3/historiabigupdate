
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">TimeLingo Admin</h1>
        <p className="text-gray-500">Manage content, learning tracks, and quizzes</p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>
    </header>
  );
};

export default AdminHeader;
