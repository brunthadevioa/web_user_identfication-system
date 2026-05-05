import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 153, 0, 0.1)' }}>
            <Users className="text-warning" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Network Users</h2>
            <p className="text-gray-400">Manage all registered user profiles.</p>
          </div>
        </div>
        
        <div className="input-group mb-0 w-64">
          <Search className="input-icon" size={18} />
          <input type="text" placeholder="Search users..." className="py-2" />
        </div>
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="flex justify-center p-8"><div className="loader"></div></div>
        ) : users.length === 0 ? (
          <div className="text-center p-12 opacity-50">
            <p className="text-lg">No users found.</p>
          </div>
        ) : (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Profile ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.user_profile_id}>
                    <td className="text-sm font-mono text-gray-500">
                      #{user.user_profile_id}
                    </td>
                    <td className="font-bold">
                      {user.name}
                    </td>
                    <td className="text-gray-400">
                      {user.email}
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-pending'}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
