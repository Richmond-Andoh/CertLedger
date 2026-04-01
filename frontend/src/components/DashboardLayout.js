import React from 'react';
import Sidebar from './Sidebar';
import TopAppBar from './TopAppBar';

const DashboardLayout = ({ children, role, title }) => {
  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar - Fixed Position */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Header - Fixed Position inside flex container logic or separate */}
        <TopAppBar role={role} title={title} />
        
        {/* Content Canvas */}
        <main className="flex-1 pt-24 p-8 md:p-12 lg:p-16 overflow-y-auto">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full py-6 mt-auto bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 px-8 relative z-10">
          <div className="flex gap-8">
            <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-500 hover:text-amber-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-500 hover:text-amber-600 transition-colors cursor-pointer">Blockchain Transparency Report</span>
            <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-500 hover:text-amber-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-tighter text-slate-900 dark:text-slate-100 opacity-60">© 2024 Academic Ledger Technologies. Ghanaian Institutional Integrity Protocol.</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
