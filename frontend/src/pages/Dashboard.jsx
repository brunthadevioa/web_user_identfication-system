import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Dashboard = ({ user }) => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ credential_type: 'Passport', issue_date: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/credentials/mycredentials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCredentials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a document image.');

    setUploading(true);
    const data = new FormData();
    data.append('credential_type', formData.credential_type);
    data.append('issue_date', formData.issue_date);
    data.append('document_image', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/credentials/upload`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Credential uploaded successfully and is pending verification.');
      setFile(null);
      setFormData({ credential_type: 'Passport', issue_date: '' });
      fetchCredentials();
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return <span className="badge badge-approved"><CheckCircle size={14}/> Approved</span>;
      case 'Denied': return <span className="badge badge-denied"><XCircle size={14}/> Denied</span>;
      default: return <span className="badge badge-pending"><Clock size={14}/> Pending</span>;
    }
  };

  return (
    <div className="container animate-slide-up">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-gradient mb-2" style={{ fontSize: '2.5rem' }}>Identity Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your verification arsenal and secure documents.</p>
        </div>
        <div className="glass-card hidden md:flex items-center gap-3 px-5 py-3">
          <ShieldCheck className="text-success" size={28} color="var(--success)" />
          <div>
            <div className="text-xs text-secondary font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</div>
            <div className="font-bold text-lg">{credentials.filter(c => c.status === 'Approved').length} Verified</div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Upload Section */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 className="mb-6 flex items-center gap-3" style={{ fontSize: '1.5rem' }}>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
              <UploadCloud className="text-gradient" size={24} />
            </div>
            Submit Credential
          </h3>

          <form onSubmit={handleUpload} className="flex-col">
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Document Type</label>
              <select 
                value={formData.credential_type} 
                onChange={(e) => setFormData({...formData, credential_type: e.target.value})}
                className="w-full"
              >
                <option>Passport</option>
                <option>National ID / SSN</option>
                <option>Driver's License</option>
                <option>Birth Certificate</option>
                <option>Voter ID</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Issue Date</label>
              <input 
                type="date" 
                value={formData.issue_date} 
                onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                required
                className="w-full"
                style={{ color: formData.issue_date ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              />
            </div>

            <div className="mb-8">
              <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Secure Image Upload</label>
              <div className="relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300"
                   style={{ 
                     borderColor: file ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)',
                     background: file ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0,0,0,0.2)' 
                   }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <UploadCloud size={36} className="mx-auto mb-3" style={{ color: file ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                <p className="text-sm font-medium" style={{ color: file ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {file ? file.name : 'Click or drag image to upload'}
                </p>
                {!file && <p className="text-xs mt-2 opacity-50">JPEG, PNG, WEBP max 5MB</p>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full py-3.5 text-lg" disabled={uploading}>
              {uploading ? <span className="loader" style={{ width: '22px', height: '22px' }}></span> : 'Encrypt & Upload'}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="glass-panel flex flex-col h-full" style={{ padding: '2.5rem' }}>
          <h3 className="mb-6 flex items-center gap-3" style={{ fontSize: '1.5rem' }}>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(112, 0, 255, 0.1)' }}>
              <FileText className="text-gradient" size={24} />
            </div>
            Verification Arsenal
          </h3>
          
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-48"><div className="loader" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div></div>
            ) : credentials.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-dashed rounded-xl" style={{ borderColor: 'var(--glass-border)', borderWidth: '2px', background: 'rgba(0,0,0,0.1)' }}>
                <FileText size={48} className="mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No credentials uploaded yet.</p>
                <p className="text-sm mt-2 opacity-50">Secure your identity by submitting a document.</p>
              </div>
            ) : (
              <div className="glass-table-container">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Issue Date</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credentials.map((cred, i) => (
                      <tr key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <td className="font-bold tracking-wide">{cred.credential_type}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{new Date(cred.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td>{getStatusBadge(cred.status)}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {cred.verification_timestamp ? new Date(cred.verification_timestamp).toLocaleDateString() : 'Processing'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
