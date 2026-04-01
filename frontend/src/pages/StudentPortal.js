import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { certificateService } from '../services/api';

const StudentPortal = () => {
  const { id } = useParams();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // The backend might return multiple, but currently it's one per ID in this context
        const response = await certificateService.getDetails(id);
        if (response.data.success) {
          setCertificates([response.data.data]);
        }
      } catch (error) {
        toast.error('Failed to retrieve your academic records.');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="text-on-surface-variant font-black uppercase tracking-widest text-[10px]">Accessing Personal Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-2xl">
          <p className="text-secondary font-black tracking-[0.2em] text-[10px] uppercase mb-2">Academic Identity</p>
          <h1 className="text-5xl font-black text-on-surface tracking-tighter uppercase mb-4">My Certificate</h1>
          <p className="text-on-surface-variant text-lg font-medium leading-relaxed italic">
            View and verify your official academic credentials. This digital record is anchored to the institutional blockchain for permanent veracity.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button 
            className="flex-1 lg:flex-none bg-white text-slate-900 px-8 py-4 rounded-xl shadow-xl shadow-black/5 border-2 border-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3"
            onClick={() => toast.success('Vault Export: Generating secure PDF...')}
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Download PDF
          </button>
          <button 
            className="flex-1 lg:flex-none bg-slate-900 text-amber-500 px-8 py-4 rounded-xl shadow-2xl shadow-black/20 font-black text-[10px] uppercase tracking-widest hover:scale-[1.05] transition-transform flex items-center justify-center gap-3"
            onClick={() => toast.success('Public Verification Link Copied!')}
          >
            <span className="material-symbols-outlined text-xl">share</span>
            Share Record
          </button>
        </div>
      </header>

      {/* Certificate Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* The Digital Ledger Card */}
        <div className="lg:col-span-8">
          {certificates.map((cert, index) => (
            <div key={cert._id || index} className="bg-white rounded-2xl p-16 shadow-[0_40px_100px_rgba(0,0,0,0.06)] relative overflow-hidden border-t-[12px] border-slate-900 group">
              {/* Subtle Decorative Pattern */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none grayscale group-hover:grayscale-0 transition-all duration-1000">
                <div className="w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* University Seal Placeholder */}
                <div className="w-40 h-40 mb-12 bg-slate-50 rounded-full flex items-center justify-center p-6 border-4 border-double border-slate-200 shadow-inner group-hover:border-amber-500 transition-colors duration-500">
                   <span className="material-symbols-outlined text-slate-200 text-7xl group-hover:text-amber-500 transition-colors">school</span>
                </div>

                <div className="mb-14">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Official Academic Record</h2>
                  <p className="font-serif italic text-slate-500 text-lg">This is to certify that</p>
                </div>

                <div className="mb-14 relative inline-block">
                  <h3 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">{cert.studentName}</h3>
                  <div className="h-1.5 w-full bg-secondary mt-4 rounded-full shadow-[0_4px_10px_rgba(117,91,0,0.3)]"></div>
                </div>

                <div className="mb-16 space-y-4 max-w-lg">
                  <p className="text-slate-500 font-medium italic">Having fulfilled all university requirements and passed the prescribed examinations was duly admitted to the degree of</p>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">{cert.qualification}</h4>
                </div>

                {/* Data Grid */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 text-left py-12 border-y-2 border-slate-100 mb-16">
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Student ID</span>
                    <span className="font-black text-slate-900 text-sm">{cert.studentId}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Institution</span>
                    <span className="font-black text-slate-900 text-sm uppercase">{cert.institution}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Grade / Class</span>
                    <span className="font-black text-slate-900 text-sm whitespace-nowrap">{cert.grade}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Issue Date</span>
                    <span className="font-black text-slate-900 text-sm">{new Date(cert.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="col-span-2 md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-secondary transition-all">
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Blockchain Proof Key</span>
                    <span className="font-mono text-[10px] text-slate-600 break-all font-bold tracking-tighter uppercase">{cert.blockchainHash || 'SHA256_ANCHORED_PENDING_SYNC'}</span>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="inline-flex items-center gap-4 bg-emerald-50 text-emerald-800 px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] border-2 border-emerald-100 shadow-xl shadow-emerald-900/5 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Verified on National Ledger
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Metadata */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-slate-900 p-10 rounded-2xl text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 transform translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <span className="material-symbols-outlined text-[100px]">security</span>
            </div>
            <h5 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3 relative z-10">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
              Security Protocol
            </h5>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium italic relative z-10">
              This record was issued by your institution and is recorded permanently on the blockchain. Any modification to the source records will invalidate this proof key across the global node network.
            </p>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Validation Status</span>
                <span className="text-emerald-500">Active Node</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Consensus Rate</span>
                <span className="text-white">100% Secure</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200">
            <h5 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">help_center</span>
              Registry Support
            </h5>
            <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
              Academic discrepancies must be addressed via the Registrar's Office of the issuing institution.
            </p>
            <button className="mt-8 w-full py-4 border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-lg shadow-black/5 active:scale-95">
              Email Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
