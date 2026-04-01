import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { certificateService } from '../services/api';

const CertificateVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [view, setView] = useState('form'); // 'form', 'loading', 'result'
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    institution: '',
    qualification: '',
    issueDate: '',
    grade: ''
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    // If ID is provided in URL, we could potentially auto-trigger if we had more info
    // But for public verification, we usually need the full form for security entropy
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setView('loading');
    
    try {
      const response = await certificateService.verify(formData);
      setResult(response.data);
      setTimeout(() => setView('result'), 1500); // Simulate blockchain consensus delay
    } catch (error) {
      toast.error('Network protocol error. Failed to reach ledger node.');
      setResult({ isValid: false, message: 'Institutional node connection timeout.' });
      setView('result');
    }
  };

  const handleReset = () => {
    setFormData({
      studentName: '',
      studentId: '',
      institution: '',
      qualification: '',
      issueDate: '',
      grade: ''
    });
    setResult(null);
    setView('form');
  };

  if (view === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative w-32 h-32 mb-12">
           <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
           <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center shadow-xl">
             <span className="material-symbols-outlined text-secondary text-4xl animate-pulse">lock_open</span>
           </div>
        </div>
        <h2 className="text-2xl font-black text-on-surface uppercase tracking-tighter mb-2">Cryptographic Audit in Progress</h2>
        <p className="text-on-surface-variant font-medium text-xs uppercase tracking-[0.3em] animate-pulse italic">Scanning National Ledger for proof of existence...</p>
      </div>
    );
  }

  if (view === 'result') {
    if (result.isValid) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Success Hero Section */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border-2 border-emerald-100 shadow-xl shadow-emerald-500/10">
              <span className="material-symbols-outlined text-7xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-emerald-900 uppercase mb-4">VALID — Certificate Verified</h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed italic">
              This certificate is genuine and matches the immutable record anchored to the blockchain. The cryptographic hash has been successfully validated against the Institutional Ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Primary Details */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-12 shadow-2xl shadow-black/5 border border-slate-100 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 -translate-y-24 translate-x-24 rounded-full group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
               
               <div className="flex justify-between items-center mb-12 border-b border-slate-50 pb-8 relative z-10">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Verified Record Metadata</h2>
                  <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-900 text-amber-500 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    Blockchain Finalized
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                  {[
                    { label: 'Full Name', value: result.data?.studentName || formData.studentName },
                    { label: 'Student ID', value: result.data?.studentId || formData.studentId },
                    { label: 'Institution', value: result.data?.institution || formData.institution },
                    { label: 'Degree Title', value: result.data?.qualification || formData.qualification },
                    { label: 'Award Date', value: result.data?.issueDate ? new Date(result.data.issueDate).toLocaleDateString() : formData.issueDate },
                    { label: 'Classification', value: result.data?.grade || formData.grade },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-1 border-l-4 border-slate-100 pl-6 hover:border-emerald-500 transition-colors">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</span>
                       <span className="text-lg font-black text-slate-900">{item.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Verification Context */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-slate-900 rounded-3xl p-10 flex flex-col items-center text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 group">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-1000">
                   <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>
                <div className="relative z-10">
                  <div className="w-24 h-24 mb-6 bg-white/5 rounded-2xl flex items-center justify-center p-3 border border-white/10 group-hover:scale-110 transition-transform shadow-inner">
                     <span className="material-symbols-outlined text-amber-500 text-5xl">school</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Institutional Proof</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-8 font-medium italic">
                    Authenticated by the Academic Registry and anchored on the Ghanaian Institutional Integrity Protocol. Verified with 100% consensus.
                  </p>
                  <div className="w-full h-px bg-white/10 mb-8"></div>
                  <div className="text-[9px] font-mono break-all text-amber-500/80 bg-black/40 p-4 rounded-xl border border-white/5 font-black uppercase tracking-tighter">
                    KEY: {result.hash?.substring(0, 32)}...
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 flex items-start gap-4 border border-emerald-100">
                <span className="material-symbols-outlined text-emerald-600">verified</span>
                <div>
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-widest leading-relaxed">
                    Verified on <span className="text-emerald-900">{new Date().toLocaleString()} GMT</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="w-full bg-secondary text-white font-black py-5 rounded-2xl shadow-2xl shadow-secondary/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
              >
                <span className="material-symbols-outlined text-xl">restart_alt</span>
                Verify Another Certificate
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border-t-[12px] border-error relative overflow-hidden w-full">
            <div className="mb-10 inline-flex items-center justify-center w-28 h-28 rounded-full bg-error-container text-on-error-container shadow-xl animate-bounce">
              <span className="material-symbols-outlined text-7xl font-black">close</span>
            </div>
            
            <h1 className="text-4xl font-black text-error mb-4 tracking-tighter uppercase">Verification Failed</h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg mx-auto mb-12 italic font-medium">
              The details provided do not match any certificate in our synchronized blockchain registry. This record could not be authenticated.
            </p>

            <div className="bg-slate-50 rounded-2xl p-8 mb-12 text-left border border-slate-100 shadow-inner">
               <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-slate-400">policy</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Integrity Protocol Guidance</p>
               </div>
               <ul className="text-xs font-bold text-slate-600 space-y-3 leading-relaxed uppercase tracking-tighter">
                 <li className="flex gap-2 items-start"><span className="text-error">•</span> The identity fields must match the document exactly.</li>
                 <li className="flex gap-2 items-start"><span className="text-error">•</span> The date or qualification type may be typed incorrectly.</li>
                 <li className="flex gap-2 items-start"><span className="text-error">•</span> The certificate may be unofficial or tampered with.</li>
               </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={handleReset}
                className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-xs tracking-widest uppercase shadow-2xl hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-xl">refresh</span>
                Try Again
              </button>
              <button className="bg-white text-slate-500 border-2 border-slate-200 px-10 py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-xl">help_center</span>
                Contact Help
              </button>
            </div>
          </div>
          
          <div className="mt-12 flex items-center gap-3 text-slate-300 opacity-50 grayscale select-none">
             <span className="material-symbols-outlined">shield</span>
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Ghanaian Institutional Integrity Protocol</span>
          </div>
        </div>
      );
    }
  }

  // Intake Form View (Default)
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-16 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-slate-900 flex items-center justify-center rounded-2xl shadow-2xl shadow-slate-900/20 mb-8 border border-white/5 group">
          <span className="material-symbols-outlined text-5xl text-secondary group-hover:scale-125 transition-transform">verified_user</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
          Verify Academic Record
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl italic">
          Enter the following credential metadata to validate the authenticity of any document in our national verifiable registry.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.06)] p-12 md:p-16 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>
        
        <form onSubmit={handleVerify} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Student Full Name</label>
              <input 
                required
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                placeholder="KWAME MENSAH" 
                type="text"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Student ID Number</label>
              <input 
                required
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                placeholder="UG-2024-XXXX" 
                type="text"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Issuing Institution</label>
              <input 
                required
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                placeholder="UNIVERSITY OF GHANA" 
                type="text"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Qualification Title</label>
              <input 
                required
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                placeholder="BSC COMPUTER SCIENCE" 
                type="text"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Official Award Date</label>
              <input 
                required
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                type="date"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Classification / Grade</label>
              <select 
                required
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner appearance-none cursor-pointer"
              >
                <option value="">Select Classification</option>
                <option value="First Class">First Class Honours</option>
                <option value="Second Class Upper">Second Class Upper</option>
                <option value="Second Class Lower">Second Class Lower</option>
                <option value="Third Class">Third Class</option>
                <option value="Pass">Pass</option>
                <option value="Distinction">Distinction</option>
              </select>
            </div>
          </div>

          <div className="pt-8">
            <button 
              className="w-full bg-slate-900 text-amber-500 h-20 rounded-2xl font-black text-xs tracking-[0.3em] uppercase shadow-2xl shadow-black/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group" 
              type="submit"
            >
              <span className="material-symbols-outlined text-2xl group-hover:rotate-45 transition-transform">lock_open</span>
              Execute Verification Audit
            </button>
          </div>
        </form>

        <div className="mt-16 flex items-center justify-center gap-3 text-slate-400">
           <span className="material-symbols-outlined text-sm">info</span>
           <p className="text-[9px] font-black uppercase tracking-[0.2em]">Public ledger audit station • Encrypted & Non-Custodial</p>
        </div>
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-center gap-16 opacity-30 grayscale saturate-0 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
         <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
         <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
         <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default CertificateVerification;
