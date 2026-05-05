import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
          <Bell className="text-gradient" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">System Alerts</h2>
          <p className="text-gray-400">Updates regarding your identity verifications.</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="flex justify-center p-8"><div className="loader"></div></div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-12 opacity-50">
            <Bell size={48} className="mx-auto mb-4" />
            <p className="text-lg">No alerts at this time.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map(note => (
              <div 
                key={note.notification_id} 
                className={`p-5 rounded-xl border transition-all flex justify-between items-start ${note.is_read ? 'bg-black/20 border-white/5' : 'bg-accent-primary/5 border-accent-primary/20'}`}
              >
                <div>
                  <p className={`text-lg mb-1 ${note.is_read ? 'text-gray-300' : 'text-white font-bold'}`}>
                    {note.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
                {!note.is_read && (
                  <button 
                    onClick={() => markAsRead(note.notification_id)}
                    className="btn btn-outline text-sm py-1.5 px-3 flex items-center gap-2"
                  >
                    <CheckCircle size={14} /> Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
