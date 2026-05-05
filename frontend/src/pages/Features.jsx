import React from 'react';
import { ShieldCheck, Fingerprint, Activity, Clock, FileKey, Database } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'Military-Grade Encryption',
      description: 'All uploaded documents are encrypted using advanced algorithms to ensure maximum security at rest.',
      icon: <FileKey size={32} className="text-gradient" />
    },
    {
      title: 'Real-Time Verification Tracking',
      description: 'Track the status of your submitted credentials in real-time through your personal dashboard.',
      icon: <Activity size={32} className="text-gradient" />
    },
    {
      title: 'Dedicated Officer Portal',
      description: 'Authorized verification officers have access to a streamlined workbench to process requests efficiently.',
      icon: <ShieldCheck size={32} className="text-gradient" />
    },
    {
      title: 'Biometric Ready',
      description: 'Built with future scalability in mind, ready to integrate with standard biometric authentication protocols.',
      icon: <Fingerprint size={32} className="text-gradient" />
    },
    {
      title: 'Instant Auditing',
      description: 'Every action is logged with strict timestamps, ensuring complete transparency and accountability.',
      icon: <Clock size={32} className="text-gradient" />
    },
    {
      title: 'Redundant Storage',
      description: 'Data is backed up across multiple secure nodes to prevent any accidental data loss.',
      icon: <Database size={32} className="text-gradient" />
    }
  ];

  return (
    <div className="container mx-auto py-12 animate-slide-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Platform <span className="text-gradient">Features</span></h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Discover the powerful tools and technologies that make Identity Vault the most secure verification platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="glass-panel p-8 hover:transform hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-6 inline-block p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
