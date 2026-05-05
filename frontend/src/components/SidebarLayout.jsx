import React from 'react';
import Sidebar from './Sidebar';

const SidebarLayout = ({ user, onLogout, children }) => {
  return (
    <div className="flex min-h-screen bg-bg-secondary">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
