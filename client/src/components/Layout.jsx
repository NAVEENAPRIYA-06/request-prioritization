import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar />
      {/* lg:pl-72: Gives space for fixed sidebar on desktop
        pt-24: Ensures content starts below the mobile menu button
        lg:pt-0: Removes that top padding on desktop
      */}
      <main className="flex-1 w-full lg:pl-72 pt-24 lg:pt-0 transition-all duration-500 ease-in-out">
        <div className="px-4 md:px-10 lg:px-16 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;