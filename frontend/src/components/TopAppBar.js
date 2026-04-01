import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const TopAppBar = ({ role, title }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-slate-900 shadow-xl shadow-slate-900/20 z-50 overflow-hidden">
      {/* Branding Section */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-900" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white uppercase font-headline">
            {role === 'university_admin' ? (user?.institution || 'Academic Ledger') : 'CertLedger Network'}
          </h1>
        </div>
        
        {/* Portal Switching (Navigation) */}
        <nav className="hidden md:flex gap-6">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `text-sm font-medium Inter border-b-2 transition-all pb-1 ${isActive ? 'text-amber-400 border-amber-400' : 'text-slate-300 border-transparent hover:text-white'}`}
          >
            University Portal
          </NavLink>
          <NavLink 
            to="/student/me" 
            className={({ isActive }) => `text-sm font-medium Inter border-b-2 transition-all pb-1 ${isActive ? 'text-amber-400 border-amber-400' : 'text-slate-300 border-transparent hover:text-white'}`}
          >
            Student Portal
          </NavLink>
          {role === 'system_admin' && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `text-sm font-medium Inter border-b-2 transition-all pb-1 ${isActive ? 'text-amber-400 border-amber-400' : 'text-slate-300 border-transparent hover:text-white'}`}
            >
              Admin Central
            </NavLink>
          )}
        </nav>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-8">
        {/* Global Search (System Admin specific style) */}
        {role === 'system_admin' && (
          <div className="hidden lg:flex items-center bg-slate-800 rounded-lg px-4 py-2 border border-slate-700 focus-within:border-amber-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-lg mr-2 font-light">search</span>
            <input 
              className="bg-transparent border-none text-white text-xs focus:ring-0 w-64 placeholder-slate-500" 
              placeholder="Search Blockchain Ledger..." 
              type="text"
            />
          </div>
        )}

        <div className="flex items-center gap-4 text-amber-500 border-l border-slate-700 pl-8">
          <button className="p-2 hover:bg-slate-800 transition-all duration-200 rounded-lg relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white uppercase tracking-tighter">{user?.username || 'Guest'}</p>
              <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">{role.replace('_', ' ')}</p>
            </div>
            <button className="p-1 hover:bg-slate-800 transition-all duration-200 rounded-lg border border-slate-700">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
