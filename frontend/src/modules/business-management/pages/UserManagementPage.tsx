import React, { useEffect, useState } from 'react';
import { businessApi } from '../../../shared/api/businessApi';
import { User, Role } from '../../../shared/types';
import { Modal } from '../../../shared/components/Modal';
import { Badge } from '../../../shared/components/Badge';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    roles: ['INVENTORY_CLERK'],
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [search, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const activeParam = statusFilter === 'ALL' ? undefined : statusFilter === 'ACTIVE';
      const data = await businessApi.getUsers(search, activeParam);
      setUsers(data.content);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const r = await businessApi.getAllRoles();
      setRoles(r);
    } catch (err) {
      console.error('Failed to load roles', err);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      roles: ['INVENTORY_CLERK'],
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      roles: user.roles || ['INVENTORY_CLERK'],
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.username || !formData.password || !formData.fullName || !formData.email) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    try {
      await businessApi.createUser({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        roles: formData.roles,
      });
      setIsAddModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error creating user account');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError('');

    try {
      await businessApi.updateUser(selectedUser.userId, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        roles: formData.roles,
        newPassword: formData.password ? formData.password : undefined,
      });
      setIsEditModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = !user.isActive;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'ACTIVATE' : 'DEACTIVATE'} user ${user.username}?`)) {
      try {
        await businessApi.toggleUserStatus(user.userId, newStatus);
        loadUsers();
      } catch (err) {
        console.error('Failed to toggle user status', err);
      }
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to permanently delete user ${user.username}?`)) {
      try {
        await businessApi.deleteUser(user.userId);
        loadUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>User Accounts & Access Control</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage staff credentials, assigned department roles, and active security status.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          + Add New User Account
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by username, full name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Status:</span>
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn btn-sm"
              style={{
                background: statusFilter === st ? 'var(--accent-primary)' : 'var(--bg-input)',
                color: statusFilter === st ? '#fff' : 'var(--text-muted)',
                borderColor: statusFilter === st ? 'var(--accent-primary)' : 'var(--border-subtle)',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Operator Info</th>
              <th>Email & Contact</th>
              <th>Assigned Roles</th>
              <th>Account Status</th>
              <th>Last Sign-In</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading user records...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  No users found matching your filter criteria.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.userId}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-full)',
                          background: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          color: '#fff',
                        }}
                      >
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{u.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{u.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{u.phoneNumber || 'N/A'}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {u.roles?.map((r) => (
                        <Badge key={r} variant="info">
                          {r.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge variant={u.isActive ? 'success' : 'danger'}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never logged in'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="btn btn-secondary btn-sm"
                        title="Edit User"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`btn btn-sm ${u.isActive ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                      {u.username !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="btn btn-danger btn-sm"
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New User Account">
        <form onSubmit={handleCreateUser}>
          {formError && (
            <div style={{ padding: '10px', background: 'rgba(244,63,94,0.15)', color: '#fb7185', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '16px' }}>
              {formError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. kasun.p"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Password *</label>
              <input
                type="password"
                className="form-control"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Kasun Perera"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="kasun@novamart.lk"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+94 77 123 4567"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Assigned Role</label>
            <select
              className="form-control"
              value={formData.roles[0]}
              onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
            >
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleName}>
                  {r.roleName.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Account: @${selectedUser?.username}`}>
        <form onSubmit={handleUpdateUser}>
          {formError && (
            <div style={{ padding: '10px', background: 'rgba(244,63,94,0.15)', color: '#fb7185', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '16px' }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role Assignment</label>
            <select
              className="form-control"
              value={formData.roles[0] || 'INVENTORY_CLERK'}
              onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
            >
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleName}>
                  {r.roleName.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reset Password (leave empty to keep current)</label>
            <input
              type="password"
              className="form-control"
              placeholder="New password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
