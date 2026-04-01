import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/api';

const AnomalyDashboard = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await adminService.getAnomalies();
        if (response.data.success) {
          setAnomalies(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to sync network anomalies.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-4"></div>
        <p className="text-on-surface-variant font-medium text-xs uppercase tracking-widest">Scanning Ledger for Inconsistencies...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black text-on-surface font-headline tracking-tight mb-2 uppercase">Anomaly Dashboard</h1>
          <p className="text-on-surface-variant text-sm font-body max-w-lg">Monitoring cryptographic inconsistencies and protocol violations across the national institutional network.</p>
        </div>
        <button 
          className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-bold text-sm hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-lg shadow-secondary/20"
          onClick={() => toast.success('Diagnostics sequence initiated...')}
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Run System Diagnostic
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-low p-1 rounded-xl mb-10 flex flex-wrap gap-1 shadow-sm border border-outline-variant/10">
        <button className="px-6 py-2 bg-white text-on-surface font-bold rounded-lg text-xs uppercase tracking-widest shadow-sm">All Alerts</button>
        <button className="px-6 py-2 text-on-surface-variant font-bold hover:bg-white/50 transition-colors rounded-lg text-xs uppercase tracking-widest">Duplicate Claims</button>
        <button className="px-6 py-2 text-on-surface-variant font-bold hover:bg-white/50 transition-colors rounded-lg text-xs uppercase tracking-widest">Rate Spikes</button>
        <button className="px-6 py-2 text-on-surface-variant font-bold hover:bg-white/50 transition-colors rounded-lg text-xs uppercase tracking-widest">By University</button>
      </div>

      {/* Anomaly Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Featured Critical Alert (Simulation of highest priority) */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-xl shadow-xl shadow-black/5 border-l-8 border-error relative overflow-hidden border border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <span className="bg-error-container text-on-error-container px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-4 inline-block">CRITICAL: RATE SPIKE</span>
              <h3 className="text-3xl font-black font-headline text-on-surface tracking-tight">University of Ghana, Legon</h3>
              <p className="text-on-surface-variant text-sm mt-1 font-medium italic">Issuance volume exceeded 400% baseline in 120 seconds.</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Detected At</p>
              <p className="text-sm font-bold text-on-surface">Oct 24, 2024 • 14:22:09 GMT</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl mb-8 flex flex-col md:flex-row items-center gap-8 border border-outline-variant/20">
            <div className="h-24 w-full md:w-56 bg-slate-900 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-error/40 to-transparent opacity-20"></div>
               <span className="material-symbols-outlined text-white text-3xl mb-1 animate-pulse">monitoring</span>
               <span className="text-[10px] uppercase font-black text-amber-500 tracking-tighter">Blockchain Pulse Sync</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-on-surface leading-relaxed italic">
                System detected a bulk issuance request of <span className="font-black text-error">4,201 certificates</span> from an unverified IP range. Protocol dictates manual intervention for spikes exceeding node benchmarks.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                <span className="material-symbols-outlined text-slate-400 p-2">person</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Assigned Auditor</p>
                <p className="text-xs font-bold text-primary">System Automator GH-1</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-900 border-2 border-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-all">Inspect Ledger</button>
              <button className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-secondary text-on-secondary rounded-lg hover:scale-105 transition-transform shadow-lg shadow-secondary/20">Mark Resolved</button>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-primary-container p-8 rounded-xl text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container mb-6 italic">Network Guard Status</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-amber-900/40">
                <span className="material-symbols-outlined text-white text-3xl">security</span>
              </div>
              <div>
                <h4 className="text-2xl font-black font-headline tracking-tight uppercase">Secure Zone</h4>
                <p className="text-[10px] text-on-primary-container font-black uppercase tracking-widest mt-1">Integrity Protocol Active</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-on-primary-container">Stability Rating</span>
                <span className="text-white">88%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-secondary w-[88%] shadow-[0_0_10px_#755b00]"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl shadow-black/5 border border-outline-variant/20 group hover:border-secondary transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-amber-500 text-3xl group-hover:animate-bounce">warning</span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">2m ago</span>
            </div>
            <h4 className="font-black text-on-surface mb-2 uppercase tracking-tight">KNUST Duplicate Flag</h4>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-6 italic">Two identical Merkle proofs detected for certificate batch UG-2024-X.</p>
            <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest border-2 border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all shadow-md">Resolve Immediate</button>
          </div>
        </div>

        {/* Lower Alert Rows */}
        <div className="col-span-12 space-y-6 mt-4">
           {anomalies.length > 0 ? (
             anomalies.map((alert) => (
                <div key={alert._id} className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8 group hover:bg-slate-50 transition-colors">
                  <div className="p-3 bg-surface-container-highest rounded-lg text-on-surface-variant group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{alert.type === 'security' ? 'lock_reset' : 'monitoring'}</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-1">
                      <h4 className="font-black text-on-surface uppercase tracking-tight">{alert.university || 'Global Endpoint'}</h4>
                      <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-black uppercase tracking-tighter border border-slate-200">
                        {alert.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-medium italic">{alert.description || 'Routine cryptographic inconsistency detected.'}</p>
                  </div>
                  <div className="text-center md:text-right w-full md:w-48">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Timestamp</p>
                    <p className="text-xs font-bold text-on-surface">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  <button className="w-full md:w-auto px-6 py-2.5 border-2 border-outline-variant/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:border-secondary hover:text-secondary hover:bg-white transition-all shadow-sm">
                    Mark Resolved
                  </button>
                </div>
             ))
           ) : (
             <div className="bg-surface-container-high/20 p-12 rounded-xl text-center border-2 border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">verified</span>
                <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs">No active anomalies detected in the current node epoch.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AnomalyDashboard;
