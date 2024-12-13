'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'bg-gray-100 dark:bg-gray-800' : '';
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/tavily-logo.png"
            alt="Tavily Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            tavily
          </span>
        </Link>
      </div>

      {/* Account Selector */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <select className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md">
          <option>Personal</option>
        </select>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        <Link 
          href="/overview"
          className={`flex items-center gap-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/overview')}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Overview
        </Link>

        <Link 
          href="/research-assistant"
          className={`flex items-center gap-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/research-assistant')}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Research Assistant
        </Link>

        <Link 
          href="/research-reports"
          className={`flex items-center gap-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/research-reports')}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Research Reports
        </Link>

        <Link 
          href="/api-playground"
          className={`flex items-center gap-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/api-playground')}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          API Playground
        </Link>

        <Link 
          href="/invoices"
          className={`flex items-center gap-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/invoices')}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Invoices
        </Link>

        <Link 
          href="/documentation"
          className={`flex items-center gap-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/documentation')}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Documentation
        </Link>
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">e.dubskiy@gmail.com</p>
          </div>
          <button className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}