import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { certificateService } from '../services/api';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchRecentIssuance = async () => {
      try {
        const response = await certificateService.getHistory({ limit: 5 });
        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to sync institutional registry.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecentIssuance();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-4"></div>
        <p className="text-on-surface-variant font-medium text-xs uppercase tracking-widest">Synchronizing Institutional Node...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-on-surface">
        <div className="max-w-2xl">
          <p className="text-secondary font-bold text-sm tracking-widest uppercase mb-2">Institutional Dashboard</p>
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Hello, {user?.institution || 'Academic Administrator'}
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed font-medium">
            Manage your institution's sovereign certificate issuance and verify academic integrity across the ledger.
          </p>
        </div>
        <button 
          className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-secondary/20 flex items-center gap-2 group"
          onClick={() => navigate('/issue')}
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          Issue New Certificate
        </button>
      </header>

      {/* Stats Cards Bento */}
      <div className="grid grid-cols-12 gap-8 mb-16">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-outline-variant/10 flex flex-col md:flex-row justify-between items-center group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/2 translate-x-12 -translate-y-12 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="text-center md:text-left mb-8 md:mb-0 relative z-10">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Cumulative Issuance</p>
            <h2 className="text-6xl font-black text-primary tracking-tighter tabular-nums">1,284</h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-600">
              <span className="material-symbols-outlined text-sm font-black">trending_up</span>
              <span className="text-[10px] font-black uppercase tracking-widest">14% Increase this Month</span>
            </div>
          </div>
          
          <div className="hidden md:block h-20 w-px bg-surface-container-high mx-12"></div>
          
          <div className="text-center md:text-left relative z-10">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Pending Verifications</p>
            <h2 className="text-6xl font-black text-primary tracking-tighter tabular-nums">09</h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-4">Manual Review Required</p>
          </div>
          
          <div className="hidden lg:flex flex-col items-end justify-center ml-12 relative z-10">
             <div className="flex gap-1.5 items-end h-16">
                {[40, 60, 30, 80, 50, 90, 45].map((h, i) => (
                  <div key={i} className={`w-2 rounded-full ${i === 5 ? 'bg-secondary' : 'bg-primary-container/20'}`} style={{ height: `${h}%` }}></div>
                ))}
             </div>
             <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-4">Node Activity Sync</p>
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-4 bg-primary-container p-10 rounded-2xl flex flex-col justify-between text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          <span className="material-symbols-outlined text-secondary text-5xl mb-8 relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <div className="relative z-10">
            <h4 className="text-2xl font-black tracking-tight mb-2 uppercase">Integrity Score: 99.8%</h4>
            <p className="text-on-primary-container/70 text-xs leading-relaxed font-medium">Your institution's ledger is fully synchronized with the global network. No inconsistencies detected.</p>
          </div>
        </div>
      </div>

      {/* Recent Issuance Table */}
      <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.05)] border border-outline-variant/10">
        <div className="px-10 py-8 border-b border-surface-container flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">Recent Issuance History</h2>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Real-time ledger entries from your node</p>
          </div>
          <button 
            className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all group"
            onClick={() => navigate('/history')}
          >
            Explore Historical Registry <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Student Identity</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">ID Type</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Credential Type</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-right">Blockchain Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-medium">
              {history.length > 0 ? (
                history.map((cert, index) => (
                  <tr key={cert._id} className={`${index % 2 === 1 ? 'bg-primary-fixed/5' : 'bg-white'} hover:bg-surface-container-low transition-colors group cursor-pointer`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-black text-xs border border-outline-variant/30">
                          {cert.studentName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{cert.studentName}</p>
                          <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-tighter mt-0.5">{cert.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container px-2 py-1 rounded">Institutional</span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm text-on-surface font-bold">{cert.qualification}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Anchored</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <code className="text-[10px] font-black text-on-surface-variant bg-slate-100 px-3 py-1.5 rounded-lg border border-outline-variant/20 hover:text-secondary hover:border-secondary transition-all">
                        {cert.blockchainHash?.substring(0, 12)}...
                       </code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-10 py-12 text-center">
                     <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">history_toggle_off</span>
                     <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">No recent activity found on this ledger node.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Internal Support Bar */}
      <div className="mt-16 bg-surface-container-high rounded-2xl p-8 border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/5">
              <span className="material-symbols-outlined text-secondary text-3xl">contact_support</span>
           </div>
           <div>
              <h4 className="text-lg font-black text-on-surface uppercase tracking-tight">Need Assistance?</h4>
              <p className="text-xs font-medium text-on-surface-variant">Access technical documentation or contact the System Administrator portal for ledger-level queries.</p>
           </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="flex-1 md:flex-none px-6 py-3 border-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all">Documentation</button>
           <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform">Contact Core Admin</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
