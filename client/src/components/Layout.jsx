import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* The persistent Sidebar */}
      <Sidebar />

      {/* The dynamic content area */}
      <main className="flex-1 ml-72">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;