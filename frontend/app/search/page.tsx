'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  company?: string;
  salary?: string;
}

interface JobCardProps {
  title: string;
  company?: string;
  salary?: string;
  type: string;
  location?: string;
  description: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, company, salary, type, location, description }) => (
  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
    <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    {company && <p className="text-sm text-gray-600">{company}</p>}
    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
    {salary && <p className="text-indigo-600 font-medium mt-2">{salary}</p>}
    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
      <ClockIcon className="h-4 w-4" />
      <span>{type}</span>
      {location && (
        <>
          <span className="mx-1">•</span>
          <span>{location}</span>
        </>
      )}
    </div>
    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
      See Details
    </button>
  </div>
);

export default function SearchJobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const fetchJobs = useCallback(async (page: number, search: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3001/employer/jobs`, {
        params: { page, search },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const responseData = response.data;

      if (responseData && Array.isArray(responseData.data)) {
        setJobs(responseData.data);
        setTotalPages(typeof responseData.totalPages === 'number' ? responseData.totalPages : 1);
      } else {
        setJobs([]);
        setTotalPages(1);
      }

    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      setJobs([]);
      setTotalPages(1);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm, fetchJobs, isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading job search page...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col border-r border-gray-200">
        <div className="flex items-center mb-10">
          <img src="/jobie-logo.png" alt="Jobie Logo" className="h-10 w-auto mr-2" />
          <span className="text-2xl font-bold text-indigo-700">Jobie</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Link
            href="/home"
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </nav>
        <div className="mt-auto text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>Jobie Portal</p>
          <p className="mt-1">© 2025 All Rights Reserved</p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Job Search</h1>
          <div className="flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative w-72">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
            <div className="flex items-center space-x-2 cursor-pointer group">
              <UserCircleIcon className="h-9 w-9 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              <span className="font-medium text-gray-700">Admin</span>
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

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  salary={job.salary}
                  type={job.type}
                  location={job.location}
                  description={job.description}
                />
              ))
            ) : (
              <p className="col-span-3 text-gray-600 text-center">There is no job find. Try Again</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
