'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import {
  ArrowLeftIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpTrayIcon, 
  ArrowDownTrayIcon, 
  FolderIcon, 
} from '@heroicons/react/24/outline';

interface Template {
  id: number;
  name: string;
  filecontent?: {
    type: 'Buffer';
    data: number[];
  };
}

export default function ContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  // Fetch temp func with axios
  const fetchTemplates = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = 'http://localhost:3001/career-resources/templates';

      const res = await axios.get<Template[]>(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = res.data;
      console.log("API Response Data for Templates:", responseData);

      if (Array.isArray(responseData)) {
        setTemplates(responseData);
      } else {
        setTemplates([]);
        console.warn("API response for templates was not an array:", responseData);
      }

    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      console.error("Failed to fetch templates:", error);
      setTemplates([]);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplates();
    }
  }, [isAuthenticated, fetchTemplates]);

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setTemplateName(event.target.files[0].name.split('.').slice(0, -1).join('.'));
      setUploadMessage(null);
      setUploadError(null);
    } else {
      setSelectedFile(null);
      setTemplateName('');
    }
  };

  // Upload  with axios
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadMessage(null);
    setUploadError(null);

    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!templateName.trim()) {
      setUploadError("Please enter a name for the template.");
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', templateName);

      const res = await axios.post('http://localhost:3001/career-resources/upload-template', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      });

      const newTemplate: Template = res.data;
      setUploadMessage(`File "${newTemplate.name}" uploaded successfully!`);
      fetchTemplates();

      
      setSelectedFile(null);
      setTemplateName('');
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      setUploadError(error.response?.data?.message || "Failed to upload file.");
      console.error("Failed to upload template:", error);
    }
  };

  // Download handler with axios
  const handleDownload = async (templateId: number, templateName: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = `http://localhost:3001/career-resources/download-template/${templateId}`;

      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', //  file download
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = templateName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to download template:", error);
      alert("Failed to download template. Please try again.");
    }
  };

  // Logout 
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
            href="/search"
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 rotate-180" />
            <span>Search Jobs</span>
          </Link>
          <Link
            href="/applications"
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 font-semibold"
          >
            <FolderIcon className="h-5 w-5" />
            <span>Job Applications</span>
          </Link>
        </nav>
        <div className="mt-auto text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>Jobie Portal</p>
          <p className="mt-1">© 2025 </p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Career Resources</h1>
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

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Template</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
              <input
                type="text"
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Career Checklist PDF"
                required
              />
            </div>
            <div>
              <label htmlFor="file-upload-input" className="block text-sm font-medium text-gray-700 mb-1">Select File (PDF)</label>
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFile.name}</p>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Upload Template
            </button>
            {uploadMessage && <p className="mt-2 text-sm text-green-600">{uploadMessage}</p>}
            {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Templates</h2>
          {templates.length === 0 && !loading ? (
            <p className="text-gray-600">No templates found. Upload one to get started!</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {templates.map((template) => (
                <li key={template.id} className="py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-900">{template.name}</p>
                    <p className="text-sm text-gray-500">ID: {template.id}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(template.id, template.name)}
                    className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ArrowDownTrayIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    Download
                  </button>
                </li>
              ))}
            </ul>
          )}
          {loading && templates.length === 0 && isAuthenticated && (
            <p className="text-gray-600">Loading templates...</p>
          )}
        </section>
      </main>
    </div>
  );
}
