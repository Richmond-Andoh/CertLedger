import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { certificateService } from '../services/api';

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    qualification: '',
    grade: '',
    issueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        institution: user?.institution || 'Global Academic Ledger'
      };
      const response = await certificateService.issue(payload);
      if (response.data.success) {
        toast.success('Certificate anchored to blockchain successfully!', {
          duration: 5000,
          icon: '🛡️',
        });
        setSuccessData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue certificate. Protocol error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface uppercase">Issue New Certificate</h1>
          <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed font-medium italic">
            Initiate a cryptographic record for an academic qualification. This action is <span className="text-secondary font-bold">irreversible</span> once committed to the blockchain.
          </p>
        </div>
        <div className="flex gap-3 items-center bg-surface-container-highest px-6 py-3 rounded-xl border border-outline-variant/30 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Auth Station</span>
            <span className="text-xs font-bold text-on-surface uppercase">Registrar Node</span>
          </div>
        </div>
      </div>

      {/* Form Card or Success UI */}
      {successData ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-2xl shadow-black/5 border border-outline-variant/10 overflow-hidden p-12">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-on-surface uppercase tracking-tight">Issuance Successful</h2>
              <p className="text-on-surface-variant font-medium max-w-lg mx-auto">
                The certificate has been permanently anchored to the Sepolia blockchain. A student portal account has been automatically provisioned.
              </p>
            </div>
            
            <div className="w-full bg-slate-50 p-8 rounded-xl border border-slate-200 text-left space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction Hash</label>
                <p className="font-mono text-sm text-slate-800 break-all bg-white p-3 rounded-lg border border-slate-100 mt-2">{successData.transactionHash}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Student Username</label>
                  <p className="font-mono text-sm text-slate-800 font-bold bg-white p-3 rounded-lg border border-slate-100 mt-2">{successData.studentCredentials.username}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Temporary Password</label>
                  <p className="font-mono text-sm text-amber-700 font-bold bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">{successData.studentCredentials.temporaryPassword}</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 font-medium italic mt-2">
                ⚠️ Important: Securely share these credentials with the student. They will be forced to change this password on first login.
              </p>
            </div>

            <div className="flex gap-4 w-full pt-6">
              <button
                onClick={() => {
                  setSuccessData(null);
                  setFormData({ studentName: '', studentId: '', qualification: '', grade: '', issueDate: '' });
                }}
                className="w-full px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 border-2 border-slate-200 hover:border-slate-400 hover:text-slate-700 transition-all active:scale-95 bg-white"
              >
                Issue Another
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-slate-900 text-amber-500 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl shadow-2xl shadow-black/5 border border-outline-variant/10 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-12 space-y-10">
            {/* Section: Student Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Student Full Name</label>
                <input 
                  required
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-4 text-on-surface font-bold focus:border-secondary focus:bg-white focus:ring-0 transition-all placeholder:text-slate-300 shadow-inner" 
                  placeholder="e.g. Kwame Mensah" 
                  type="text"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Student ID Number</label>
                <input 
                  required
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-4 text-on-surface font-bold focus:border-secondary focus:bg-white focus:ring-0 transition-all placeholder:text-slate-300 shadow-inner" 
                  placeholder="UG-2024-XXXX" 
                  type="text"
                />
              </div>
            </div>

            {/* Section: Institution (Read Only) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Issuing Authority</label>
              <div className="w-full bg-primary-container/95 text-white font-black rounded-xl px-6 py-4 flex items-center justify-between shadow-xl shadow-blue-900/10 transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-4">
                   <span className="material-symbols-outlined text-secondary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>lock_person</span>
                   <span className="uppercase tracking-widest text-sm">{user?.institution || 'Global Academic Ledger'}</span>
                </div>
                <span className="text-[10px] opacity-40 font-mono hidden sm:block">NODE_SYNCED_2024_GH</span>
              </div>
            </div>

            {/* Section: Qualification */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Qualification Title</label>
              <input 
                required
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-4 text-on-surface font-bold focus:border-secondary focus:bg-white focus:ring-0 transition-all placeholder:text-slate-300 shadow-inner" 
                placeholder="e.g. BSc Computer Science" 
                type="text"
              />
            </div>

            {/* Section: Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Date of Award</label>
                <input 
                  required
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-4 text-on-surface font-bold focus:border-secondary focus:bg-white focus:ring-0 transition-all shadow-inner" 
                  type="date"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-1">Classification / Grade</label>
                <select 
                  required
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-4 text-on-surface font-bold focus:border-secondary focus:bg-white focus:ring-0 transition-all shadow-inner appearance-none cursor-pointer"
                >
                  <option disabled value="">Select classification</option>
                  <option value="First Class">First Class Honours</option>
                  <option value="Second Class Upper">Second Class Upper</option>
                  <option value="Second Class Lower">Second Class Lower</option>
                  <option value="Third Class">Third Class</option>
                  <option value="Pass">Pass</option>
                  <option value="Distinction">Distinction</option>
                  <option value="Merit">Merit</option>
                </select>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-slate-900 p-6 rounded-2xl flex gap-5 items-start border border-white/5 shadow-2xl">
              <div className="p-2 bg-amber-500 rounded-lg">
                <span className="material-symbols-outlined text-slate-900" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                A <span className="text-white font-bold">SHA-256 cryptographic hash</span> of the identity and academic metadata will be anchored to the blockchain. A student account will be provisioned automatically, allowing the recipient to claim these digital credentials via their private key.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-slate-50 px-12 py-8 flex flex-col sm:flex-row justify-end gap-6 items-center border-t border-outline-variant/30">
            <button 
              type="button"
              className="w-full sm:w-auto px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 border-2 border-slate-200 hover:border-slate-400 hover:text-slate-700 transition-all active:scale-95 bg-white"
              onClick={() => navigate('/dashboard')}
            >
              Cancel Transaction
            </button>
            <button 
              type="submit"
              disabled={loading}
              className={`
                w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em]
                bg-slate-900 text-amber-500 shadow-2xl shadow-black/40 hover:scale-[1.03] active:scale-95 transition-all
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full font-black"></div>
              ) : (
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              )}
              {loading ? 'Mining Record...' : 'Securely Issue Credential'}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* Trust Badges */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 opacity-80">
        <div className="space-y-4 text-center md:text-left group">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface">Immutable Storage</h3>
          <p className="text-[10px] font-medium text-on-surface-variant leading-relaxed">Records are anchored using cryptographic proofs that cannot be altered or deleted by any institutional node.</p>
        </div>
        <div className="space-y-4 text-center md:text-left group">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface">Instant Verification</h3>
          <p className="text-[10px] font-medium text-on-surface-variant leading-relaxed">Global administrative nodes and employers can verify this hash instantly via the secure verification proxy.</p>
        </div>
        <div className="space-y-4 text-center md:text-left group">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface">Global Utility</h3>
          <p className="text-[10px] font-medium text-on-surface-variant leading-relaxed">Compliant with the Ghanaian Digital Identity Framework and international W3C Verifiable Credentials standards.</p>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;
