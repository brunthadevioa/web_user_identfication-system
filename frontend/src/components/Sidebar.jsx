import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Settings, Bell, FileText, LogOut, Users } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'bg-accent-primary/10 text-accent-primary border-r-4 border-accent-primary' 
      : 'text-gray-400 hover:text-white hover:bg-white/5';
  };

  return (
    <aside className="w-64 min-h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 h-full z-40">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <Shield className="text-gradient" size={32} />
          <span className="text-xl font-bold text-white tracking-tight">Identity<span className="text-gradient">Vault</span></span>
        </Link>
      </div>

      <div className="p-6 pb-2 border-b border-white/10">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Logged in as</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold border border-accent-primary/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2">
        {user.role === 'user' && (
          <>
            <Link to="/dashboard" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive('/dashboard')}`} style={{ textDecoration: 'none' }}>
              <LayoutDashboard size={20} />
              <span className="font-medium">My Arsenal</span>
            </Link>
            <Link to="/notifications" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive('/notifications')}`} style={{ textDecoration: 'none' }}>
              <Bell size={20} />
              <span className="font-medium">Alerts</span>
            </Link>
          </>
        )}

        {user.role === 'officer' && (
          <>
            <Link to="/admin" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive('/admin')}`} style={{ textDecoration: 'none' }}>
              <Settings size={20} />
              <span className="font-medium">Workbench</span>
            </Link>
            <Link to="/audit" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive('/audit')}`} style={{ textDecoration: 'none' }}>
              <FileText size={20} />
              <span className="font-medium">Audit Logs</span>
            </Link>
            <Link to="/users" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive('/users')}`} style={{ textDecoration: 'none' }}>
              <Users size={20} />
              <span className="font-medium">Network Users</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button 
          onClick={onLogout} 
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20"
        >
          <LogOut size={20} />
          <span className="font-bold">Secure Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
