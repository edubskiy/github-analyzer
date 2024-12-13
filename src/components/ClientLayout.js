'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'ml-64' : 'ml-0'}
      `}>
        {children}
      </main>
    </div>
  );
} 