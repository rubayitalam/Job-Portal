'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import {
  ArrowLeftIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EyeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  views: number;
  applicantCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  type: string;
}

interface UpdateJobDto {
  title?: string;
  description?: string;
  location?: string;
  type?: string;
}

const API_BASE_URL = 'http://localhost:3001';
const PAGE_SIZE = 5;  

export default function JobManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [jobFormData, setJobFormData] = useState<CreateJobDto | UpdateJobDto>({
    title: '',
    description: '',
    location: '',
    type: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchJobs(currentPage, searchTerm);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router, isAuthenticated]);

  const fetchJobs = useCallback(async (page: number, search: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/employer/jobs`, {
        params: { page, search, pageSize: PAGE_SIZE },
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        alert('Failed to fetch jobs. Please try again.');
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(1, searchTerm);  
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      fetchJobs(page, searchTerm);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentJob(null);
    setJobFormData({ title: '', description: '', location: '', type: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setIsEditing(true);
    setCurrentJob(job);
    setJobFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/employer/jobs/${currentJob?.id}`, jobFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Job updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/employer/jobs`, jobFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Job created successfully!');
      }
      setIsModalOpen(false);
      fetchJobs(currentPage, searchTerm);
    } catch (error: any) {
      alert(`Error ${isEditing ? 'updating' : 'creating'} job: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      await axios.delete(`${API_BASE_URL}/employer/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Job deleted successfully!');
      fetchJobs(currentPage, searchTerm);
    } catch (error: any) {
      alert(`Error deleting job: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
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
            className="flex items-center space-x-3 p-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 font-semibold"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Job Management</span>
          </Link>
        </nav>
        <div className="mt-auto text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>Jobie Portal</p>
          <p className="mt-1">© 2025 </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Jobs</h1>
          <div className="flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative w-72">
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
            <button
              onClick={() => fetchJobs(currentPage, searchTerm)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              title="Refresh Jobs"
            >
              <ArrowPathIcon className="h-6 w-6" />
            </button>
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Current Job Listings</h3>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add New Job
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600 text-center">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600 text-center">No jobs found. Start by adding a new job!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job, index) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * PAGE_SIZE + index + 1} {/* সিরিয়াল নম্বর */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <UsersIcon className="h-5 w-5 mr-1 text-gray-600" />
                          <span className="font-semibold">{job.applicantCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                        <button
                          onClick={() => handleOpenEditModal(job)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 p-1 rounded-md hover:bg-gray-100"
                          title="Edit Job"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <Link
                          href={`/applications?jobId=${job.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4 p-1 rounded-md hover:bg-gray-100"
                          title="View Applicants for this Job (Details)"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-gray-100"
                          title="Delete Job"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <nav className="mt-6 flex justify-center" aria-label="Pagination">
                  <ul className="flex items-center -space-x-px h-10 text-base">
                    <li>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ArrowLeftIcon className="h-4 w-4" />
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page}>
                        <button
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                            currentPage === page ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 bg-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Job' : 'Create New Job'}</h2>
            <form onSubmit={handleSubmitJob}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={jobFormData.title}
                  onChange={handleJobFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={jobFormData.description}
                  onChange={handleJobFormChange}
                  rows={5}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={jobFormData.location}
                  onChange={handleJobFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                  Job Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={jobFormData.type}
                  onChange={handleJobFormChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Job' : 'Create Job')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
