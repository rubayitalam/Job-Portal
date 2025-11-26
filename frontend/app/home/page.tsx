
'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/outline';

import Link from 'next/link'; 
import {
  MagnifyingGlassIcon, 
  RectangleStackIcon,
  ChatBubbleBottomCenterTextIcon, 
  ArrowUpTrayIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon, 
} from '@heroicons/react/24/outline'; 

interface SidebarLinkProps {
    icon: React.ReactNode;
    text: string;
    href: string; 
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, text, href }) => (
    <Link
        href={href}
        className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 font-semibold"
    >
        {icon}
        <span>{text}</span>
    </Link>
);


export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('User');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
     
      setUserName('Admin ');
    } else {
 
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading home page...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col border-r border-gray-200">
        <div className="flex items-center mb-10">
          <img src="/jobie-logo.png" alt="Jobie Logo" className="h-10 w-auto mr-2" />
          <span className="text-2xl font-bold text-indigo-700">Jobie</span>
        </div>
        <nav className="flex-1 space-y-2">
          {/* Main navigation links */}
          <SidebarLink icon={<MagnifyingGlassIcon className="h-5 w-5" />} text="Search Job" href="/search" />
          <SidebarLink icon={<RectangleStackIcon className="h-5 w-5" />} text="Applications" href="/applications" />
          <SidebarLink icon={<ChatBubbleBottomCenterTextIcon className="h-5 w-5" />} text="Messages" href="/messages" />
          <SidebarLink icon={<ArrowUpTrayIcon className="h-5 w-5" />} text="Content Upload" href="/content" />
           <SidebarLink icon={<BriefcaseIcon className="h-5 w-5" />} text="Job Managemnet" href="/management" />
           <SidebarLink icon={<UserGroupIcon className="h-5 w-5" />} text="Employee Managemnet" href="/employer" />
           
        </nav>
        <div className="mt-auto text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>Jobie Portal</p>
          <p className="mt-1">© 2025 </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome to Jobie Portal!</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-7 w-7 text-gray-600" />
              <span className="font-medium text-gray-700">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Home page main content section */}
        <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">What would you like to do today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
           
            <NavigationCard
              icon={<MagnifyingGlassIcon className="h-10 w-10 text-indigo-600" />}
              title="Search Jobs"
              description="Find your next career opportunity."
              href="/search"
            />

            <NavigationCard
              icon={<RectangleStackIcon className="h-10 w-10 text-blue-600" />}
              title="View Applications"
              description="Manage your submitted job applications."
              href="/applications"
            />
            <NavigationCard
              icon={<ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-green-600" />}
              title="Check Messages"
              description="Communicate with employers and applicants."
              href="/messages"
            />
            <NavigationCard
              icon={<ArrowUpTrayIcon className="h-10 w-10 text-purple-600" />}
              title="Upload Content"
              description="Share articles, videos, or portfolio items."
              href="/content"
            />
             <NavigationCard
               icon={<BriefcaseIcon className="h-10 w-10 text-red-600" />}
               title="Manage Jobs"
               description="Post, edit, or remove job listings."
             href="/management"
            />
            
             <NavigationCard
               icon={<UserGroupIcon className="h-10 w-10 text-red-600" />}
               title="Employee Management"
               description="Add, edit, or remove Employee listings."
             href="/employer"
            />
            
              <NavigationCard
               icon={<ChartBarIcon className="h-10 w-10 text-indigo-600" />}
              title="Job Portal Analytics"
              description="View jobs, applications, users, and reports."
              href="/report"
            />

          </div>
        </section>

        {}
      </main>
    </div>
  );
}


interface NavigationCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ icon, title, description, href }) => (
    <Link
        href={href}
        className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer text-center"
    >
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </Link>
);

