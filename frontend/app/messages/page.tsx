'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function MessagePage() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSendEmail = async () => {
    setStatusMessage('');
    if (!recipientName || !recipientEmail || !emailTitle || !messageBody) {
      setStatusMessage("Please fill in all fields (Recipient's Name, Recipient's Email, Subject, Message).");
      return;
    }

    try {
      const res = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
        service_id: 'service_mygmailaccount',
        template_id: 'template_y225jum',
        user_id: 'BpgtPjMJKJzzoCj9q',
        template_params: {
          to_name: recipientName,
          to_email: recipientEmail,
          subject: emailTitle,
          message: messageBody,
        },
      });

      if (res.status === 200) {
        setStatusMessage('Email sent successfully!');
        setRecipientName('');
        setRecipientEmail('');
        setEmailTitle('');
        setMessageBody('');
      } else {
        setStatusMessage('Failed to send email. Please try again.');
      }
    } catch (error: any) {
      setStatusMessage(`Failed to send email. Error: ${error.message || 'Unknown error'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

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
            href="/applications"
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 font-semibold"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span>Applications</span>
          </Link>
        </nav>
        <div className="mt-auto text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>Jobie Portal</p>
          <p className="mt-1">© 2025 </p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Send Email to Applicant</h1>
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
          {statusMessage && (
            <div className={`mb-4 p-3 rounded-md ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {statusMessage}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
              Recipient's Name:
            </label>
            <input
              type="text"
              id="recipientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="Applicant's Full Name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700">
              Recipient's Email:
            </label>
            <input
              type="email"
              id="recipientEmail"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="applicant_email@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="emailTitle" className="block text-sm font-medium text-gray-700">
              Subject:
            </label>
            <input
              type="text"
              id="emailTitle"
              value={emailTitle}
              onChange={(e) => setEmailTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="Subject of the email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="messageBody" className="block text-sm font-medium text-gray-700">
              Message:
            </label>
            <textarea
              id="messageBody"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="Write your message to the applicant here..."
            ></textarea>
          </div>

          <button
            onClick={handleSendEmail}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-2 -ml-1" />
            Send Email
          </button>
        </section>
      </main>
    </div>
  );
}
