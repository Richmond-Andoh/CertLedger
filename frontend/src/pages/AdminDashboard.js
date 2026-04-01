import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to sync global network stats.', {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="text-on-surface-variant font-medium animate-pulse uppercase tracking-widest text-xs">Synchronizing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-on-surface">
        <div className="max-w-2xl">
          <p className="text-secondary font-bold text-sm tracking-widest uppercase mb-2">System Overview</p>
          <h1 className="text-4xl font-black tracking-tight mb-4">Global Network Health</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">Real-time surveillance of the academic blockchain ledger and multi-institutional issuance status.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-lg shadow-sm border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">System Active</span>
          </div>
        </div>
      </header>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {/* Total Universities */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(13,27,42,0.04)] border-none group hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-primary-container/10 rounded-lg text-primary-container">
              <span className="material-symbols-outlined text-3xl">corporate_fare</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Live Node</span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">Total Universities</p>
          <h3 className="text-3xl font-bold text-on-surface">{stats?.userStats?.university_admin || 0}</h3>
        </div>

        {/* Total Certificates */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(13,27,42,0.04)] border-none group hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-primary-container/10 rounded-lg text-primary-container">
              <span className="material-symbols-outlined text-3xl">public</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Feed Ready</span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">Total Certificates</p>
          <h3 className="text-3xl font-bold text-on-surface">{stats?.overview?.totalCertificates.toLocaleString() || 0}</h3>
        </div>

        {/* Total Students */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(13,27,42,0.04)] border-none group hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-primary-container/10 rounded-lg text-primary-container">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded">Verified</span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">Total Students</p>
          <h3 className="text-3xl font-bold text-on-surface">{stats?.userStats?.student.toLocaleString() || 0}</h3>
        </div>

        {/* Open Anomalies */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(13,27,42_0.06)] border-none group hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-error-container/20 rounded-lg text-error">
              <span className="material-symbols-outlined text-3xl">report_problem</span>
            </div>
            <span className="text-[10px] font-bold text-error bg-error-container px-2 py-1 rounded">Immediate Action</span>
          </div>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">Recent Anomalies</p>
          <h3 className="text-3xl font-bold text-error">{stats?.overview?.recentAnomalies || 0}</h3>
        </div>
      </div>

      {/* Recent Network Anomalies Table */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(13,27,42,0.05)] border border-outline-variant/20">
        <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-on-surface">Recent Network Anomalies</h2>
          <button className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            View Detailed Log <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary-container text-on-primary-container">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">University</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Alert Type</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {/* If no real anomaly data yet, we can show a placeholder or map from stats if available */}
              <tr className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center font-bold text-primary text-xs">UG</div>
                    <span className="font-bold text-sm text-on-surface">University of Ghana</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-error-container text-on-error-container">Duplicate Hash Attempt</span>
                </td>
                <td className="px-8 py-6 text-xs text-on-surface-variant font-medium">Oct 24, 2023 | 14:22</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    <span className="text-[10px] font-bold uppercase text-error">Critical</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 hover:bg-surface-container rounded-lg transition-colors group-hover:text-secondary">
                    <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Additional Mock Data for Visuals (Phase 1) */}
              <tr className="bg-primary-fixed/5 hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center font-bold text-primary text-xs">KN</div>
                    <span className="font-bold text-sm text-on-surface">KNUST</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">API Latency Spike</span>
                </td>
                <td className="px-8 py-6 text-xs text-on-surface-variant font-medium">Oct 24, 2023 | 09:15</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-[10px] font-bold uppercase text-amber-600">Pending</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 hover:bg-surface-container rounded-lg transition-colors group-hover:text-secondary">
                    <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Network Infrastructure Section (previously System Settings) */}
      <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/30">
          <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2 capitalize tracking-tight">
            <span className="material-symbols-outlined text-secondary">database</span>
            Blockchain Configuration
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Protocol Node</span>
              <span className="text-sm font-mono text-on-surface">0xd914...39138</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Network</span>
              <span className="text-sm font-semibold text-secondary">Sepolia Testnet</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Latency</span>
              <span className="text-sm font-bold text-emerald-600">12ms - Stable</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-xl p-8 border border-outline-variant/30">
          <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2 capitalize tracking-tight">
            <span className="material-symbols-outlined text-secondary">info</span>
            Institutional Integrity Protocol
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            This administrative node governs the GH-SYS-8821-X infrastructure. All actions are cryptographically logged for audit compliance with the Ghanaian Academic Transparency Framework.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:scale-[1.02] transition-transform">Run Protocol Backup</button>
            <button className="px-6 py-2 border border-slate-900 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-900 hover:text-white transition-all">Audit Log</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
