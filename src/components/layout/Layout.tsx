import React from 'react';
import Sidebar from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-timelingo-navy/95 to-purple-900/90">
      <Sidebar />
      <main className="flex-1 ml-64 p-0">
        {children}
      </main>
    </div>
  );
}
