'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface Job {
  id: number;
  title: string;
}

interface Application {
  id: number;
  jobId: number;
  candidateName: string;
  email: string;
  appliedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ReportPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const jobRes = await axios.get('http://localhost:3001/employer/jobs?page=1', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobRes.data.data || []);
        setTotalJobs(jobRes.data.total || 0);

        const applicationRequests = (jobRes.data.data || []).map((job: Job) =>
          axios.get(`http://localhost:3001/employer/jobs/${job.id}/applications`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.data)
        );
        const applicationsNested = await Promise.all(applicationRequests);
        setApplications(applicationsNested.flat());

        const userRes = await axios.get('http://localhost:3001/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(userRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading report...</p>
      </div>
    );
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
          <p className="mt-1">© 2025 </p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">📊 Job Portal Analytics</h1>
          <div className="flex items-center space-x-6">
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">Total Jobs Posted</h2>
              <p className="text-4xl font-bold text-indigo-600 mt-2">{totalJobs}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">Total Applications</h2>
              <p className="text-4xl font-bold text-indigo-600 mt-2">{applications.length}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800">Total Employers</h2>
              <p className="text-4xl font-bold text-indigo-600 mt-2">{users.length}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
