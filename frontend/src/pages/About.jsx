import React from 'react';
import { Globe, Users, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto py-12 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About <span className="text-gradient">Identity Vault</span></h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Building the foundation of trust for the digital economy.
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Shield className="text-accent-primary" /> Our Mission
          </h2>
          <p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            In an increasingly digital world, proving who you are shouldn't be complicated, nor should it compromise your privacy. 
            Identity Vault was founded with a singular mission: to provide a zero-trust, highly encrypted environment where users 
            can safely store and verify their critical identification documents without fear of data breaches or identity theft.
          </p>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            We bridge the gap between rigorous compliance requirements and seamless user experience. By empowering dedicated verification 
            officers with powerful tools, we cut down verification times from days to mere minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 text-center">
            <Globe size={48} className="mx-auto mb-4" style={{ color: 'var(--accent-secondary)' }} />
            <h3 className="text-xl font-bold mb-2">Global Standard</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Compliant with international data protection regulations including GDPR and SOC2.
            </p>
          </div>
          <div className="glass-card p-8 text-center">
            <Users size={48} className="mx-auto mb-4" style={{ color: 'var(--accent-tertiary)' }} />
            <h3 className="text-xl font-bold mb-2">User-Centric</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Built from the ground up to give users complete control over their own data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
