import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, ArrowRight, Server, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-slide-up">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[70vh]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
          <Shield size={16} className="text-gradient" />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>Next-Gen Identity Verification</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6" style={{ letterSpacing: '-0.04em', lineHeight: '1.1' }}>
          Secure Your <span className="text-gradient">Digital Identity</span>
        </h1>
        
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
          Identity Vault provides military-grade encryption and a seamless verification process for managing your personal credentials online.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="btn btn-primary text-lg px-8 py-4" style={{ textDecoration: 'none' }}>
            Get Started Now <ArrowRight size={20} />
          </Link>
          <Link to="/features" className="btn btn-outline text-lg px-8 py-4" style={{ textDecoration: 'none' }}>
            View Features
          </Link>
        </div>
      </section>

      {/* Quick Stats / Highlights */}
      <section className="container mx-auto py-12 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="glass-card p-8">
            <Lock size={40} className="mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-xl mb-2">End-to-End Encryption</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Your documents are encrypted before they ever leave your device.</p>
          </div>
          <div className="glass-card p-8">
            <Zap size={40} className="mx-auto mb-4" style={{ color: 'var(--accent-secondary)' }} />
            <h3 className="text-xl mb-2">Lightning Fast Verification</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Our dedicated officer portal ensures your credentials are reviewed rapidly.</p>
          </div>
          <div className="glass-card p-8">
            <Server size={40} className="mx-auto mb-4" style={{ color: 'var(--accent-tertiary)' }} />
            <h3 className="text-xl mb-2">Decentralized Storage</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Robust backend architecture to guarantee 99.99% uptime and data integrity.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
