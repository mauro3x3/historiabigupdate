import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// Temporary placeholder for Sidebar
const Sidebar = () => (
  <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white border-r border-gray-700 z-50">
    <div className="p-6 border-b border-gray-700">
      <span className="text-xl font-bold">Historia</span>
    </div>
  </div>
);

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
