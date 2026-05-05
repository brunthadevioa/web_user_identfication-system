import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldAlert, CheckCircle, XCircle, Search, Calendar, User, Mail, Database } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminPanel = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue');

  useEffect(() => {
    fetchRequests();
    fetchSummary();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/credentials/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (activeTab === 'queue') setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/credentials/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (activeTab === 'history') setLoading(false);
    }
  };

  useEffect(() => {
    // Reset loading state briefly when tab changes, but we already have data
    // so we can just show it immediately, but let's keep UX consistent
  }, [activeTab]);
  const handleVerification = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/credentials/verify/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from list with a slight delay for animation
      setTimeout(() => {
        setRequests(requests.filter(req => req.verification_log_id !== id));
        fetchSummary(); // Refresh history
      }, 300);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container animate-slide-up pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-gradient mb-2 flex items-center gap-3" style={{ fontSize: '2.75rem', letterSpacing: '-0.03em' }}>
            Officer Workbench
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>
            Review, verify, and secure the identity network.
          </p>
        </div>
        
        {/* Metric Cards */}
        <div className="flex gap-4">
          <div className="glass-card flex items-center gap-4 px-6 py-4" style={{ borderLeft: '4px solid var(--warning)' }}>
            <Activity className="text-warning" size={32} color="var(--warning)" />
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{requests.length}</div>
              <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--warning)' }}>Pending Verification</div>
            </div>
          </div>
          <div className="glass-card flex items-center gap-4 px-6 py-4" style={{ borderLeft: '4px solid var(--success)' }}>
            <Database className="text-success" size={32} color="var(--success)" />
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{summary.length}</div>
              <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--success)' }}>Total Records</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('queue')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'queue' ? 'bg-accent-primary text-white' : 'glass-card text-gray-400 hover:text-white'}`}
        >
          Active Queue
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-accent-primary text-white' : 'glass-card text-gray-400 hover:text-white'}`}
        >
          Verification History
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '60vh' }}>
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4" style={{ borderColor: 'var(--glass-border)' }}>
          <h3 className="flex items-center gap-3" style={{ fontSize: '1.5rem' }}>
            <div className="p-2 rounded-lg" style={{ background: activeTab === 'queue' ? 'rgba(255, 51, 102, 0.1)' : 'rgba(0, 255, 136, 0.1)' }}>
              {activeTab === 'queue' ? (
                <ShieldAlert className="text-danger" size={24} color="var(--danger)" />
              ) : (
                <Database className="text-success" size={24} color="var(--success)" />
              )}
            </div>
            {activeTab === 'queue' ? 'Active Queue' : 'Verification History'}
          </h3>
          <div className="input-group mb-0" style={{ maxWidth: '300px', width: '100%' }}>
            <Search className="input-icon" size={18} />
            <input type="text" placeholder="Filter by name..." style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', fontSize: '0.9rem' }} />
          </div>
        </div>

        {activeTab === 'queue' ? (
          loading ? (
            <div className="flex justify-center items-center h-64"><div className="loader" style={{ width: '50px', height: '50px', borderWidth: '4px' }}></div></div>
          ) : requests.length === 0 ? (
            <div className="text-center p-16 border-dashed rounded-xl flex flex-col justify-center items-center h-64" style={{ borderColor: 'var(--glass-border)', borderWidth: '2px', background: 'rgba(0,0,0,0.1)' }}>
              <Database size={56} style={{ color: 'var(--success)', margin: '0 auto 1.5rem', opacity: 0.8, filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.3))' }} />
              <p style={{ color: 'var(--text-primary)', fontSize: '1.4rem', fontWeight: 'bold' }}>Queue is completely empty.</p>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Outstanding work, Officer. The network is secure.</p>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
              {requests.map((req, i) => (
                <div key={req.verification_log_id} className="glass-card flex flex-col p-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
                  
                  {/* Decorative background glow based on document type */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[50px] opacity-20 pointer-events-none" 
                       style={{ background: 'var(--accent-secondary)' }}></div>
  
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <span className="badge badge-pending font-bold tracking-wide" style={{ fontSize: '0.8rem' }}>{req.credential_type}</span>
                    <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      <Calendar size={14} /> Issued: {new Date(req.issue_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mb-6 relative z-10">
                    <div className="flex items-center gap-2 mb-1 text-xl font-bold tracking-tight">
                      <User size={18} style={{ color: 'var(--accent-primary)' }} />
                      {req.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Mail size={16} />
                      {req.email}
                    </div>
                  </div>
  
                  <div className="mb-8 rounded-xl overflow-hidden border relative group flex justify-center items-center bg-black/50" 
                       style={{ height: '200px', borderColor: 'var(--glass-border)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                    {/* Image container with hover zoom */}
                    <img 
                      src={`http://localhost:5000/${req.document_image.replace(/\\/g, '/')}`} 
                      alt="Document Scan" 
                      className="max-h-full max-w-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110" 
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x200/111/444?text=ENCRYPTED+DATA"; }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-center pb-3">
                      <span className="text-xs font-bold tracking-widest text-white/80 uppercase">Click to Enlarge</span>
                    </div>
                  </div>
  
                  <div className="flex gap-4 mt-auto relative z-10">
                    <button 
                      onClick={() => handleVerification(req.verification_log_id, 'Approved')} 
                      className="btn flex-1 transition-all" 
                      style={{ 
                        background: 'rgba(0, 255, 136, 0.1)', 
                        color: 'var(--success)', 
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        boxShadow: '0 4px 15px rgba(0, 255, 136, 0.05)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 136, 0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.2)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 136, 0.05)'; }}
                    >
                      <CheckCircle size={18} /> Verify
                    </button>
                    <button 
                      onClick={() => handleVerification(req.verification_log_id, 'Denied')} 
                      className="btn flex-1 transition-all" 
                      style={{ 
                        background: 'rgba(255, 51, 102, 0.1)', 
                        color: 'var(--danger)', 
                        border: '1px solid rgba(255, 51, 102, 0.3)',
                        boxShadow: '0 4px 15px rgba(255, 51, 102, 0.05)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 51, 102, 0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 51, 102, 0.2)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 51, 102, 0.1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 51, 102, 0.05)'; }}
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Credential Type</th>
                  <th>Status</th>
                  <th>Officer</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {summary.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 opacity-50">No history available</td>
                  </tr>
                ) : (
                  summary.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.email}</div>
                      </td>
                      <td className="text-sm font-medium text-accent-secondary">{item.credential_type}</td>
                      <td>
                        <span className={`badge ${item.status === 'Approved' ? 'badge-success' : item.status === 'Denied' ? 'badge-danger' : 'badge-pending'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-sm text-gray-400">{item.approved_by || 'System'}</td>
                      <td className="text-sm font-mono text-gray-500">
                        {item.verification_timestamp ? new Date(item.verification_timestamp).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
