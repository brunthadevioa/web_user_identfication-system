import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'text-accent-primary' : 'text-gray-400 hover:text-white';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <Shield className="text-gradient" size={28} />
        <span style={{ color: 'var(--text-primary)' }}>Identity<span className="text-gradient">Vault</span></span>
      </Link>
      
      <div className="nav-links">
        {/* Public Links */}
        {!user && (
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link to="/" className={`font-medium transition-colors ${isActive('/')}`} style={{ textDecoration: 'none' }}>Home</Link>
            <Link to="/features" className={`font-medium transition-colors ${isActive('/features')}`} style={{ textDecoration: 'none' }}>Features</Link>
            <Link to="/about" className={`font-medium transition-colors ${isActive('/about')}`} style={{ textDecoration: 'none' }}>About</Link>
          </div>
        )}

        {/* User Specific Links */}
        {user ? (
          <>
            <span style={{ color: 'var(--text-secondary)' }} className="hidden sm:inline-block">
              Welcome, <span className="font-bold text-white">{user.name}</span>
            </span>
            
            {user.role === 'officer' ? (
              <Link to="/admin" className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                <Settings size={16} /> <span className="hidden sm:inline">Workbench</span>
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                <LayoutDashboard size={16} /> <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            <button onClick={onLogout} className="btn" style={{ padding: '0.5rem 1rem', background: 'rgba(255, 51, 102, 0.1)', color: 'var(--danger)' }}>
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', textDecoration: 'none' }}>
            Access Vault
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
