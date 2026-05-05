import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import UserManagement from './pages/UserManagement';
import SidebarLayout from './components/SidebarLayout';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check token on load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    
    if (userData.role === 'officer') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {!user && <Navbar user={user} onLogout={handleLogout} />}

      {!user ? (
        <main className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      ) : (
        <SidebarLayout user={user} onLogout={handleLogout}>
          <Routes>
            {/* User Routes */}
            <Route 
              path="/dashboard" 
              element={user.role === 'user' ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/notifications" 
              element={user.role === 'user' ? <Notifications /> : <Navigate to="/login" />} 
            />
            
            {/* Officer Routes */}
            <Route 
              path="/admin" 
              element={user.role === 'officer' ? <AdminPanel user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/audit" 
              element={user.role === 'officer' ? <AuditLogs /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/users" 
              element={user.role === 'officer' ? <UserManagement /> : <Navigate to="/login" />} 
            />
            
            {/* Catch-all for authenticated */}
            <Route path="*" element={<Navigate to={user.role === 'officer' ? '/admin' : '/dashboard'} />} />
          </Routes>
        </SidebarLayout>
      )}
    </>
  );
}

export default App;
