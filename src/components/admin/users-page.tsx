// src/pages/admin/UsersPage.tsx
// Admin users management page for customer and staff management

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import useAdminApi from '@/hooks/useAdminApi';
import './users-page.css';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  accountType: 'customer' | 'seller' | 'admin';
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  lastLogin?: string;
}

export const UsersPage: React.FC = () => {
  const { loading, error } = useAdminApi();

  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    accountType: 'customer',
  });

  // Mock users data
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUsers: User[] = [
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '555-0001',
            role: 'customer',
            status: 'active',
            accountType: 'customer',
            totalOrders: 5,
            totalSpent: 1245.99,
            createdAt: '2026-01-15T10:30:00Z',
            lastLogin: '2026-05-28T14:30:00Z',
          },
          {
            _id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '555-0002',
            role: 'admin',
            status: 'active',
            accountType: 'admin',
            createdAt: '2025-06-10T09:00:00Z',
            lastLogin: '2026-05-29T08:45:00Z',
          },
          {
            _id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike@example.com',
            phone: '555-0003',
            role: 'customer',
            status: 'active',
            accountType: 'customer',
            totalOrders: 12,
            totalSpent: 3567.5,
            createdAt: '2025-09-22T14:15:00Z',
            lastLogin: '2026-05-27T10:20:00Z',
          },
          {
            _id: '4',
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah@example.com',
            phone: '555-0004',
            role: 'staff',
            status: 'active',
            accountType: 'admin',
            createdAt: '2025-11-05T11:45:00Z',
            lastLogin: '2026-05-29T09:15:00Z',
          },
          {
            _id: '5',
            firstName: 'Tom',
            lastName: 'Brown',
            email: 'tom@example.com',
            phone: '555-0005',
            role: 'customer',
            status: 'inactive',
            accountType: 'customer',
            totalOrders: 3,
            totalSpent: 789.99,
            createdAt: '2025-12-20T16:00:00Z',
            lastLogin: '2026-04-15T13:30:00Z',
          },
        ];

        setUsers(mockUsers);
      } finally {
        setPageLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Show toast
  useEffect(() => {
    if (error) {
      setToast({ type: 'error', message: error });
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingId
              ? { ...user, ...formData, _id: user._id }
              : user
          )
        );
        setToast({ type: 'success', message: 'User updated successfully' });
      } else {
        const newUser: User = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          status: 'active' as const,
        };
        setUsers((prev) => [newUser, ...prev]);
        setToast({ type: 'success', message: 'User created successfully' });
      }

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
        accountType: 'customer',
      });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      setToast({
        type: 'error',
        message: editingId ? 'Failed to update user' : 'Failed to create user',
      });
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      accountType: user.accountType,
    });
    setEditingId(user._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setToast({ type: 'success', message: 'User deleted successfully' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete user' });
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      accountType: 'customer',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === '' || user.role === filterRole;
    const matchesStatus = filterStatus === '' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AdminLayout currentPage="users">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Users</h1>
            <p>Manage customer and staff accounts</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={20} />
            New User
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filter-select">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <span className="result-count">{filteredUsers.length} users</span>
        </div>

        {/* Loading State */}
        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="table-container">
              {filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <p>No users found</p>
                  <button className="btn btn-primary" onClick={handleOpenModal}>
                    Create First User
                  </button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email & Phone</th>
                      <th>Role</th>
                      <th>Account Type</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Activity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">{user.firstName.charAt(0)}</div>
                            <div className="user-name">
                              <strong>
                                {user.firstName} {user.lastName}
                              </strong>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <div className="email">
                              <Mail size={14} />
                              {user.email}
                            </div>
                            <div className="phone">
                              <Phone size={14} />
                              {user.phone}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="role-badge">{user.role}</span>
                        </td>
                        <td>{user.accountType}</td>
                        <td>
                          <span className={`badge ${user.status}`}>{user.status}</span>
                        </td>
                        <td>
                          <span className="date">
                            <Calendar size={14} />
                            {formatDate(user.createdAt)}
                          </span>
                        </td>
                        <td>
                          <div className="activity">
                            {user.role === 'customer' ? (
                              <>
                                <div className="activity-stat">
                                  <span className="stat-label">Orders:</span>
                                  <span className="stat-value">{user.totalOrders || 0}</span>
                                </div>
                                <div className="activity-stat">
                                  <span className="stat-label">Spent:</span>
                                  <span className="stat-value">{formatCurrency(user.totalSpent || 0)}</span>
                                </div>
                              </>
                            ) : (
                              <span className="last-login">
                                Last: {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(user)}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(user._id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingId ? 'Edit User' : 'Create User'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                {/* Personal Info */}
                <div className="form-section">
                  <h4>Personal Information</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g., John"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g., Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g., john@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g., 555-0001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Role & Status */}
                <div className="form-section">
                  <h4>Role & Status</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Status *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Account Type *</label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
