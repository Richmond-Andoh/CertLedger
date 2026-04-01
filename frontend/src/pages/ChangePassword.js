import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    if (formData.newPassword.length < 8) {
      return toast.error('New password must be at least 8 characters.');
    }

    setLoading(true);
    try {
      // The API expects certificateId as the username/slug
      const response = await authService.changePassword(user.username, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.success('Security Protocol Updated Successfully!', {
          icon: '🛡️',
        });
        // Redirect to student portal or dashboard
        if (user.role === 'student') {
          navigate(`/student/${user.username}`);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update security credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-container flex items-center justify-center p-6 selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <main className="w-full max-w-xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-slate-900 shadow-2xl mb-8 border border-white/5 group">
            <span className="material-symbols-outlined text-secondary text-5xl group-hover:rotate-180 transition-transform duration-700">lock_reset</span>
          </div>
          <h1 className="font-headline text-3xl font-black text-white tracking-tight uppercase">Credential Security</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 relative overflow-hidden border-t-[8px] border-secondary">
          <header className="mb-12">
            <h2 className="font-headline text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Access Control Update</h2>
            <p className="text-slate-500 font-medium leading-relaxed italic">
              You are accessing the institutional ledger via temporary credentials. Please establish a private access key to secure your academic records.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Temporary Password</label>
              <div className="relative group">
                <input 
                  required
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                  placeholder="Enter temporary password" 
                  type={showCurrent ? "text" : "password"}
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                >
                  <span className="material-symbols-outlined">{showCurrent ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Private Access Key</label>
              <div className="relative group">
                <input 
                  required
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                  placeholder="Minimum 8 characters" 
                  type={showNew ? "text" : "password"}
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                >
                  <span className="material-symbols-outlined">{showNew ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              
              {/* Strength Meter Simulation */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Entropy Level</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Optimal</span>
                </div>
                <div className="flex gap-1.5 h-1.5">
                  <div className="flex-1 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                  <div className="flex-1 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                  <div className="flex-1 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                  <div className="flex-1 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm Access Key</label>
              <div className="relative">
                <input 
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-xl text-slate-900 font-bold transition-all shadow-inner" 
                  placeholder="Repeat your new key" 
                  type="password"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className={`
                w-full h-20 bg-slate-900 text-amber-500 font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-black/30 
                hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `} 
              type="submit"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
              ) : (
                <>
                  Establish Secure Access
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-slate-400">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ghanaian Institutional Integrity Protocol</span>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Encrypted End-to-End • Non-Custodial Security Layer
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-400/50 uppercase tracking-[0.2em]">
            © 2024 Academic Ledger Technologies. Institutional Security Epoch 4.0
          </p>
        </footer>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-900/40 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
};

export default ChangePassword;
