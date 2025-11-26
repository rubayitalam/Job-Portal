'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import {
  ArrowLeftIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

interface Application {
  id: number;
  jobId: string;
  candidateName: string;
  email: string;
  resumeLink: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  appliedAt: string;
}

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const statusColorClass = application.status === 'Accepted'
    ? 'text-green-600'
    : application.status === 'Rejected'
    ? 'text-red-600'
    : 'text-yellow-600';

  const StatusIcon = application.status === 'Accepted'
    ? CheckCircleIcon
    : ExclamationCircleIcon;

  return (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
      <h4 className="text-lg font-semibold text-gray-800">{application.candidateName}</h4>
      <p className="text-sm text-gray-600">Email: {application.email}</p>
      <p className="text-sm text-gray-600">Job ID: {application.jobId}</p>

      <div className="flex items-center space-x-2 text-sm mt-2">
        <StatusIcon className={`h-5 w-5 ${statusColorClass}`} />
        <span className={`font-medium ${statusColorClass}`}>{application.status}</span>
      </div>

      {application.resumeLink && (
        <a
          href={application.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-indigo-600 hover:underline mt-2 text-sm"
        >
          <PaperClipIcon className="h-4 w-4 mr-1" />
          View Resume
        </a>
      )}

      <Link
        href={`/messages?recipientEmail=${encodeURIComponent(application.email)}`}
        className="flex items-center text-blue-600 hover:underline mt-2 text-sm"
      >
        <EnvelopeIcon className="h-4 w-4 mr-1" />
        Compose Email
      </Link>

      <p className="text-xs text-gray-500 mt-2">Applied: {new Date(application.appliedAt).toLocaleString()}</p>
    </div>
  );
};

const API_BASE_URL = 'http://localhost:3001';

export default function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchJobId, setSearchJobId] = useState('');
  const [currentJobId, setCurrentJobId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchApplications = useCallback(async (jobIdToFetch?: string) => {
    setLoading(true);
    console.log("fetchApplications called. jobIdToFetch:", jobIdToFetch || "none (fetching general list)");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No authentication token found, redirecting to login.");
        router.push('/login');
        return;
      }

      let apiUrl: string;
      if (jobIdToFetch) {
        apiUrl = `${API_BASE_URL}/employer/jobs/${jobIdToFetch}/applications`;
        setCurrentJobId(jobIdToFetch);
        console.log("API URL for specific job:", apiUrl);
      } else {
        apiUrl = `${API_BASE_URL}/employer/applications`;
        setCurrentJobId('');
        console.log("API URL for general applications:", apiUrl);
      }

      const res = await axios.get<Application[]>(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`API Response Status: ${res.status} for URL: ${apiUrl}`);
      console.log(`API Response Data:`, res.data);

      if (Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setApplications([]);
        console.warn("API response for applications was not an array or was empty:", res.data);
      }

    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Authentication failed (401). Removing token and redirecting.");
        localStorage.removeItem('token');
        router.push('/login');
      } else if (error.response?.status === 404) {
        setApplications([]);
        console.warn(`No applications found at requested endpoint.`);
      } else {
        console.error("Failed to fetch applications:", error);
        setApplications([]);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      const jobIdFromUrl = searchParams.get('jobId');

      if (jobIdFromUrl) {
        setSearchJobId(jobIdFromUrl);
        fetchApplications(jobIdFromUrl);
      } else {
        fetchApplications();
      }
    }
  }, [isAuthenticated, searchParams, fetchApplications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications(searchJobId);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchJobId(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading page...</p>
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
          <Link
            href="/management"
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.158l-11.353-2.839A2.252 2.252 0 0 0 8.25 8.19V6.101M2.25 10.5h11.353m-2.839 2.839L20.25 14.158m0 0l-5.263 1.316a2.252 2.252 0 0 1-2.203 2.203l-1.316 5.263m1.316-5.263l2.839 11.353a2.252 2.252 0 0 0 3.869-1.464l1.316-5.263m-1.316 5.263l-2.839 11.353m-11.353-2.839L3.75 16.5h-.008m-.008-6H12m2.25-2.25h.008v.008H14.25m-2.25-2.25h.008v.008H12m-2.25-2.25h.008v.008H9.75M9 12.75l2.25 2.25L15 9.75M3.75 6.75h.008v.008H3.75Z" />
            </svg>
            <span>Job Management</span>
          </Link>
        </nav>
        <div className="mt-auto text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>Jobie Portal</p>
          <p className="mt-1">© 2025 </p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Job Applications</h1>
          <div className="flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative w-72">
              <input
                type="text"
                placeholder="Enter Job ID (e.g., 2)"
                value={searchJobId}
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {currentJobId ? `Applications for Job ID: ${currentJobId}` : 'All Recent Job Applications'}
          </h3>
          {loading ? (
            <p className="col-span-3 text-gray-600 text-center">Loading applications...</p>
          ) : applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                />
              ))}
            </div>
          ) : (
            <p className="col-span-3 text-gray-600 text-center">
              {currentJobId
                ? `No applications found for Job ID: ${currentJobId}.`
                : 'No recent applications found. Please ensure your backend is running and the /employer/applications endpoint returns data.'}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
