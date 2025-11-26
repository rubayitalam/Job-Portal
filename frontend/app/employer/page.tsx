'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface CreateUserDto {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
}

export default function EmployerPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Partial<CreateUserDto & UpdateUserDto>>({
    name: '',
    email: '',
    role: 'User',
    password: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await axios.get<User[]>('http://localhost:3001/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const filtered = data.filter(u => u.role === 'User' || u.role === 'Admin');

      setUsers(filtered);
      setFilteredUsers(filtered);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
      }
      console.error(error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setIsEditing(false);
    setCurrentUser(null);
    setFormData({ name: '', email: '', role: 'User', password: '' });
  };

  const openEditModal = (user: User) => {
    setIsEditing(true);
    setIsCreating(false);
    setCurrentUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const closeModal = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCurrentUser(null);
    setFormData({ name: '', email: '', role: 'User', password: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password || formData.password.trim() === '') {
      alert('Password is required for creating a new user.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.post('http://localhost:3001/users', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('User created successfully!');
      closeModal();
      fetchUsers();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.message);
      } else {
        alert('An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const { password, ...updateData } = formData;

      await axios.put(`http://localhost:3001/users/${currentUser.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('User updated successfully!');
      closeModal();
      fetchUsers();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.message);
      } else {
        alert('An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.delete(`http://localhost:3001/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('User deleted successfully!');
      fetchUsers();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.message);
      } else {
        alert('An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isCreating && !isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading users...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col border-r border-gray-200">
        <div className="flex items-center mb-10">
          <img src="/jobie-logo.png" alt="Jobie Logo" className="h-10 w-auto mr-2" />
          <span className="text-2xl font-bold text-indigo-700">Jobie</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 font-semibold w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Back to Home</span>
          </button>
          <button
            disabled
            className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-600 text-white font-semibold w-full cursor-default"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v12m-9-6h12" />
            </svg>
            <span>User Management</span>
          </button>
        </nav>
        <div className="mt-auto text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>Jobie Portal</p>
          <p className="mt-1">© 2025 </p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Users</h1>
          <div className="flex items-center space-x-6">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isCreating || isEditing}
            />
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add New User
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <p className="text-center text-gray-500">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {(isCreating || isEditing) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {isCreating ? 'Create New User' : `Edit User ID: ${currentUser?.id}`}
              </h2>
              <form onSubmit={isCreating ? submitCreate : submitUpdate} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleFormChange}
                  placeholder="Name"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleFormChange}
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <select
                  name="role"
                  value={formData.role || 'User'}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                {isCreating && (
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleFormChange}
                    placeholder="Password"
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                )}
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
                    {isCreating ? 'Create' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
