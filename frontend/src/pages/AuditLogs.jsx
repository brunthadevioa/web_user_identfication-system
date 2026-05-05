import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/audit`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
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
          <div className="p-3 rounded-xl" style={{ background: 'rgba(112, 0, 255, 0.1)' }}>
            <FileText className="text-accent-secondary" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">System Audit Logs</h2>
            <p className="text-gray-400">Security ledger of all system interactions.</p>
          </div>
        </div>
        
        <div className="input-group mb-0 w-64">
          <Search className="input-icon" size={18} />
          <input type="text" placeholder="Filter logs..." className="py-2" />
        </div>
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="flex justify-center p-8"><div className="loader"></div></div>
        ) : logs.length === 0 ? (
          <div className="text-center p-12 opacity-50">
            <p className="text-lg">No audit records found.</p>
          </div>
        ) : (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>User Profile</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.log_id}>
                    <td className="text-sm font-mono text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="font-medium text-accent-primary">
                      {log.action_type}
                    </td>
                    <td>
                      <div>
                        <span className="font-bold">{log.user_name || 'System'}</span>
                        <br/>
                        <span className="text-xs text-gray-500">{log.user_email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="font-mono text-sm text-gray-500">
                      {log.ip_address || '127.0.0.1'}
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

export default AuditLogs;
