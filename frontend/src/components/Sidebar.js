import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Disconnected from ledger network.');
    window.location.href = '/';
  };

  const menuItems = {
    system_admin: [
      { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
      { name: 'University Accounts', icon: 'account_balance', path: '/admin/universities' },
      { name: 'Student Accounts', icon: 'school', path: '/admin/students' },
      { name: 'Anomaly Dashboard', icon: 'warning', path: '/admin/anomalies' },
      { name: 'Audit Log', icon: 'gavel', path: '/admin/audit' },
    ],
    university_admin: [
      { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
      { name: 'Issue Certificate', icon: 'verified_user', path: '/issue' },
      { name: 'Issuance History', icon: 'history', path: '/history' },
      { name: 'Anomaly Alerts', icon: 'warning', path: '/alerts', badge: 3 },
      { name: 'Audit Log', icon: 'gavel', path: '/audit' },
    ],
    student: [
      { name: 'My Certificates', icon: 'award', path: `/student/${JSON.parse(localStorage.getItem('user'))?.username}` },
      { name: 'Verify Ledger', icon: 'search', path: '/verify' },
      { name: 'Support', icon: 'help_outline', path: '/support' },
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 flex flex-col pt-24 pb-8 overflow-y-auto shadow-2xl shadow-black/50 z-40 transition-all">
      <div className="px-8 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-headline leading-tight">Institutional Ledger</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Academic Authority</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {currentMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 transition-all group
              ${isActive 
                ? 'text-amber-500 bg-slate-800/50 border-r-4 border-amber-500 translate-x-1' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'}
            `}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-xs font-semibold uppercase tracking-widest">{item.name}</span>
            {item.badge && (
              <span className="ml-auto bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-6 space-y-1">
        {role === 'university_admin' && (
          <button 
            className="w-full mb-6 bg-secondary text-on-secondary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-amber-900/20"
            onClick={() => navigate('/verify')}
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-xs uppercase tracking-widest">New Verification</span>
          </button>
        )}
        
        <button className="w-full text-slate-400 flex items-center gap-4 px-4 py-3 hover:text-slate-100 transition-all">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-xs font-semibold uppercase tracking-widest">Settings</span>
        </button>
        
        <button 
          className="w-full text-slate-400 flex items-center gap-4 px-4 py-3 hover:text-slate-100 transition-all border-t border-slate-800/50 pt-4"
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined text-amber-500">logout</span>
          <span className="text-xs font-semibold uppercase tracking-widest">Logout Network</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
