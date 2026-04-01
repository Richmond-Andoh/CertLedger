import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { certificateService } from '../../services/api';

const IssuanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await certificateService.getHistory();
        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to retrieve full issuance registry.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(cert => 
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-4"></div>
        <p className="text-on-surface-variant font-medium text-xs uppercase tracking-widest tracking-tighter">Accessing Historical Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-xl">
          <p className="text-secondary font-black tracking-[0.2em] text-[10px] uppercase mb-2">Central Registry</p>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface uppercase">Issuance History</h1>
          <p className="text-on-surface-variant mt-4 text-lg font-medium leading-relaxed italic">Comprehensive audit trail of all academic credentials anchored by your institutional node.</p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full max-w-md relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">search</span>
          </div>
          <input 
            className="w-full bg-white border-2 border-outline-variant/20 rounded-2xl py-5 pl-14 pr-8 text-sm font-bold focus:ring-0 focus:border-secondary transition-all placeholder:text-outline/50 shadow-xl shadow-black/5" 
            placeholder="Search by Student Name, ID or Qualification..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl shadow-black/5 border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Blockchain Index</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Student Identity</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Credential</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Anchored Date</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredHistory.map((cert, index) => (
                <tr key={cert._id} className={`${index % 2 === 1 ? 'bg-primary-fixed/5' : 'bg-white'} hover:bg-surface-container-low transition-colors group cursor-pointer`}>
                  <td className="px-10 py-7">
                    <span className="font-mono text-[10px] font-black text-secondary bg-secondary/5 px-2 py-1 rounded">#{cert.blockchainHash?.substring(0, 10).toUpperCase()}</span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-black text-on-surface border border-outline-variant/30 group-hover:scale-110 transition-transform">
                        {cert.studentName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-on-surface uppercase tracking-tight">{cert.studentName}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold tracking-widest">{cert.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-black bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/20 group-hover:border-secondary transition-colors uppercase">
                      {cert.qualification}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                     <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Anchored</span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-sm text-on-surface-variant font-bold">
                    {new Date(cert.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-10 py-7 text-right">
                    <button className="bg-slate-900 text-amber-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
                      Audit Node
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                   <td colSpan="6" className="px-10 py-20 text-center">
                      <span className="material-symbols-outlined text-6xl text-slate-100 mb-4 scale-150 block">history_toggle_off</span>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">No matching records found in institutional registry.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-10 py-8 bg-slate-50 border-t border-surface-container-high">
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
            Audit Ready: {filteredHistory.length} of {history.length} active records
          </span>
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-slate-100 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 text-white text-[10px] font-black shadow-xl scale-110">1</button>
            <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-slate-100 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuanceHistory;
