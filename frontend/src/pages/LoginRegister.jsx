import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Mail, Lock, User, Phone, Calendar, ArrowRight, Fingerprint } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const LoginRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOfficer, setIsOfficer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', phone_number: '', date_of_birth: '', profile_picture: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const payload = { email: formData.email, password: formData.password, isOfficer };
        const response = await axios.post(`${API_URL}/auth/login`, payload);
        onLogin(response.data.user, response.data.token);
      } else {
        if (isOfficer) {
           setError("Officer registration is restricted. Please contact administrator.");
           setLoading(false);
           return;
        }
        await axios.post(`${API_URL}/auth/register`, formData);
        setIsLogin(true); // Switch to login after successful register
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] relative z-10">
      <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '480px', padding: '3rem 2.5rem' }}>
        
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" 
               style={{ 
                 background: 'rgba(0, 240, 255, 0.05)', 
                 boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)',
                 border: '1px solid rgba(0, 240, 255, 0.2)'
               }}>
            {isOfficer ? <Shield className="text-gradient" size={48} /> : <Fingerprint className="text-gradient" size={48} />}
          </div>
          <h2 className="text-gradient" style={{ fontSize: '2.25rem', letterSpacing: '-0.05em' }}>
            {isLogin ? 'Welcome Back' : 'Create Vault'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
            {isLogin ? 'Access your secure identity dashboard' : 'Join the encrypted identification network'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm text-center font-medium animate-slide-up" 
               style={{ background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)', color: 'var(--danger)', boxShadow: '0 4px 15px rgba(255, 51, 102, 0.1)' }}>
            {error}
          </div>
        )}

        {/* Custom Toggle Switch */}
        <div className="flex mb-8 p-1.5 rounded-xl relative" style={{ background: 'rgba(0,0,0,0.4)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
          <div className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-lg transition-transform duration-300 ease-in-out"
               style={{ 
                 background: 'var(--accent-gradient-subtle)', 
                 transform: isOfficer ? 'translateX(100%)' : 'translateX(0)',
                 boxShadow: '0 2px 10px rgba(0, 240, 255, 0.2)'
               }}
          />
          <button 
            type="button"
            className="flex-1 py-2.5 text-sm font-bold rounded-lg relative z-10 transition-colors duration-300"
            style={{ color: !isOfficer ? '#fff' : 'var(--text-secondary)' }}
            onClick={() => setIsOfficer(false)}
          >
            User Access
          </button>
          <button 
            type="button"
            className="flex-1 py-2.5 text-sm font-bold rounded-lg relative z-10 transition-colors duration-300"
            style={{ color: isOfficer ? '#fff' : 'var(--text-secondary)' }}
            onClick={() => setIsOfficer(true)}
          >
            Officer Portal
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-col w-full">
          {!isLogin && (
            <div className="animate-slide-up">
              <div className="input-group">
                <User className="input-icon" size={20} />
                <input type="text" name="name" placeholder="Full Legal Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <Phone className="input-icon" size={20} />
                <input type="tel" name="phone_number" placeholder="Contact Number" value={formData.phone_number} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <Calendar className="input-icon" size={20} />
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required 
                       style={{ color: formData.date_of_birth ? 'var(--text-primary)' : 'var(--text-secondary)' }} />
              </div>
            </div>
          )}

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group mb-8">
            <Lock className="input-icon" size={20} />
            <input type="password" name="password" placeholder="Secure Password" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary w-full py-3.5 text-lg" disabled={loading}>
            {loading ? <span className="loader" style={{ width: '22px', height: '22px' }}></span> : (
              <>
                {isLogin ? 'Authenticate Identity' : 'Initialize Vault'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <button 
            type="button" 
            className="text-sm font-medium transition-colors hover:text-white" 
            style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? "New to the system? Create your vault." : "Already have a vault? Authenticate."}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginRegister;
