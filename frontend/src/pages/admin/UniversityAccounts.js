import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminService } from '../../services/api';

const UniversityAccounts = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await adminService.getUsers({ role: 'university_admin' });
        if (response.data.success) {
          setUniversities(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to sync university records from ledger.');
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await adminService.toggleUserStatus(userId);
      if (response.data.success) {
        toast.success(response.data.message);
        setUniversities(universities.map(uni => 
          uni._id === userId ? { ...uni, isActive: !currentStatus } : uni
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update protocol status.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('CRITICAL ACTION: This will permanently purge the university node from the database. This cannot be undone. Continue?')) {
      return;
    }

    try {
      const response = await adminService.deleteUser(userId);
      if (response.data.success) {
        toast.success('University node purged successfully.');
        setUniversities(universities.filter(uni => uni._id !== userId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to purge university node.');
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const response = await adminService.resetPassword({ userId });
      if (response.data.success) {
        toast.success(`Security reset complete. Temporary password: ${response.data.data.temporaryPassword}`, {
          duration: 10000,
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error('Failed to reset university admin password.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-4"></div>
        <p className="text-on-surface-variant font-medium text-xs uppercase tracking-widest">Querying Global Nodes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">System Administration</span>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">University Accounts</h1>
          <p className="text-on-surface-variant mt-2 max-w-lg">Management of institutional administrative nodes and their associated cryptographic issuance permissions.</p>
        </div>
        <button 
          className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-secondary/20 group"
          onClick={() => navigate('/register')}
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
          Provision New University
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between border border-outline-variant/20">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Total Institutions</p>
            <h2 className="text-5xl font-black text-primary tracking-tighter">{universities.length}</h2>
          </div>
          <div className="hidden md:block h-16 w-px bg-surface-container-high mx-8"></div>
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Active Protocols</p>
            <h2 className="text-5xl font-black text-primary tracking-tighter">{universities.length}</h2>
          </div>
          <div className="hidden md:block h-16 w-px bg-surface-container-high mx-8"></div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-2 tracking-tighter">98.4% Network Uptime</span>
            <div className="flex gap-1 items-end">
              <div className="w-1.5 h-4 bg-secondary rounded-full"></div>
              <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
              <div className="w-1.5 h-4 bg-secondary rounded-full"></div>
              <div className="w-1.5 h-8 bg-secondary rounded-full"></div>
              <div className="w-1.5 h-5 bg-secondary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-primary-container rounded-xl p-8 shadow-xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-on-primary-container text-[10px] font-bold uppercase tracking-widest mb-4">Security Status</p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-white text-xl font-black tracking-tight uppercase">Ledger Sync: Stable</span>
          </div>
          <p className="text-on-primary-container/70 text-[10px] mt-2 font-medium leading-relaxed">
            Cryptographic cross-institutional verification successful. 0 unauthorized attempts detected in the last node cycle.
          </p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xl shadow-black/5 overflow-hidden border border-outline-variant/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-surface-container-high">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">University Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Admin Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Provisioned</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Blockchain Hash</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Temp Password</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {universities.map((uni, index) => (
                <tr 
                  key={uni._id} 
                  className={`${index % 2 === 1 ? 'bg-primary-fixed/5' : 'bg-surface-container-lowest'} hover:bg-surface-container-low transition-colors group`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-surface-container-high flex items-center justify-center text-primary font-black text-xs uppercase shadow-sm border border-outline-variant/30 group-hover:scale-110 transition-transform">
                        {uni.institution?.substring(0, 2) || 'UN'}
                      </div>
                      <span className="text-sm font-bold text-primary">{uni.institution || 'Unknown Institution'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant font-medium font-mono">{uni.username}</td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant">{new Date(uni.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-8 py-6">
                    <code className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-2 py-1 rounded">
                      {uni.transactionHash ? `${uni.transactionHash.substring(0, 10)}...` : 'N/A'}
                    </code>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-on-surface-variant font-bold">
                    {uni.tempPassword || '••••••••'}
                  </td>
                  <td className="px-8 py-6">
                    {uni.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-100 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black uppercase border border-rose-100 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-lg"
                        onClick={() => handleResetPassword(uni._id)}
                      >
                        Reset Password
                      </button>
                      <button 
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-lg transition-all shadow-lg ${
                          uni.isActive 
                            ? 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white shadow-amber-600/10' 
                            : 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-emerald-600/10'
                        }`}
                        onClick={() => handleToggleStatus(uni._id, uni.isActive)}
                      >
                        {uni.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-error text-error rounded-lg hover:bg-error hover:text-white transition-all shadow-lg shadow-error/10"
                        onClick={() => handleDelete(uni._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {universities.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-on-surface-variant font-medium">
                    No university nodes found on the current network branch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Shell */}
        <div className="px-8 py-6 bg-slate-50 border-t border-surface-container-high flex justify-between items-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Audit Ready: Showing {universities.length} of {universities.length} records
          </span>
          <div className="flex gap-2">
            <button className="p-2 rounded bg-white border border-outline-variant/30 hover:bg-surface-container transition-colors disabled:opacity-30">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-slate-900 text-white text-[10px] font-bold">1</button>
            <button className="p-2 rounded bg-white border border-outline-variant/30 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityAccounts;
